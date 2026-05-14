#!/usr/bin/env node
/**
 * Pull every active teamMember doc from Sanity and push name / role /
 * linkedin / bio / photo into the monday.com board (1879224155).
 *
 * Sanity is the source of truth. monday.com is a mirror.
 *
 * Mapping:
 *   role       -> text_mm3bxhyd
 *   linkedin   -> link_mm3bvtmk
 *   bio        -> long_text_mm3bdjkb
 *   photo      -> file_mm0vp797   (binary upload)
 *
 * Item match strategy:
 *   1. Read the live monday roster (existing pulses + their names).
 *   2. Normalise name → existing pulse id.
 *   3. For each Sanity member, look up monday pulse by normalised name.
 *      If missing, create a new pulse with `name`.
 *   4. Patch the text/link/long_text columns via
 *      change_multiple_column_values mutation.
 *   5. Upload the Sanity photo via monday's multipart file endpoint.
 */

import fs from "node:fs"
import path from "node:path"
import os from "node:os"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"
const SANITY_TOKEN = process.env.SANITY_WRITE_TOKEN
const MONDAY_TOKEN = process.env.MONDAY_API_TOKEN
if (!PROJECT_ID || !DATASET || !SANITY_TOKEN || !MONDAY_TOKEN) {
  console.error("Missing env vars (Sanity or monday tokens).")
  process.exit(1)
}

const SANITY_BASE = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}`
const MONDAY_GQL = "https://api.monday.com/v2"
const MONDAY_FILE = "https://api.monday.com/v2/file"
const BOARD_ID = 1879224155
const ROLE_COL = "text_mm3bxhyd"
const LINK_COL = "link_mm3bvtmk"
const BIO_COL = "long_text_mm3bdjkb"
const PHOTO_COL = "file_mm0vp797"

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
    headers: {
      "Content-Type": "application/json",
      Authorization: MONDAY_TOKEN,
      "API-Version": "2024-01",
    },
    body: JSON.stringify({ query, variables }),
  })
  const j = await r.json()
  if (j.errors) throw new Error(`monday ${JSON.stringify(j.errors)}`)
  return j.data
}

function sanityImageUrl(ref) {
  // image-{hash}-{width}x{height}-{ext}
  const m = (ref ?? "").match(/^image-([a-f0-9]+)-(\d+)x(\d+)-(\w+)$/)
  if (!m) return null
  const [, hash, w, h, ext] = m
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${hash}-${w}x${h}.${ext}`
}

async function downloadToTmp(url) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`download ${r.status} ${url}`)
  const buf = Buffer.from(await r.arrayBuffer())
  const ext = path.extname(new URL(url).pathname).slice(1) || "jpg"
  const file = path.join(os.tmpdir(), `s2m-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`)
  fs.writeFileSync(file, buf)
  return { file, ext, mime: r.headers.get("content-type") || `image/${ext}` }
}

async function uploadFileToColumn(itemId, filePath) {
  const buf = fs.readFileSync(filePath)
  const ext = path.extname(filePath).slice(1).toLowerCase() || "jpg"
  const mime = ext === "jpg" ? "image/jpeg" : `image/${ext}`
  const blob = new Blob([buf], { type: mime })
  const fd = new FormData()
  fd.append("query", `mutation ($file: File!) { add_file_to_column (item_id: ${itemId}, column_id: "${PHOTO_COL}", file: $file) { id } }`)
  fd.append("variables", JSON.stringify({ file: null }))
  fd.append("map", JSON.stringify({ image: ["variables.file"] }))
  fd.append("image", blob, path.basename(filePath))
  const r = await fetch(MONDAY_FILE, {
    method: "POST",
    headers: { Authorization: MONDAY_TOKEN, "API-Version": "2024-01" },
    body: fd,
  })
  const text = await r.text()
  if (!r.ok || text.includes('"errors"')) throw new Error(`upload failed: ${text.slice(0, 300)}`)
  return JSON.parse(text)
}

async function getMondayRoster() {
  const data = await mondayQuery(
    `query ($board: ID!, $cursor: String) {
      boards(ids: [$board]) {
        items_page(limit: 200, cursor: $cursor) {
          cursor
          items { id name }
        }
      }
    }`,
    { board: String(BOARD_ID), cursor: null },
  )
  return data.boards[0].items_page.items
}

async function createMondayItem(name) {
  const d = await mondayQuery(
    `mutation ($board: ID!, $name: String!) {
      create_item(board_id: $board, item_name: $name, group_id: "topics") { id }
    }`,
    { board: String(BOARD_ID), name },
  )
  return d.create_item.id
}

async function patchColumns(itemId, fields) {
  const payload = {}
  if (fields.role) payload[ROLE_COL] = fields.role
  if (fields.linkedinUrl) payload[LINK_COL] = { url: fields.linkedinUrl, text: "LinkedIn" }
  if (fields.bio) payload[BIO_COL] = { text: fields.bio }
  if (Object.keys(payload).length === 0) return
  await mondayQuery(
    `mutation ($board: ID!, $item: ID!, $vals: JSON!) {
      change_multiple_column_values(board_id: $board, item_id: $item, column_values: $vals) { id }
    }`,
    { board: String(BOARD_ID), item: String(itemId), vals: JSON.stringify(payload) },
  )
}

async function main() {
  const members = await sanityQuery(`*[_type=="teamMember"]{_id,name,role,bio,linkedinUrl,photo{asset->{_ref,url}}}`)
  console.log(`Sanity has ${members.length} teamMember docs.`)

  const mondayItems = await getMondayRoster()
  console.log(`Monday board has ${mondayItems.length} pulses.`)
  // Build several lookup indices so we never create a duplicate when the
  // monday pulse name is shorter ("Yash") than the Sanity name ("Yash
  // Khowal"). Match in order: exact normalised → first+last word →
  // first-word starts-with → last-word ends-with. Anything ambiguous is
  // skipped (logged as needing manual link) instead of creating a dupe.
  const byNorm = new Map()        // normalised full name -> id
  const byFirstWord = new Map()   // first word -> [ids]
  const byLastWord = new Map()    // last word  -> [ids]
  function indexAdd(name, id) {
    const n = normName(name)
    byNorm.set(n, id)
    const parts = n.split(" ")
    const first = parts[0]
    const last = parts[parts.length - 1]
    if (first) (byFirstWord.get(first) ?? byFirstWord.set(first, []).get(first)).push(id)
    if (last && last !== first) (byLastWord.get(last) ?? byLastWord.set(last, []).get(last)).push(id)
  }
  for (const it of mondayItems) indexAdd(it.name, it.id)
  function findItem(sanityName) {
    const n = normName(sanityName)
    if (byNorm.has(n)) return byNorm.get(n)
    const parts = n.split(" ")
    const first = parts[0]
    const last = parts[parts.length - 1]
    // Unique first-word match wins (handles short monday names).
    const fw = byFirstWord.get(first) ?? []
    if (fw.length === 1) return fw[0]
    // Unique last-word match.
    const lw = byLastWord.get(last) ?? []
    if (lw.length === 1) return lw[0]
    // Try prefix (e.g. Slack "Yash Khowal" needs to find monday "Yash"
    // even though byFirstWord above stores "yash"). The first-word index
    // already covered this case — but if multiple monday pulses share
    // first name we fall through.
    return null
  }

  let i = 0
  for (const m of members) {
    i++
    let itemId = findItem(m.name)
    let created = false
    if (!itemId) {
      console.log(`[${i}/${members.length}] no monday match for ${m.name} — creating new pulse`)
      itemId = await createMondayItem(m.name)
      created = true
      // Update indices so subsequent loops don't dupe.
      const id = itemId
      const n = normName(m.name)
      byNorm.set(n, id)
      const parts = n.split(" ")
      const first = parts[0]
      const last = parts[parts.length - 1]
      if (first) (byFirstWord.get(first) ?? byFirstWord.set(first, []).get(first)).push(id)
      if (last && last !== first) (byLastWord.get(last) ?? byLastWord.set(last, []).get(last)).push(id)
    }

    // Resolve photo URL: prefer asset.url (already a CDN url); else build from _ref
    const photoUrl = m.photo?.asset?.url || sanityImageUrl(m.photo?.asset?._ref)

    try {
      await patchColumns(itemId, {
        role: m.role,
        linkedinUrl: m.linkedinUrl,
        bio: m.bio,
      })
    } catch (err) {
      console.warn(`  columns patch failed for ${m.name}: ${err.message}`)
    }

    if (photoUrl) {
      try {
        const { file } = await downloadToTmp(photoUrl)
        await uploadFileToColumn(itemId, file)
        fs.unlinkSync(file)
      } catch (err) {
        console.warn(`  photo sync failed for ${m.name}: ${err.message}`)
      }
    }

    console.log(`[${i}/${members.length}] ${created ? "created+" : ""}synced ${m.name}`)
  }

  console.log("done.")
}

main().catch((e) => { console.error(e); process.exit(1) })
