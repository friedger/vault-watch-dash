#!/usr/bin/env node
// Loads slides.md into a CryptPad presentation.
//
// CryptPad pads are end-to-end encrypted: the key lives in the URL fragment
// and there is no server-side API, so this script drives the real editor in
// a browser, replaces its content and waits for CryptPad to sync it.
//
// Usage:
//   node upload-to-cryptpad.mjs [--url <cryptpad edit url>] [--file slides.md] [--headed] [--dry-run]
//
// Requires Playwright: `npm install playwright` (or `npx playwright install chromium`).

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_URL =
  "https://cryptpad.fr/presentation/#/3/presentation/edit/353589968926067f9255e7bbcfb9fd1d/";

const here = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = { url: DEFAULT_URL, file: resolve(here, "slides.md"), headed: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--url") args.url = argv[++i];
    else if (a === "--file") args.file = resolve(argv[++i]);
    else if (a === "--headed") args.headed = true;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "-h" || a === "--help") {
      console.log("node upload-to-cryptpad.mjs [--url <url>] [--file <md>] [--headed] [--dry-run]");
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${a}`);
      process.exit(1);
    }
  }
  return args;
}

async function findEditorFrame(page, timeoutMs = 60_000) {
  // CryptPad renders the app inside a sandboxed iframe (#sbox-iframe) on a
  // separate origin; look for the CodeMirror instance in any frame.
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    for (const frame of page.frames()) {
      const found = await frame
        .evaluate(() => {
          const el = document.querySelector(".CodeMirror");
          return Boolean(el && el.CodeMirror);
        })
        .catch(() => false);
      if (found) return frame;
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
  const browser = await chromium.launch({ headless: !args.headed });
  const page = await browser.newPage();

  try {
    console.log("Opening CryptPad…");
    await page.goto(args.url, { waitUntil: "domcontentloaded" });

    const frame = await findEditorFrame(page);
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
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
