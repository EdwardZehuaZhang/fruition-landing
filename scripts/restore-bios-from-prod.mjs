#!/usr/bin/env node
/**
 * One-shot restore: scrape bios from
 * https://www.fruitionservices.io/fruition-team (the live Wix site that
 * still mirrors the original Sanity content) and patch them back into
 * any Sanity teamMember doc whose bio is currently empty.
 *
 * Safe to run multiple times — only fills blanks, never overwrites a
 * non-empty bio.
 */

import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"
const TOKEN = process.env.SANITY_WRITE_TOKEN
if (!PROJECT_ID || !DATASET || !TOKEN) {
  console.error("Missing Sanity env (project id / dataset / write token)")
  process.exit(1)
}

const BASE = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}`
const PROD_URL = "https://www.fruitionservices.io/fruition-team"

async function sanityQuery(query) {
  const url = `${BASE}/data/query/${DATASET}?query=${encodeURIComponent(query)}`
  const r = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } })
  if (!r.ok) throw new Error(`fetch ${r.status} ${await r.text()}`)
  const j = await r.json()
  return j.result
}

async function mutate(mutations) {
  const r = await fetch(`${BASE}/data/mutate/${DATASET}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  })
  if (!r.ok) throw new Error(`mutate ${r.status} ${await r.text()}`)
  return r.json()
}

function decode(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

function stripTags(s) {
  return decode(s.replace(/<[^>]+>/g, "")).trim()
}

function normName(s) {
  if (!s) return ""
  return s
    .replace(/[^A-Za-z\s'.\-()]/g, " ") // drop emojis, NBSP, punctuation
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
}

async function scrapeBios() {
  console.log(`Fetching ${PROD_URL} ...`)
  const r = await fetch(PROD_URL)
  if (!r.ok) throw new Error(`prod fetch ${r.status}`)
  let html = await r.text()
  html = html.replace(/<script[\s\S]*?<\/script>/g, "")
  html = html.replace(/<style[\s\S]*?<\/style>/g, "")

  // Wix renders each team card with:
  //   name : <p class="font_5 wixui-rich-text__text" style="font-size:20px; ...">
  //          <span ...>NAME (maybe emoji)</span></p>
  //   bio  : <p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.5em">
  //          ...bio text...</p>
  //
  // Walk through paragraph tags in document order, collect name/bio
  // pairs.
  const pTagRe = /<p\s[^>]*class="(font_5|font_8)[^"]*"[^>]*style="([^"]*)"[^>]*>([\s\S]*?)<\/p>/g
  const events = []
  let m
  while ((m = pTagRe.exec(html)) !== null) {
    const fontClass = m[1]
    const style = m[2]
    const inner = m[3]
    if (fontClass === "font_5" && /font-size:\s*20px/i.test(style)) {
      const name = stripTags(inner)
      if (name && name.length < 80) events.push({ kind: "name", value: name, pos: m.index })
    } else if (fontClass === "font_8" && /line-height:\s*1\.5em/i.test(style)) {
      const bio = stripTags(inner)
      if (bio && bio.length > 40) events.push({ kind: "bio", value: bio, pos: m.index })
    }
  }

  const bios = new Map()
  let lastName = null
  for (const e of events) {
    if (e.kind === "name") {
      lastName = e.value
    } else if (e.kind === "bio" && lastName) {
      const key = normName(lastName)
      if (!bios.has(key)) bios.set(key, e.value)
      // Don't reset lastName — a name can have multiple paragraphs and we
      // only want the first big paragraph after it.
      lastName = null
    }
  }
  console.log(`Scraped ${bios.size} bios from prod.`)
  return bios
}

async function main() {
  const bios = await scrapeBios()
  const docs = await sanityQuery(`*[_type=="teamMember"]{_id,name,bio}`)
  console.log(`Sanity has ${docs.length} teamMember docs.`)

  const muts = []
  let restored = 0
  let alreadySet = 0
  let notFound = 0
  for (const d of docs) {
    if (typeof d.bio === "string" && d.bio.trim().length > 0) {
      alreadySet += 1
      continue
    }
    const key = normName(d.name)
    let bio = bios.get(key)
    if (!bio) {
      // Try first-name fallback
      const first = key.split(" ")[0]
      for (const [k, v] of bios.entries()) {
        if (k.startsWith(first + " ")) { bio = v; break }
      }
    }
    if (!bio) {
      console.log(`  - no prod bio: ${d.name}`)
      notFound += 1
      continue
    }
    muts.push({ patch: { id: d._id, set: { bio } } })
    console.log(`  restored: ${d.name} (${bio.length} chars)`)
    restored += 1
  }

  if (muts.length === 0) {
    console.log("Nothing to restore.")
  } else {
    // Run in chunks of 10 to keep payloads small.
    for (let i = 0; i < muts.length; i += 10) {
      await mutate(muts.slice(i, i + 10))
    }
  }
  console.log(`done. restored=${restored} alreadySet=${alreadySet} noProdBio=${notFound}`)
}

main().catch((err) => { console.error(err); process.exit(1) })
