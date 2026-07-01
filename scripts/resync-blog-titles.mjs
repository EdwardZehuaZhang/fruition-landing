#!/usr/bin/env node
/**
 * Re-sync Sanity blogPost titles with the live site's display (OG) title.
 *
 * WHY: the original migration set `title` from JSON-LD `headline` (falling back
 * to og:title). Where a post's structured-data headline differed from its
 * visible/OG title, Sanity ended up with an SEO-divergent title
 * (e.g. make-com-use-cases). This re-derives the correct title from the live
 * page's og:title (stripping the "| Fruition Services | Author" suffix) and
 * patches Sanity where they differ.
 *
 * Usage:
 *   node scripts/resync-blog-titles.mjs                 # DRY RUN (no writes) — prints divergences
 *   node scripts/resync-blog-titles.mjs --write         # patch `title` on divergent docs
 *   node scripts/resync-blog-titles.mjs --write --seo   # also overwrite `seoTitle` to match
 *   node scripts/resync-blog-titles.mjs --limit 20      # only check first N (testing)
 *
 * Writes a full report to scripts/blog-title-report.json regardless of mode.
 */
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import fs from 'node:fs'
dotenv.config({ path: '.env.local' })

const WRITE = process.argv.includes('--write')
const ALSO_SEO = process.argv.includes('--seo')
const li = process.argv.indexOf('--limit')
const LIMIT = li >= 0 ? parseInt(process.argv[li + 1], 10) : Infinity
const BASE = 'https://www.fruitionservices.io/post/'
const CONCURRENCY = 6

const client = createClient({
  projectId: 'bt6nb58h',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
   .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/gi, "'").replace(/&#x27;/gi, "'")

// Known author names, populated from Sanity before the run, so we can strip
// a trailing "| Author" segment that some og:titles carry.
const AUTHORS = new Set()

// Read the og:title content in a quote-aware way (apostrophes inside a
// double-quoted attribute must NOT terminate the capture). Fall back to <title>.
function rawOgTitle(html) {
  const tag =
    html.match(/<meta\b[^>]*\bproperty=["']og:title["'][^>]*>/i)?.[0] ||
    html.match(/<meta\b[^>]*\bname=["']og:title["'][^>]*>/i)?.[0]
  if (tag) {
    const c = tag.match(/\bcontent=(?:"([^"]*)"|'([^']*)')/i)
    if (c) return c[1] ?? c[2]
  }
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  return t ? t[1] : null
}

// Turn a raw og:title/<title> into the clean display title.
// Handles: "Real | Fruition Services | Author", "Real | Author",
// "Fruition Services | Real | Author", and legit pipes inside the real title.
function cleanTitle(raw) {
  if (!raw) return null
  let t = decode(raw).trim()
  const fs = t.search(/\s*\|\s*Fruition Services\b/i)
  if (fs >= 0) t = t.slice(0, fs)                          // cut at branding marker
  t = t.replace(/^\s*Fruition Services\s*\|\s*/i, '')      // strip leading branding
  let parts = t.split('|').map((s) => s.trim()).filter(Boolean)
  while (parts.length > 1) {                               // strip trailing author/branding
    const last = parts[parts.length - 1]
    if (/^fruition\b/i.test(last) || AUTHORS.has(last)) parts.pop()
    else break
  }
  return parts.join(' | ').trim() || null
}

const extractLiveTitle = (html) => cleanTitle(rawOgTitle(html))

async function fetchLiveTitle(slug) {
  try {
    const res = await fetch(BASE + slug, {
      headers: { 'User-Agent': 'Mozilla/5.0 (title-resync)' },
      redirect: 'follow',
    })
    if (!res.ok) return { ok: false, status: res.status }
    const html = await res.text()
    return { ok: true, title: extractLiveTitle(html), finalUrl: res.url }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

async function mapLimit(items, n, fn) {
  const out = []
  let i = 0
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++
        out[idx] = await fn(items[idx], idx)
      }
    })
  )
  return out
}

const posts = await client.fetch(
  `*[_type=="blogPost"]| order(slug.current asc){_id,"slug":slug.current,title,seoTitle}`
)
// Build the author set so cleanTitle can strip a trailing "| Author" segment.
const authorList = await client.fetch(`array::unique(*[_type=="blogPost" && defined(author)].author)`)
for (const a of authorList) if (a) AUTHORS.add(String(a).trim())

const targets = posts.filter((p) => p.slug).slice(0, LIMIT)
console.log(`Checking ${targets.length} blogPost docs against live og:title...\n`)

const rows = await mapLimit(targets, CONCURRENCY, async (p) => {
  const live = await fetchLiveTitle(p.slug)
  const liveTitle = live.ok ? live.title : null
  const diverges = liveTitle && liveTitle !== p.title
  return { ...p, liveTitle, fetchOk: live.ok, status: live.status, error: live.error, diverges }
})

const divergent = rows.filter((r) => r.diverges)
const failed = rows.filter((r) => !r.fetchOk)

console.log(`Divergent titles: ${divergent.length}`)
console.log(`Fetch failures (skipped): ${failed.length}\n`)
for (const r of divergent) {
  console.log(`• /post/${r.slug}`)
  console.log(`    sanity: ${JSON.stringify(r.title)}`)
  console.log(`    live  : ${JSON.stringify(r.liveTitle)}`)
}
if (failed.length) {
  console.log('\nFetch failures:')
  for (const r of failed) console.log(`  /post/${r.slug} — ${r.status || r.error}`)
}

fs.writeFileSync('scripts/blog-title-report.json', JSON.stringify({ generatedAt: new Date().toISOString(), divergent, failed, all: rows }, null, 2))
console.log(`\nReport written to scripts/blog-title-report.json`)

if (WRITE && divergent.length) {
  console.log(`\n--write: patching ${divergent.length} docs${ALSO_SEO ? ' (title + seoTitle)' : ' (title only)'}...`)
  let tx = client.transaction()
  for (const r of divergent) {
    const set = { title: r.liveTitle }
    if (ALSO_SEO) set.seoTitle = r.liveTitle
    tx = tx.patch(r._id, (p) => p.set(set))
  }
  const res = await tx.commit()
  console.log(`Committed. Transaction: ${res.transactionId || '(ok)'}`)
} else if (!WRITE) {
  console.log('\n(DRY RUN — no changes written. Re-run with --write to apply.)')
}
