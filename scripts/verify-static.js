require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')
const client = createClient({
  projectId: 'bt6nb58h',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

async function run() {
  const pages = await client.fetch(`*[_type in ["solutionPage","partnershipPage","locationPage","industryPage","servicePage"]]{_type, "slug": slug.current, title, heroHeading, "bodyBlocks": length(body)} | order(_type asc, slug asc)`)
  console.log(JSON.stringify(pages.slice(0,8), null, 2))
  const bad = pages.filter(p => p.heroHeading === 'Partnerships' || p.title === 'Partnerships')
  console.log('BAD_COUNT=' + bad.length)
  const totals = pages.reduce((acc,p)=>acc+p.bodyBlocks,0)
  console.log('TOTAL_STATIC=' + pages.length)
  console.log('TOTAL_BODY_BLOCKS=' + totals)
}
run().catch(e=>{console.error(e);process.exit(1)})