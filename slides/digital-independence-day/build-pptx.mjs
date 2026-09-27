#!/usr/bin/env node
// Builds slides.pptx from slides.md.
//
// The CryptPad "presentation" app is an OnlyOffice (PowerPoint-style) editor,
// so the Markdown deck is converted into a real .pptx that CryptPad can import.
//
// Supported Markdown, per slide (slides are separated by a line with `---`):
//   # Title           → title slide (dark background)
//   ## Title          → content slide title
//   ### Subtitle      → subtitle
//   - item / 1. item  → bullets / numbered items (indent with two spaces)
//   | a | b |         → table (the |---| separator row is skipped)
//   > quote           → highlighted quote
//   other text        → paragraph; **bold** and *italic* work everywhere
//
// Usage: node build-pptx.mjs [--file slides.md] [--out slides.pptx]

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import PptxGenJS from "pptxgenjs";

const here = dirname(fileURLToPath(import.meta.url));

const FOOTER = "Digital Independence Day · Open Commons Day · Commons Hub Brussels · 4 October 2026";
const COLORS = { dark: "1B2A41", accent: "2A9D8F", highlight: "E9C46A", text: "1F2933", muted: "6B7785", light: "F4F7F6" };
const FONT = "Open Sans";

// "Some **bold** and *italic* text" → pptxgenjs text runs
function inlineRuns(text, base = {}) {
  const runs = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) runs.push({ text: text.slice(last, m.index), options: { ...base } });
    const bold = m[0].startsWith("**");
    runs.push({ text: m[0].slice(bold ? 2 : 1, bold ? -2 : -1), options: { ...base, bold: bold || base.bold, italic: !bold || base.italic } });
    last = m.index + m[0].length;
  }
  if (last < text.length) runs.push({ text: text.slice(last), options: { ...base } });
  return runs;
}

function parseSlide(chunk) {
  const slide = { title: "", level: 2, subtitle: "", body: [], table: [], quote: "" };
  for (const raw of chunk.split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    let m;
    if ((m = line.match(/^(#{1,2})\s+(.*)/))) {
      slide.title = m[2];
      slide.level = m[1].length;
    } else if ((m = line.match(/^###\s+(.*)/))) slide.subtitle = m[1];
    else if ((m = line.match(/^\|(.*)\|$/))) {
      const cells = m[1].split("|").map((c) => c.trim());
      if (!cells.every((c) => /^:?-+:?$/.test(c))) slide.table.push(cells);
    } else if ((m = line.match(/^>\s?(.*)/))) slide.quote = m[1];
    else if ((m = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)/))) {
      slide.body.push({ text: m[3], indent: Math.floor(m[1].length / 2), numbered: /\d/.test(m[2]) });
    } else slide.body.push({ text: line.trim(), plain: true });
  }
  return slide;
}

function bodyParagraphs(items, { color, fontSize }) {
  return items.flatMap((item, i) => {
    const runs = inlineRuns(item.text, { color, fontSize: item.indent ? fontSize - 3 : fontSize });
    const para = item.plain
      ? { paraSpaceAfter: 6 }
      : {
          bullet: item.numbered ? { type: "number" } : { indent: 18 },
          indentLevel: item.indent,
          paraSpaceAfter: 8,
        };
    runs.forEach((r, j) => {
      Object.assign(r.options, para);
      if (j === runs.length - 1 && i < items.length - 1) r.options.breakLine = true;
    });
    return runs;
  });
}

function addTitleSlide(pptx, s) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.dark };
  slide.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.55, w: 1.2, h: 0.12, fill: { color: COLORS.highlight }, line: { color: COLORS.highlight } });
  slide.addText(inlineRuns(s.title), { x: 0.8, y: 1.8, w: 11.7, h: 1.4, fontFace: FONT, fontSize: 48, bold: true, color: "FFFFFF", valign: "top", margin: 0 });
  if (s.subtitle) {
    slide.addText(inlineRuns(s.subtitle), { x: 0.8, y: 3.2, w: 11.7, h: 0.8, fontFace: FONT, fontSize: 24, color: COLORS.highlight, valign: "top", margin: 0 });
  }
  if (s.body.length) {
    const runs = bodyParagraphs(s.body, { color: "D9E2EC", fontSize: 18 });
    slide.addText(runs, { x: 0.8, y: 4.5, w: 11.7, h: 2.2, fontFace: FONT, valign: "top", margin: 0 });
  }
}

function addContentSlide(pptx, s, index, total) {
  const slide = pptx.addSlide();
  slide.background = { color: "FFFFFF" };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.18, h: 7.5, fill: { color: COLORS.accent }, line: { color: COLORS.accent } });
  slide.addText(inlineRuns(s.title), { x: 0.7, y: 0.4, w: 11.9, h: 0.9, fontFace: FONT, fontSize: 34, bold: true, color: COLORS.dark, valign: "middle", margin: 0 });

  let y = 1.55;
  if (s.subtitle) {
    slide.addText(inlineRuns(s.subtitle), { x: 0.7, y, w: 11.9, h: 0.6, fontFace: FONT, fontSize: 20, color: COLORS.accent, margin: 0 });
    y += 0.7;
  }
  const bottom = s.quote ? 5.6 : 6.6;
  if (s.body.length) {
    const h = s.table.length ? Math.min(0.55 * s.body.length, 1.5) : bottom - y;
    slide.addText(bodyParagraphs(s.body, { color: COLORS.text, fontSize: 22 }), { x: 0.7, y, w: 11.9, h, fontFace: FONT, valign: "top", margin: 0 });
    y += h + 0.2;
  }
  if (s.table.length) {
    const [head, ...rows] = s.table;
    const cell = (text, extra) => ({ text: inlineRuns(text), options: { fontFace: FONT, fontSize: 16, color: COLORS.text, valign: "middle", ...extra } });
    slide.addTable(
      [
        head.map((c) => cell(c, { bold: true, color: "FFFFFF", fill: { color: COLORS.dark } })),
        ...rows.map((r, i) => r.map((c) => cell(c, { fill: { color: i % 2 ? "FFFFFF" : COLORS.light } }))),
      ],
      { x: 0.7, y, w: 11.9, colW: [4.2, 7.7], rowH: 0.5, border: { type: "solid", pt: 0.5, color: "D0D7DE" }, margin: 0.08 },
    );
  }
  if (s.quote) {
    slide.addShape(pptx.ShapeType.rect, { x: 0.7, y: 5.6, w: 11.9, h: 0.9, fill: { color: COLORS.light }, line: { color: COLORS.light } });
    slide.addShape(pptx.ShapeType.rect, { x: 0.7, y: 5.6, w: 0.08, h: 0.9, fill: { color: COLORS.highlight }, line: { color: COLORS.highlight } });
    slide.addText(inlineRuns(s.quote), { x: 1.0, y: 5.6, w: 11.4, h: 0.9, fontFace: FONT, fontSize: 24, italic: true, color: COLORS.dark, valign: "middle", margin: 0 });
  }
  slide.addText(FOOTER, { x: 0.7, y: 6.95, w: 10.5, h: 0.35, fontFace: FONT, fontSize: 11, color: COLORS.muted, margin: 0 });
  slide.addText(`${index + 1} / ${total}`, { x: 11.2, y: 6.95, w: 1.4, h: 0.35, fontFace: FONT, fontSize: 11, color: COLORS.muted, align: "right", margin: 0 });
}

export async function buildPptx(file = resolve(here, "slides.md"), out = resolve(here, "slides.pptx")) {
  const markdown = await readFile(file, "utf8");
  const slides = markdown.split(/^---\s*$/m).map(parseSlide);
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE"; // 13.33 × 7.5 in, 16:9
  pptx.author = "Friedger";
  pptx.title = "Digital Independence Day";
  slides.forEach((s, i) => (s.level === 1 ? addTitleSlide(pptx, s) : addContentSlide(pptx, s, i, slides.length)));
  await pptx.writeFile({ fileName: out });
  return { out, count: slides.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const opt = (name) => (argv.includes(name) ? resolve(argv[argv.indexOf(name) + 1]) : undefined);
  const { out, count } = await buildPptx(opt("--file"), opt("--out"));
  console.log(`Wrote ${out} (${count} slides).`);
}
