#!/usr/bin/env node
// Find any docs with heroPartnerBadges populated and patch matching entries
// (platinum / advanced delivery / make) to point at the newly uploaded assets.
import 'dotenv/config'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
const TOKEN = process.env.SANITY_WRITE_TOKEN
if (!PROJECT_ID || !TOKEN) {
  console.error('Missing env')
  process.exit(1)
}
const BASE = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}`
const QUERY_BASE = `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}`

const NEW_REFS = {
  platinum: 'image-1ac8ea3ac5aece839fe8f852f2164e9b9191dc9a-400x136-png',
  advanced: 'image-b054222f439bbd04163d859bdcaa61cd7f54bc48-420x128-png',
  make: 'image-dc9368aaf3f3b793d9d4e201287a457d64ae2691-512x131-png',
}
const DIMS = {
  platinum: { width: 400, height: 136 },
  advanced: { width: 420, height: 128 },
  make: { width: 512, height: 131 },
}

function classify(name) {
  if (!name) return null
  const n = name.toLowerCase()
  if (n.includes('platinum')) return 'platinum'
  if (n.includes('advanced') && n.includes('delivery')) return 'advanced'
  if (n.includes('advanced delivery')) return 'advanced'
  if (n.includes('make')) return 'make'
  return null
}

async function query(groq) {
  const url = `${QUERY_BASE}/data/query/${DATASET}?query=${encodeURIComponent(groq)}`
  const r = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } })
  if (!r.ok) throw new Error(`Query failed ${r.status}: ${await r.text()}`)
  return (await r.json()).result
}

async function mutate(mutations) {
  const r = await fetch(`${BASE}/data/mutate/${DATASET}?returnIds=true`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations }),
  })
  if (!r.ok) throw new Error(`Mutate failed ${r.status}: ${await r.text()}`)
  return r.json()
}

async function main() {
  const docs = await query('*[defined(heroPartnerBadges) && count(heroPartnerBadges) > 0]{_id,_type,heroPartnerBadges}')
  console.log(`Docs with heroPartnerBadges: ${docs.length}`)
  if (!docs.length) return

  const mutations = []
  for (const d of docs) {
    let changed = false
    const newArr = d.heroPartnerBadges.map((b) => {
      const cls = classify(b.name)
      if (!cls) return b
      changed = true
      return {
        ...b,
        _type: b._type || 'partnerBadge',
        image: { _type: 'image', asset: { _type: 'reference', _ref: NEW_REFS[cls] } },
        width: DIMS[cls].width,
        height: DIMS[cls].height,
      }
    })
    if (changed) {
      console.log(`  patching ${d._type} ${d._id} (${newArr.length} badges)`)
      mutations.push({ patch: { id: d._id, set: { heroPartnerBadges: newArr } } })
    } else {
      console.log(`  skip ${d._type} ${d._id} — no matching badge names`)
    }
  }
  if (!mutations.length) {
    console.log('No mutations needed.')
    return
  }
  const res = await mutate(mutations)
  console.log('Result:', JSON.stringify(res, null, 2))
}

main().catch((e) => { console.error(e); process.exit(1) })
