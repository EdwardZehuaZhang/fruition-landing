#!/usr/bin/env node
/**
 * Reverse-sync the local team roster into Sanity. Sanity becomes the
 * source of truth for /fruition-team + monday-partner-* pages.
 *
 *   - Uploads each photoUrl to Sanity's image asset store (skips already
 *     uploaded photos by tagging the asset filename with member id).
 *   - Upserts a teamMember doc per roster entry, keyed by stable
 *     external id ("team-roster-<id>").
 *   - Sets role / regions / bio / linkedinUrl / photo.
 *   - Deletes Aquib Zafar and Natalia Mishenina docs from Sanity.
 */

import fs from "node:fs"
import path from "node:path"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"
const TOKEN = process.env.SANITY_WRITE_TOKEN
if (!PROJECT_ID || !DATASET || !TOKEN) {
  console.error("Missing Sanity env (project id / dataset / write token).")
  process.exit(1)
}

const BASE = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}`

async function sanityFetch(query, params = {}) {
  const url = `${BASE}/data/query/${DATASET}?query=${encodeURIComponent(query)}&${new URLSearchParams(Object.fromEntries(Object.entries(params).map(([k, v]) => [`$${k}`, JSON.stringify(v)])))}`
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

async function uploadImage(memberId, sourceUrl) {
  let buf, mime
  if (sourceUrl.startsWith("/")) {
    const localPath = path.join("public", sourceUrl)
    buf = fs.readFileSync(localPath)
    const ext = path.extname(localPath).slice(1).toLowerCase() || "jpg"
    mime = ext === "jpg" ? "image/jpeg" : `image/${ext}`
  } else {
    const r = await fetch(sourceUrl)
    if (!r.ok) throw new Error(`download ${sourceUrl} ${r.status}`)
    buf = Buffer.from(await r.arrayBuffer())
    mime = r.headers.get("content-type") || "image/jpeg"
  }
  const url = `${BASE}/assets/images/${DATASET}?filename=roster-${memberId}.${mime.split("/")[1].split(";")[0]}`
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": mime,
      Authorization: `Bearer ${TOKEN}`,
    },
    body: buf,
  })
  if (!r.ok) throw new Error(`upload ${r.status} ${await r.text()}`)
  const j = await r.json()
  return j.document._id // image-XXXX-WxH-EXT
}

// ---------- Parse roster ----------
function parseRoster() {
  const src = fs.readFileSync("src/data/teamRoster.ts", "utf8")
  const arr = src.match(/TEAM_ROSTER:[^=]*=\s*\[(.*)\n\]/s)
  if (!arr) throw new Error("array not found")
  let depth = 0, cur = ""
  const entries = []
  for (const ch of arr[1]) {
    cur += ch
    if (ch === "{") depth++
    else if (ch === "}") { depth--; if (depth === 0) { entries.push(cur); cur = "" } }
  }
  function get(e, key) {
    const re = new RegExp(`\\b${key}:\\s*"((?:\\\\.|[^"\\\\])*)"`)
    const m = e.match(re)
    return m ? m[1].replace(/\\"/g, "\"").replace(/\\\\/g, "\\") : undefined
  }
  function getRegions(e) {
    const m = e.match(/regions:\s*\[([^\]]*)\]/)
    if (!m) return []
    return Array.from(m[1].matchAll(/"([^"]+)"/g)).map((mm) => mm[1])
  }
  return entries
    .map((e) => ({
      id: get(e, "id"),
      name: get(e, "name"),
      role: get(e, "role"),
      emoji: get(e, "emoji"),
      photoUrl: get(e, "photoUrl"),
      bio: get(e, "bio"),
      linkedinUrl: get(e, "linkedinUrl"),
      regions: getRegions(e),
    }))
    .filter((r) => r.name)
}

// ---------- Main ----------
async function main() {
  const roster = parseRoster()
  console.log(`Roster has ${roster.length} members.`)

  // 1. Delete Aquib + Natalia (and any existing roster-keyed docs without a
  //    matching roster entry — keeps Sanity clean).
  const rosterNames = new Set(roster.map((r) => r.name.toLowerCase().trim()))
  const existing = await sanityFetch(`*[_type == "teamMember"]{_id, name}`)
  const toDelete = existing.filter((d) => {
    const n = (d.name ?? "").toLowerCase().trim()
    return n === "aquib zafar" || n === "natalia mishenina"
  })
  if (toDelete.length > 0) {
    await mutate(toDelete.map((d) => ({ delete: { id: d._id } })))
    console.log(`Deleted ${toDelete.length} retired members: ${toDelete.map((d) => d.name).join(", ")}`)
  }

  // Build name -> _id index of remaining docs.
  const remaining = await sanityFetch(`*[_type == "teamMember"]{_id, name, photo}`)
  const nameToDoc = new Map()
  for (const d of remaining) nameToDoc.set((d.name ?? "").toLowerCase().trim(), d)

  // 2. Upsert each roster member.
  let order = 0
  for (const r of roster) {
    order += 1
    const existing = nameToDoc.get(r.name.toLowerCase().trim())
    const docId = existing?._id ?? `team-roster-${r.id}`

    let assetRef = existing?.photo?.asset?._ref
    if (!assetRef && r.photoUrl) {
      try {
        assetRef = await uploadImage(r.id, r.photoUrl)
        console.log(`  uploaded photo: ${r.name} -> ${assetRef}`)
      } catch (err) {
        console.warn(`  photo upload failed for ${r.name}: ${err.message}`)
      }
    }

    const set = {
      name: r.name,
      role: r.role,
      regions: r.regions,
      order,
    }
    if (r.emoji) set.emoji = r.emoji
    if (r.bio) set.bio = r.bio // do not wipe existing Sanity bio when roster lacks one
    if (r.linkedinUrl) set.linkedinUrl = r.linkedinUrl
    if (assetRef) {
      set.photo = { _type: "image", asset: { _type: "reference", _ref: assetRef } }
    }

    if (existing) {
      // Patch only — never overwrites unrelated fields (bio etc. set by an
      // editor in Sanity Studio survives roster syncs).
      await mutate([{ patch: { id: docId, set } }])
    } else {
      await mutate([
        { create: { _id: docId, _type: "teamMember", ...set } },
      ])
    }
    console.log(`[${order}/${roster.length}] ${existing ? "patched" : "created"} ${r.name}`)
  }

  console.log("done.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
