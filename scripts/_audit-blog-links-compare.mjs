import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { parse } from 'node-html-parser'
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: 'bt6nb58h',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

const SLUGS = [
  'mondaycom-agile-sprint-management',
  'monday-com-ai-integrations-and-linking-boards',
  'best-of-breed-or-best-of-suite-software',
]

async function liveLinks(slug) {
  const url = `https://www.fruitionservices.io/post/${slug}`
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' } })
  if (!res.ok) return { ok: false, status: res.status }
  const html = await res.text()
  const root = parse(html)
  // Match importer container selection
  const selectors = ['[data-hook="post-description"]', '.post-description', '[class*="post-description"]', '[data-hook="post-content"]', 'article', 'main']
  let body = null
  for (const sel of selectors) { body = root.querySelector(sel); if (body) break }
  if (!body) return { ok: true, total: 0, internal: 0, external: 0, sample: [] }
  const anchors = body.querySelectorAll('a[href]')
  let internal = 0, external = 0
  const sample = []
  for (const a of anchors) {
    const h = (a.getAttribute('href') || '').trim()
    if (!h || h.startsWith('#') || h.startsWith('mailto:') || h.startsWith('tel:')) continue
    if (sample.length < 5) sample.push(h)
    if (h.startsWith('/') || h.includes('fruitionservices.io')) internal++; else external++
  }
  return { ok: true, total: internal + external, internal, external, sample }
}

async function sanityLinks(slug) {
  const post = await client.fetch(`*[_type=="blogPost" && slug.current==$slug][0]{ title, body[]{ _type, markDefs } }`, { slug })
  if (!post) return null
  let internal = 0, external = 0
  const sample = []
  for (const b of post.body || []) {
    if (b._type !== 'block' || !b.markDefs) continue
    for (const md of b.markDefs) {
      if (md._type !== 'link' || !md.href) continue
      if (sample.length < 5) sample.push(md.href)
      if (md.href.startsWith('/') || md.href.includes('fruitionservices.io')) internal++; else external++
    }
  }
  return { title: post.title, total: internal + external, internal, external, sample }
}

for (const slug of SLUGS) {
  console.log(`\n=== ${slug} ===`)
  const live = await liveLinks(slug)
  const san = await sanityLinks(slug)
  console.log('  live  :', live)
  console.log('  sanity:', san)
}
