import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: 'bt6nb58h', dataset: 'production', apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN, useCdn: false,
})

const all = await client.fetch(`*[_type=="blogPost"]{ "slug": slug.current, title }`)
const hits = all.filter(p => (p.slug||'').includes('agile') || (p.slug||'').includes('sprint') || (p.title||'').toLowerCase().includes('sprint'))
console.log('matches for agile/sprint:')
for (const h of hits) console.log(`  ${h.slug}  | ${h.title}`)

// Also: count live sitemap vs Sanity
const sm = await fetch('https://www.fruitionservices.io/blog-posts-sitemap.xml', { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' } }).then(r=>r.text())
const liveSlugs = [...sm.matchAll(/<loc>https:\/\/www\.fruitionservices\.io\/post\/([^<]+)<\/loc>/g)].map(m=>m[1])
console.log(`\nLive sitemap posts: ${liveSlugs.length}`)
console.log(`Sanity posts:       ${all.length}`)
const sanitySet = new Set(all.map(a=>a.slug))
const missing = liveSlugs.filter(s => !sanitySet.has(s))
console.log(`Missing from Sanity: ${missing.length}`)
console.log('First 10 missing:')
for (const s of missing.slice(0,10)) console.log(`  ${s}`)
