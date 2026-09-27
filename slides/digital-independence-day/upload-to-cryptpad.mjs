#!/usr/bin/env node
// Uploads the deck to a CryptPad presentation.
//
// CryptPad pads are end-to-end encrypted: the key lives in the URL (or in the
// CryptDrive for "safe links") and there is no server-side API, so this script
// drives the real CryptPad web app in a browser.
//
// CryptPad has two slide apps:
//   /presentation/  OnlyOffice (PowerPoint-style) → slides.md is converted to
//                   slides.pptx (build-pptx.mjs) and loaded with File → Import.
//                   The import replaces the whole presentation.
//   /slide/         Markdown slides → slides.md is written into the editor.
//
// Usage:
//   node upload-to-cryptpad.mjs [--url <cryptpad edit url>] [--file slides.md] [--headed] [--dry-run]
//   node upload-to-cryptpad.mjs --login   # log in once so "safe links" (#/3/...) can be opened
//
// Links of the form #/2/<app>/edit/<key>/ carry the encryption key and work
// as they are. Links of the form #/3/<app>/edit/<channel>/ ("safe links") only
// carry the pad's channel id; the keys come from the CryptDrive of a logged-in
// user. For those, run --login once: the browser profile (and thus the login)
// is kept in --profile (default: .cryptpad-profile next to this script).
//
// Requires: `npm install` in this directory (playwright, pptxgenjs).

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPptx } from "./build-pptx.mjs";

const DEFAULT_URL =
  "https://cryptpad.fr/presentation/#/3/presentation/edit/353589968926067f9255e7bbcfb9fd1d/";

const here = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = {
    url: DEFAULT_URL,
    file: resolve(here, "slides.md"),
    profile: resolve(here, ".cryptpad-profile"),
    headed: false,
    dryRun: false,
    login: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--url") args.url = argv[++i];
    else if (a === "--file") args.file = resolve(argv[++i]);
    else if (a === "--profile") args.profile = resolve(argv[++i]);
    else if (a === "--headed") args.headed = true;
    else if (a === "--login") args.login = true;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "-h" || a === "--help") {
      console.log(
        "node upload-to-cryptpad.mjs [--url <url>] [--file <md>] [--profile <dir>] [--headed] [--dry-run] [--login]",
      );
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${a}`);
      process.exit(1);
    }
  }
  return args;
}

const isSafeLink = (url) => /#\/3\//.test(url);
const isMarkdownSlides = (url) => new URL(url).pathname.startsWith("/slide/");

const NO_ACCESS_HELP = (url) =>
  isSafeLink(url)
    ? "CryptPad refused the link: it is a safe link (#/3/…) without the encryption key.\n" +
      "Either run `node upload-to-cryptpad.mjs --login` once and log in with an account that has\n" +
      "the pad in its CryptDrive, or pass the full edit link (#/2/…) from Share → Link with --url."
    : "CryptPad refused the link: it does not provide access to the document.";

// Polls every frame with `probe` until it returns a truthy value.
// CryptPad renders the app in sandboxed iframes on a separate origin.
async function pollFrames(page, probe, { arg, timeoutMs = 60_000, what = "CryptPad" } = {}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    for (const frame of page.frames()) {
      const result = await frame.evaluate(probe, arg).catch(() => null);
      if (result) return { frame, result };
    }
    await page.waitForTimeout(1000);
  }
  throw new Error(`Timed out waiting for ${what}.`);
}

// --- /slide/ (Markdown) ------------------------------------------------------

async function uploadMarkdown(page, url, markdown) {
  const { frame, result } = await pollFrames(
    page,
    () => {
      const el = document.querySelector(".CodeMirror");
      if (el && el.CodeMirror) return "editor";
      return /does not provide access to the document/.test(document.body?.innerText ?? "") ? "no-access" : null;
    },
    { what: "the Markdown editor" },
  );
  if (result === "no-access") throw new Error(NO_ACCESS_HELP(url));

  // CryptPad keeps the editor read-only while the history is being decrypted.
  await frame.waitForFunction(() => !document.querySelector(".CodeMirror").CodeMirror.getOption("readOnly"), null, {
    timeout: 60_000,
  });
  await frame.evaluate((text) => document.querySelector(".CodeMirror").CodeMirror.setValue(text), markdown);
  const stored = await frame.evaluate(() => document.querySelector(".CodeMirror").CodeMirror.getValue());
  if (stored !== markdown) throw new Error("Editor content does not match slides.md after writing.");
  console.log("Content written, waiting for CryptPad to save…");
  await page.waitForTimeout(10_000);
}

// --- /presentation/ (OnlyOffice) ---------------------------------------------

async function dismissDonationPopup(frame) {
  const notNow = frame.locator(".alertify button", { hasText: /not now/i });
  if (await notNow.count()) await notNow.first().click();
}

async function uploadPptx(page, url, pptxPath, slideCount) {
  // The CryptPad toolbar lives in the sandbox frame; OnlyOffice runs in a nested frame.
  const { frame: app, result } = await pollFrames(
    page,
    () => {
      if (/does not provide access to the document/.test(document.body?.innerText ?? "")) return "no-access";
      return document.querySelector(".cp-toolbar-file button") ? "toolbar" : null;
    },
    { what: "the CryptPad toolbar" },
  );
  if (result === "no-access") throw new Error(NO_ACCESS_HELP(url));

  console.log("Waiting for OnlyOffice to load…");
  await pollFrames(page, () => /Slide \d+ of \d+/.test(document.body?.innerText ?? ""), {
    what: "the OnlyOffice editor",
    timeoutMs: 90_000,
  });
  await page.waitForTimeout(2000);
  await dismissDonationPopup(app);

  console.log("Importing slides.pptx (File → Import)…");
  await app.locator(".cp-toolbar-file button").first().click();
  const chooser = page.waitForEvent("filechooser", { timeout: 15_000 });
  await app.locator(".cp-toolbar-file .cp-dropdown-content > *", { hasText: /^Import$/ }).click();
  await (await chooser).setFiles(pptxPath);

  // Wait until OnlyOffice shows the imported deck, or CryptPad refuses.
  const { result: outcome } = await pollFrames(
    page,
    (count) => {
      const text = document.body?.innerText ?? "";
      if (/not allowed while other users are present/i.test(text)) return "others-present";
      const m = text.match(/Slide \d+ of (\d+)/);
      return m && Number(m[1]) === count ? "imported" : null;
    },
    { arg: slideCount, what: "the import to finish", timeoutMs: 120_000 },
  ).catch(() => ({ result: "timeout" }));

  if (outcome === "others-present") {
    throw new Error(
      'CryptPad: "Uploading is not allowed while other users are present."\n' +
        "Close the pad in every other browser tab/device (including your own) and run the script again.\n" +
        "If it was just open somewhere, wait a minute for that session to time out.",
    );
  }
  if (outcome === "timeout") {
    throw new Error(`The presentation did not show ${slideCount} slides after the import. Re-run with --headed to watch.`);
  }

  console.log(`Imported ${slideCount} slides, waiting for CryptPad to save…`);
  await page.waitForTimeout(15_000);
}

// -----------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const markdown = await readFile(args.file, "utf8");
  const slideCount = markdown.split(/^---\s*$/m).length;
  console.log(`Loaded ${args.file} (${slideCount} slides).`);

  const markdownMode = isMarkdownSlides(args.url);
  let pptxPath;
  if (!markdownMode) {
    ({ out: pptxPath } = await buildPptx(args.file));
    console.log(`Built ${pptxPath}.`);
  }
  if (args.dryRun) return;

  const { chromium } = await import("playwright");
  // A persistent profile keeps the CryptPad login (and its CryptDrive) between runs.
  const context = await chromium.launchPersistentContext(args.profile, {
    headless: !(args.headed || args.login),
    viewport: { width: 1400, height: 900 },
  });
  const page = context.pages()[0] ?? (await context.newPage());

  if (args.login) {
    await page.goto(new URL("/login/", args.url).href);
    console.log(`Log in to CryptPad in the browser window, then close it. Profile: ${args.profile}`);
    await context.waitForEvent("close", { timeout: 0 });
    console.log("Login saved. Now run the script without --login.");
    return;
  }

  try {
    console.log("Opening CryptPad…");
    await page.goto(args.url, { waitUntil: "domcontentloaded" });
    if (markdownMode) await uploadMarkdown(page, args.url, markdown);
    else await uploadPptx(page, args.url, pptxPath, slideCount);
    console.log(`Done. Open ${args.url} to view the presentation.`);
  } finally {
    await context.close();
  }
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
