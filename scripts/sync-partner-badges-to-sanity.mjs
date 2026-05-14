#!/usr/bin/env node
// Upload the three partner badge images and patch siteSettings.navbarPartnerBadges
// to reference the new high-quality assets.
//
// Run: node scripts/sync-partner-badges-to-sanity.mjs
import 'dotenv/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
const TOKEN = process.env.SANITY_WRITE_TOKEN
if (!PROJECT_ID || !TOKEN) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN')
  process.exit(1)
}
const BASE = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}`
const QUERY_BASE = `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}`

const BADGES = [
  {
    matchNames: ['monday.com platinum partner', 'platinum partner', 'monday platinum partner', 'monday.com platinum'],
    file: 'public/images/partner-platinum.png',
    filename: 'monday-com-platinum-partner',
    width: 400,
    height: 136,
  },
  {
    matchNames: ['advanced delivery partner', 'monday advanced delivery partner', 'advanced delivery'],
    file: 'public/images/partner-advanced-delivery.png',
    filename: 'monday-advanced-delivery-partner-fruition',
    width: 420,
    height: 128,
  },
  {
    matchNames: ['make partner', 'make.com partner', 'make-partner'],
    file: 'public/images/partner-make.png',
    filename: 'make-partner-fruition',
    width: 512,
    height: 131,
  },
]

async function authedJson(url, init = {}) {
  const r = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${TOKEN}`, ...(init.headers || {}) },
  })
  if (!r.ok) {
    const body = await r.text()
    throw new Error(`${init.method || 'GET'} ${url} → ${r.status} ${body}`)
  }
  return r.json()
}

async function uploadImage(filePath, baseName) {
  const bytes = await fs.readFile(filePath)
  const url = `${BASE}/assets/images/${DATASET}?filename=${encodeURIComponent(baseName)}.png`
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'image/png',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: bytes,
  })
  if (!r.ok) throw new Error(`Upload failed ${r.status}: ${await r.text()}`)
  const j = await r.json()
  const id = j?.document?._id
  if (!id) throw new Error('No asset _id returned')
  return id
}

function nameMatches(name, candidates) {
  if (!name) return false
  const n = name.trim().toLowerCase()
  return candidates.some((c) => n === c.toLowerCase() || n.includes(c.toLowerCase()))
}

async function main() {
  // 1. Fetch current siteSettings
  const queryUrl = `${QUERY_BASE}/data/query/${DATASET}?query=${encodeURIComponent('*[_type=="siteSettings"][0]{_id,_rev,navbarPartnerBadges}')}`
  const res = await fetch(queryUrl, { headers: { Authorization: `Bearer ${TOKEN}` } })
  if (!res.ok) throw new Error(`Query failed ${res.status}: ${await res.text()}`)
  const { result } = await res.json()
  if (!result?._id) throw new Error('No siteSettings document found')
  const doc = result
  console.log(`siteSettings _id=${doc._id}, badges count=${doc.navbarPartnerBadges?.length ?? 0}`)
  const current = Array.isArray(doc.navbarPartnerBadges) ? doc.navbarPartnerBadges : []
  current.forEach((b, i) => console.log(`  [${i}] name="${b.name}"`))

  // 2. Upload new assets
  console.log('\nUploading new badge assets...')
  const uploaded = []
  for (const badge of BADGES) {
    const abs = path.resolve(badge.file)
    console.log(`  ${badge.matchNames[0]} ← ${badge.file}`)
    const id = await uploadImage(abs, badge.filename)
    console.log(`    → ${id}`)
    uploaded.push({ ...badge, assetId: id })
  }

  // 3. Build new navbarPartnerBadges array, preserving existing _key when matched
  const usedKeys = new Set()
  const newBadges = uploaded.map((u, idx) => {
    const existing = current.find((b) => nameMatches(b.name, u.matchNames))
    const _key = existing?._key && !usedKeys.has(existing._key)
      ? existing._key
      : `pb-${Date.now().toString(36)}-${idx}`
    usedKeys.add(_key)
    return {
      _key,
      _type: 'partnerBadge',
      name: existing?.name || u.matchNames[0],
      image: { _type: 'image', asset: { _type: 'reference', _ref: u.assetId } },
      width: u.width,
      height: u.height,
    }
  })

  // Preserve any badges from current that didn't match our 3 (so we don't drop unrelated ones)
  const extra = current.filter((b) => !BADGES.some((B) => nameMatches(b.name, B.matchNames)))
  if (extra.length) console.log(`\nPreserving ${extra.length} unrelated badge(s):`, extra.map((b) => b.name))
  const finalArr = [...newBadges, ...extra]

  // 4. Patch
  const mutations = [{ patch: { id: doc._id, set: { navbarPartnerBadges: finalArr } } }]
  const mutationUrl = `${BASE}/data/mutate/${DATASET}?returnIds=true`
  const mutRes = await fetch(mutationUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations }),
  })
  if (!mutRes.ok) throw new Error(`Mutate failed ${mutRes.status}: ${await mutRes.text()}`)
  const mutJson = await mutRes.json()
  console.log('\nPatched siteSettings:', JSON.stringify(mutJson, null, 2))
  console.log('\nDone. New navbarPartnerBadges:')
  finalArr.forEach((b, i) => console.log(`  [${i}] ${b.name} (asset=${b.image?.asset?._ref})`))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
