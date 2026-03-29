require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')
const client = createClient({
  projectId: 'bt6nb58h',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

async function run() {
  // Check all static pages - title vs seoTitle vs heroHeading
  const allStatic = await client.fetch(`*[_type in ["solutionPage","partnershipPage","locationPage","industryPage","servicePage"]]{ _type, title, "slug": slug.current, heroHeading, seoTitle } | order(_type asc)`)
  console.log("ALL_STATIC_PAGES:")
  allStatic.forEach(p => console.log(`  [${p._type}] slug=${p.slug} | title="${p.title}" | heroHeading="${p.heroHeading}" | seoTitle="${p.seoTitle}"`))

  // Check a few blog posts for body content sample
  const blogs = await client.fetch(`*[_type == "blogPost"] | order(_createdAt desc) [0..4]{ title, "slug": slug.current, author, "bodyBlocks": length(body), "firstBlock": body[0].children[0].text }`)
  console.log("\nBLOG POST SAMPLES:")
  blogs.forEach(b => console.log(`  "${b.title}" | slug=${b.slug} | blocks=${b.bodyBlocks} | firstText="${b.firstBlock ? b.firstBlock.substring(0,80) : 'N/A'}"`))
}

run().catch(e => { console.error(e.message); process.exit(1) })