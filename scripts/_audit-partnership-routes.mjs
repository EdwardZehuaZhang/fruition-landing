import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'bt6nb58h',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const PARTNERSHIPS = ['aircall-partner', 'hootsuite-delivery-partner']

for (const slug of PARTNERSHIPS) {
  const doc = await client.fetch(`*[_type == "partnershipPage" && slug.current == $slug][0]`, { slug })
  console.log(`\n===== partnershipPage:${slug} =====`)
  if (!doc) { console.log('  (no doc)'); continue }
  const keys = Object.keys(doc).sort()
  for (const k of keys) {
    if (k.startsWith('_')) continue
    const v = doc[k]
    let preview
    if (v == null) preview = String(v)
    else if (Array.isArray(v)) preview = `[${v.length}]` + (v.length ? ' first=' + JSON.stringify(v[0]).slice(0, 140) : '')
    else if (typeof v === 'object') preview = JSON.stringify(v).slice(0, 180)
    else if (typeof v === 'string') preview = v.length > 140 ? v.slice(0, 140) + '…' : v
    else preview = String(v)
    console.log(`  ${k}: ${preview}`)
  }
}

// make-partners may live in makePartnersPage
console.log(`\n===== makePartnersPage (singleton) =====`)
const makeDoc = await client.fetch(`*[_type == "makePartnersPage"][0]`)
if (!makeDoc) console.log('  (no doc)')
else {
  for (const k of Object.keys(makeDoc).sort()) {
    if (k.startsWith('_')) continue
    const v = makeDoc[k]
    let preview
    if (v == null) preview = String(v)
    else if (Array.isArray(v)) preview = `[${v.length}]` + (v.length ? ' first=' + JSON.stringify(v[0]).slice(0, 140) : '')
    else if (typeof v === 'object') preview = JSON.stringify(v).slice(0, 180)
    else if (typeof v === 'string') preview = v.length > 140 ? v.slice(0, 140) + '…' : v
    else preview = String(v)
    console.log(`  ${k}: ${preview}`)
  }
}

// partnerships listing page
console.log(`\n===== page:partnerships (listing) =====`)
const listingDoc = await client.fetch(`*[_type == "page" && slug.current == "partnerships"][0]`)
if (!listingDoc) console.log('  (no doc)')
else {
  for (const k of Object.keys(listingDoc).sort()) {
    if (k.startsWith('_')) continue
    const v = listingDoc[k]
    let preview
    if (v == null) preview = String(v)
    else if (Array.isArray(v)) preview = `[${v.length}]` + (v.length ? ' first=' + JSON.stringify(v[0]).slice(0, 140) : '')
    else if (typeof v === 'object') preview = JSON.stringify(v).slice(0, 180)
    else if (typeof v === 'string') preview = v.length > 140 ? v.slice(0, 140) + '…' : v
    else preview = String(v)
    console.log(`  ${k}: ${preview}`)
  }
}
