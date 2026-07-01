#!/usr/bin/env node
// Generate src/redirects.ts from a Wix "URL Redirect Manager" CSV export.
//
// Usage:
//   node scripts/generate-wix-redirects.mjs <path-to-wix-export.csv> [--write] [--report]
//
// Wix export columns: "Old URL","New URL","Redirect Type","Redirect Status","Notes"
//
// Junk filter (per product decision — "exclude obvious junk"):
//   - Wix editor artifacts: any path segment containing "copy-of", or /blank(-N)
//   - Self-redirects: source === destination after trailing-slash normalization
//   - Loop members: any source that participates in a redirect cycle (A->B->...->A)
//   - Inactive rows (Redirect Status !== "Active")
// Everything else (including legacy but meaningful redirects) is kept, so the
// React site mirrors the live Wix 301s for SEO continuity.

import fs from "node:fs";
import path from "node:path";

const csvPath = process.argv[2];
const WRITE = process.argv.includes("--write");
const REPORT = process.argv.includes("--report");
if (!csvPath) {
  console.error("Usage: node scripts/generate-wix-redirects.mjs <wix-export.csv> [--write] [--report]");
  process.exit(1);
}

// --- tiny CSV parser (handles quoted fields, commas, embedded quotes) ---
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", inQ = false;
  text = text.replace(/^﻿/, ""); // strip BOM
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      if (field !== "" || row.length) { row.push(field); rows.push(row); row = []; field = ""; }
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const norm = (u) => (u.length > 1 ? u.replace(/\/+$/, "") : u); // drop trailing slash (Next handles it)

const raw = fs.readFileSync(csvPath, "utf8");
const rows = parseCsv(raw);
const header = rows.shift().map((h) => h.trim());
const iOld = header.indexOf("Old URL");
const iNew = header.indexOf("New URL");
const iStatus = header.indexOf("Redirect Status");
if (iOld < 0 || iNew < 0) { console.error("Missing Old URL / New URL columns"); process.exit(1); }

const excluded = { inactive: [], copyOf: [], blank: [], self: [], loop: [] };
let entries = [];
for (const r of rows) {
  const src = (r[iOld] || "").trim();
  const dst = (r[iNew] || "").trim();
  const status = iStatus >= 0 ? (r[iStatus] || "").trim() : "Active";
  if (!src || !dst) continue;
  if (status && status !== "Active") { excluded.inactive.push(src); continue; }
  if (/(^|\/)copy-of/i.test(src)) { excluded.copyOf.push(src); continue; }
  if (/(^|\/)blank(-\d+)?(\/|$)/i.test(src)) { excluded.blank.push(src); continue; }
  if (norm(src) === norm(dst)) { excluded.self.push(src); continue; }
  entries.push({ source: src, destination: dst });
}

// loop detection over the surviving map (relative destinations only)
const map = new Map(entries.map((e) => [norm(e.source), norm(e.destination)]));
function inCycle(start) {
  let slow = start, fast = start;
  for (let i = 0; i < 1000; i++) {
    fast = map.get(fast); if (fast === undefined) return false;
    fast = map.get(fast); if (fast === undefined) return false;
    slow = map.get(slow);
    if (slow === fast) return true;
  }
  return false;
}
entries = entries.filter((e) => {
  if (e.destination.startsWith("http")) return true; // external, cannot loop internally
  if (inCycle(norm(e.source))) { excluded.loop.push(e.source); return false; }
  return true;
});

entries.sort((a, b) => a.source.localeCompare(b.source));

const body = entries
  .map((e) => `  {\n    "source": ${JSON.stringify(e.source)},\n    "destination": ${JSON.stringify(e.destination)},\n    "permanent": true\n  }`)
  .join(",\n");
const out = `// Auto-generated from Wix migration SEO redirects (fruitionservices.io).
// Regenerate with: node scripts/generate-wix-redirects.mjs <wix-export.csv> --write
// Do not hand-edit individual entries — re-run the generator instead.

import type { Redirect } from "next/dist/lib/load-custom-routes";

export const wixRedirects: Redirect[] = [
${body}
];
`;

const outPath = path.join(process.cwd(), "src", "redirects.ts");
if (WRITE) { fs.writeFileSync(outPath, out); console.error(`Wrote ${entries.length} redirects -> ${outPath}`); }
else { console.error(`[dry-run] ${entries.length} redirects would be written (pass --write to save)`); }

const totalExcluded = Object.values(excluded).reduce((n, a) => n + a.length, 0);
console.error(`Kept: ${entries.length} | Excluded: ${totalExcluded}` +
  ` (inactive ${excluded.inactive.length}, copy-of ${excluded.copyOf.length}, blank ${excluded.blank.length}, self ${excluded.self.length}, loop ${excluded.loop.length})`);
if (REPORT) {
  for (const [k, arr] of Object.entries(excluded)) if (arr.length) console.error(`\n-- excluded:${k} --\n` + arr.sort().join("\n"));
}
