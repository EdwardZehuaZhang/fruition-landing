import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: 'bt6nb58h',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

// Pull all blog posts with body
const posts = await client.fetch(`*[_type=="blogPost"]{
  _id, title, "slug": slug.current,
  body[]{ _type, markDefs }
}`)

let total = 0, withLinks = 0, withoutLinks = 0, totalLinks = 0
const internalDomains = ['fruitionservices.io', 'fruition.services', 'localhost']
let internal = 0, external = 0
const noLinkSlugs = []

for (const p of posts) {
  total++
  const links = []
  for (const b of p.body || []) {
    if (b._type !== 'block' || !b.markDefs) continue
    for (const md of b.markDefs) {
      if (md._type === 'link' && md.href) links.push(md.href)
    }
  }
  if (links.length === 0) { withoutLinks++; noLinkSlugs.push(p.slug); continue }
  withLinks++
  totalLinks += links.length
  for (const h of links) {
    if (internalDomains.some(d => h.includes(d)) || h.startsWith('/')) internal++
    else external++
  }
}

console.log(`Sanity blogPost count: ${total}`)
console.log(`  with >=1 link: ${withLinks}`)
console.log(`  with 0 links:  ${withoutLinks}`)
console.log(`  total link markDefs: ${totalLinks}`)
console.log(`  internal: ${internal}, external: ${external}`)
console.log(`  avg links/post (linked posts): ${(totalLinks/Math.max(withLinks,1)).toFixed(1)}`)
console.log(`\nFirst 10 link-less slugs:`)
for (const s of noLinkSlugs.slice(0,10)) console.log(`  ${s}`)
