#!/usr/bin/env node
/**
 * Push name + bio from Sanity to the monday "Fruition Team" board.
 * Sanity is the source of truth.
 *
 *   - Renames monday pulses whose name disagrees with the Sanity record
 *     (e.g. "Nikki" -> "Nikki Glucksman").
 *   - Writes the Sanity bio into the long_text Bio column when it differs.
 *
 * Pass --dry to preview without applying changes.
 */
import * as dotenvLib from "dotenv"
dotenvLib.config({ path: ".env.local" })

const DRY = process.argv.includes("--dry")
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"
const SANITY_TOKEN = process.env.SANITY_WRITE_TOKEN
const MONDAY_TOKEN = process.env.MONDAY_API_TOKEN
const BOARD_ID = 1879224155
const BIO_COL = "long_text_mm3bdjkb"
const SANITY_BASE = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}`
const MONDAY_GQL = "https://api.monday.com/v2"

// Manual mapping: Sanity name (lowercased) -> monday pulse id. Used when
// short forms / nicknames break automatic token matching.
const MANUAL_MATCH = {
  "ognyana asenova": "1998172556", // monday "Yana"
}

function normName(s) {
  return (s ?? "")
    .replace(/[^A-Za-z\s'.\-()]/g, " ")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
}

async function sanityQuery(query) {
  const r = await fetch(`${SANITY_BASE}/data/query/${DATASET}?query=${encodeURIComponent(query)}`, {
    headers: { Authorization: `Bearer ${SANITY_TOKEN}` },
  })
  if (!r.ok) throw new Error(`sanity ${r.status} ${await r.text()}`)
  return (await r.json()).result
}

async function mondayQuery(query, variables = {}) {
  const r = await fetch(MONDAY_GQL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: MONDAY_TOKEN, "API-Version": "2024-01" },
    body: JSON.stringify({ query, variables }),
  })
  const j = await r.json()
  if (j.errors) throw new Error(`monday ${JSON.stringify(j.errors)}`)
  return j.data
}

async function getMondayRoster() {
  const d = await mondayQuery(
    `query ($board: ID!) {
      boards(ids: [$board]) {
        items_page(limit: 200) {
          items {
            id name
            column_values(ids: ["${BIO_COL}"]) { id text }
          }
        }
      }
    }`,
    { board: String(BOARD_ID) },
  )
  return d.boards[0].items_page.items
}

function scoreMatch(sToks, mToks) {
  if (sToks.join(" ") === mToks.join(" ")) return 10
  const sFirst = sToks[0], sLast = sToks[sToks.length - 1]
  const mFirst = mToks[0], mLast = mToks[mToks.length - 1]
  const monoSingle = mToks.length === 1
  if (monoSingle) {
    if (mToks[0] === sFirst) return 6
    if (sToks.includes(mToks[0])) return 2
    if (sFirst && (mToks[0].startsWith(sFirst) || sFirst.startsWith(mToks[0]))) return 1
    return 0
  }
  // monday multi-token
  if (sToks.length > 1 && sFirst === mFirst && sLast === mLast) return 5
  if (sLast && mLast && sLast === mLast && sToks.length > 1) return 4
  if (sFirst && mFirst && sFirst === mFirst) return 3
  return 0
}

const members = await sanityQuery(`*[_type=="teamMember"]{_id,name,bio}`)
const monday = await getMondayRoster()
const mondayById = new Map(monday.map(it => [String(it.id), it]))
const mondayTokens = monday.map(it => ({ item: it, tokens: normName(it.name).split(" ").filter(Boolean) }))

function findItem(sanityName) {
  const manual = MANUAL_MATCH[normName(sanityName)]
  if (manual) return mondayById.get(manual) ?? null
  const sToks = normName(sanityName).split(" ").filter(Boolean)
  let bestScore = 0, bestItems = []
  for (const m of mondayTokens) {
    const s = scoreMatch(sToks, m.tokens)
    if (s > bestScore) { bestScore = s; bestItems = [m.item] }
    else if (s === bestScore && s > 0) bestItems.push(m.item)
  }
  if (bestScore === 0 || bestItems.length !== 1) return null
  return bestItems[0]
}

const plan = []
const unmatched = []
for (const m of members) {
  const it = findItem(m.name)
  if (!it) { unmatched.push(m); continue }
  const curBio = (it.column_values.find(c => c.id === BIO_COL)?.text ?? "").trim()
  const newBio = (m.bio ?? "").trim()
  const renameTo = it.name !== m.name ? m.name : null
  const bioPatch = newBio && newBio !== curBio ? newBio : null
  if (renameTo || bioPatch) plan.push({ id: it.id, mondayName: it.name, sanityName: m.name, renameTo, bioPatch, oldBioLen: curBio.length })
}

console.log(`\nPlanned changes (${plan.length}, dry=${DRY}):`)
for (const p of plan) {
  const parts = []
  if (p.renameTo) parts.push(`rename "${p.mondayName}" -> "${p.renameTo}"`)
  if (p.bioPatch) parts.push(`bio ${p.oldBioLen} -> ${p.bioPatch.length} chars`)
  console.log(`  [${p.id}] ${p.sanityName}: ${parts.join("; ")}`)
}
if (unmatched.length) {
  console.log(`\nSanity entries with no monday match (skipped):`)
  for (const u of unmatched) console.log(`  ${u.name}`)
}

if (DRY) { console.log("\n(dry run — no writes)"); process.exit(0) }

console.log("\nApplying...")
let i = 0
for (const p of plan) {
  i++
  const cols = {}
  if (p.renameTo) cols.name = p.renameTo
  if (p.bioPatch) cols[BIO_COL] = { text: p.bioPatch }
  try {
    await mondayQuery(
      `mutation ($board: ID!, $item: ID!, $vals: JSON!) {
        change_multiple_column_values(board_id: $board, item_id: $item, column_values: $vals) { id }
      }`,
      { board: String(BOARD_ID), item: String(p.id), vals: JSON.stringify(cols) },
    )
    console.log(`  [${i}/${plan.length}] ${p.sanityName} ok`)
  } catch (err) {
    console.warn(`  [${i}/${plan.length}] ${p.sanityName} FAILED: ${err.message}`)
  }
}
console.log("done.")
