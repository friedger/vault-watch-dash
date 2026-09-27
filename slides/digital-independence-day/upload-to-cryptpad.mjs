#!/usr/bin/env node
// Loads slides.md into a CryptPad presentation.
//
// CryptPad pads are end-to-end encrypted: the key lives in the URL fragment
// and there is no server-side API, so this script drives the real editor in
// a browser, replaces its content and waits for CryptPad to sync it.
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
// Requires Playwright: `npm install playwright` (or `npx playwright install chromium`).

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

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

async function findEditorFrame(page, url, timeoutMs = 60_000) {
  // CryptPad renders the app inside a sandboxed iframe (#sbox-iframe) on a
  // separate origin; look for the CodeMirror instance in any frame.
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    for (const frame of page.frames()) {
      const state = await frame
        .evaluate(() => {
          const el = document.querySelector(".CodeMirror");
          if (el && el.CodeMirror) return "editor";
          return /does not provide access to the document/.test(document.body?.innerText ?? "") ? "no-access" : "";
        })
        .catch(() => "");
      if (state === "editor") return frame;
      if (state === "no-access") {
        throw new Error(
          isSafeLink(url)
            ? "CryptPad refused the link: it is a safe link (#/3/…) without the encryption key.\n" +
                "Either run `node upload-to-cryptpad.mjs --login` once and log in with an account that has\n" +
                "the pad in its CryptDrive, or pass the full edit link (#/2/…) from Share → Link with --url."
            : "CryptPad refused the link: it does not provide access to the document.",
        );
      }
    }
    await page.waitForTimeout(1000);
  }
  throw new Error("CryptPad editor did not load (no CodeMirror instance found).");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const markdown = await readFile(args.file, "utf8");
  const slideCount = markdown.split(/^---\s*$/m).length;
  console.log(`Loaded ${args.file} (${slideCount} slides).`);

  if (args.dryRun) {
    console.log(markdown);
    return;
  }

  const { chromium } = await import("playwright");
  // A persistent profile keeps the CryptPad login (and its CryptDrive) between runs.
  const context = await chromium.launchPersistentContext(args.profile, { headless: !(args.headed || args.login) });
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

    const frame = await findEditorFrame(page, args.url);
    console.log("Editor ready, waiting for the pad to finish loading…");

    // Wait until the editor is writable (CryptPad keeps it read-only while
    // the history is still being downloaded and decrypted).
    await frame.waitForFunction(
      () => {
        const cm = document.querySelector(".CodeMirror")?.CodeMirror;
        return cm && !cm.getOption("readOnly");
      },
      null,
      { timeout: 60_000 },
    );

    const previous = await frame.evaluate(() => document.querySelector(".CodeMirror").CodeMirror.getValue());
    if (previous.trim()) {
      console.log(`Replacing existing content (${previous.length} characters).`);
    }

    await frame.evaluate((text) => {
      const cm = document.querySelector(".CodeMirror").CodeMirror;
      cm.setValue(text);
      cm.focus();
    }, markdown);

    // Confirm the content landed, then give ChainPad time to push the patch
    // to the server before closing the browser.
    const stored = await frame.evaluate(() => document.querySelector(".CodeMirror").CodeMirror.getValue());
    if (stored !== markdown) throw new Error("Editor content does not match slides.md after writing.");

    console.log("Content written, waiting for CryptPad to save…");
    await page.waitForTimeout(10_000);
    console.log(`Done. Open ${args.url} to view the presentation.`);
  } finally {
    await context.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
