import { importBlogPost } from './import-blog.js'

const MISSING_SLUGS = [
  'aircall-monday-crm-integration',
  'mondaycom-ai-feature-prioritisation-risk-detection',
  'ai-agent-playbook-deploy-without-draining-budget',
  'change-management-for-software-new-tool-fatigue',
  'australian-standards-for-building-materials-with-mondaycom',
  'monday-work-management-workcanvas-2026-roadmap',
  'monday-ai-work-management-updates-2026',
  'mondaycom-agile-sprint-management',
  'ai-call-recording-apps',
  'build-buy-orchestrate-enterprise-ai-vendor-decision-2026',
]

const BASE_URL = 'https://www.fruitionservices.io'

async function fetchAllMissing(): Promise<string[]> {
  const sm = await fetch(`${BASE_URL}/blog-posts-sitemap.xml`, {
    headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' },
  }).then(r => r.text())
  const liveSlugs = [...sm.matchAll(/<loc>https:\/\/www\.fruitionservices\.io\/post\/([^<]+)<\/loc>/g)].map(m => m[1])

  const { createClient } = await import('@sanity/client')
  const dotenv = await import('dotenv')
  dotenv.config({ path: '.env.local' })
  const client = createClient({
    projectId: 'bt6nb58h',
    dataset: 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
    useCdn: false,
  })
  const existing = await client.fetch<string[]>(`*[_type=="blogPost"].slug.current`)
  const set = new Set(existing)
  return liveSlugs.filter(s => !set.has(s))
}

async function main() {
  const fresh = await fetchAllMissing()
  console.log(`Sitemap reports ${fresh.length} missing slugs:`)
  for (const s of fresh) console.log(`  ${s}`)

  // Use union of hardcoded + fresh missing list to be safe
  const targets = [...new Set([...MISSING_SLUGS, ...fresh])]
  console.log(`\nReimporting ${targets.length} posts...\n`)

  let ok = 0, fail = 0
  for (const slug of targets) {
    const url = `${BASE_URL}/post/${slug}`
    const success = await importBlogPost({ url })
    if (success) ok++; else fail++
  }
  console.log(`\nDone. Success: ${ok}, Failed: ${fail}`)
}

main().catch(err => { console.error(err); process.exit(1) })
