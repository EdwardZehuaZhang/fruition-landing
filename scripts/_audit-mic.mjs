import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'bt6nb58h',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const doc = await client.fetch(`*[_type == "mondayImplementationConsultantsPage"][0]`)

if (!doc) {
  console.log('NO DOC FOUND')
  process.exit(0)
}

const fields = Object.keys(doc).sort()
console.log('=== ALL FIELDS PRESENT ===')
for (const f of fields) {
  const v = doc[f]
  let info
  if (v === null || v === undefined) info = 'NULL/UNDEFINED'
  else if (Array.isArray(v)) info = `ARRAY (len=${v.length})`
  else if (typeof v === 'object') {
    if (v.asset?._ref) info = `IMAGE (${v.asset._ref})`
    else info = `OBJECT ${JSON.stringify(v).slice(0,80)}`
  }
  else if (typeof v === 'string') info = `"${v.slice(0,100)}${v.length>100?'...':''}"`
  else info = String(v)
  console.log(`  ${f}: ${info}`)
}

console.log('\n=== KEY FIELDS DETAIL ===')
const detailed = ['heroMondayPartnersImage','heroProductImages','heroImage','heroPartnerBadges','calendlySubheading','videoTitle']
for (const f of detailed) {
  console.log(`${f}:`, JSON.stringify(doc[f], null, 2))
}
