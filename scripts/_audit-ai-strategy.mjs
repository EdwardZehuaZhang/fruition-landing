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

const doc = await client.fetch(
  `*[_type == "servicePage" && slug.current == "ai-strategy-and-execution"][0]`,
)

if (!doc) {
  console.log('NO DOC FOUND')
  process.exit(0)
}

console.log('=== _id:', doc._id)
const fields = Object.keys(doc).sort()
console.log('=== ALL FIELDS PRESENT ===')
for (const f of fields) {
  const v = doc[f]
  let info
  if (v === null || v === undefined) info = 'NULL/UNDEFINED'
  else if (Array.isArray(v)) info = `ARRAY (len=${v.length})`
  else if (typeof v === 'object') {
    if (v.asset?._ref) info = `IMAGE (${v.asset._ref})`
    else info = `OBJECT ${JSON.stringify(v).slice(0, 120)}`
  } else if (typeof v === 'string')
    info = `"${v.slice(0, 100)}${v.length > 100 ? '...' : ''}"`
  else info = String(v)
  console.log(`  ${f}: ${info}`)
}

// Read frontend-relevant fields verbatim
const want = [
  'heroEyebrow','heroHeading','heroSubheading','heroImage','hideHeroSubheading',
  'heroPartnerBadges',
  'primaryCtaLabel','primaryCtaUrl','secondaryCtaLabel','secondaryCtaUrl',
  'logoCloudHeadingPart1','logoCloudHeadingAccent','logoCloudDescription',
  'capabilitiesEyebrow','capabilitiesHeading','capabilitiesHeadingAccent',
  'capabilitiesSubheading','capabilitiesTheme','capabilitiesColumns',
  'capabilitiesCards','capabilitiesCtaLabel','capabilitiesCtaUrl',
  'comparisonHeading','comparisonSubheading','comparisonTabs','comparisonTheme',
  'calendlyHeading','calendlySubheading',
  'faqTabs',
  'servicesHeading','servicesHeadingAccent','servicesSubheading','servicesTheme','servicesCards',
  'heroImageUrl',
]

console.log('\n=== FRONTEND-RELEVANT FIELDS ===')
for (const f of want) {
  const v = doc[f]
  if (v === undefined) console.log(`  ${f}: <MISSING>`)
  else if (v === null) console.log(`  ${f}: <NULL>`)
  else if (Array.isArray(v)) console.log(`  ${f}: ARRAY(${v.length}) ${JSON.stringify(v).slice(0,200)}`)
  else if (typeof v === 'object') console.log(`  ${f}: OBJECT ${JSON.stringify(v).slice(0,200)}`)
  else console.log(`  ${f}: ${JSON.stringify(v)}`)
}
