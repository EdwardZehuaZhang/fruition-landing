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
  const counts = await client.fetch(`{
    "siteSettings": count(*[_type == "siteSettings"]),
    "solutionPage": count(*[_type == "solutionPage"]),
    "partnershipPage": count(*[_type == "partnershipPage"]),
    "locationPage": count(*[_type == "locationPage"]),
    "industryPage": count(*[_type == "industryPage"]),
    "servicePage": count(*[_type == "servicePage"]),
    "blogCategory": count(*[_type == "blogCategory"]),
    "blogPost": count(*[_type == "blogPost"])
  }`)
  console.log("COUNTS:", JSON.stringify(counts))

  const sampleSolution = await client.fetch(`*[_type == "solutionPage"][0]{ title, "slug": slug.current, heroHeading, heroSubheading, seoTitle, "bodyBlocks": length(body) }`)
  console.log("SAMPLE_SOLUTION:", JSON.stringify(sampleSolution))

  const sampleBlog = await client.fetch(`*[_type == "blogPost"] | order(_createdAt desc) [0]{ title, "slug": slug.current, author, publishedAt, excerpt, "bodyBlocks": length(body) }`)
  console.log("SAMPLE_BLOG:", JSON.stringify(sampleBlog))

  const blogQuality = await client.fetch(`{
    "withBody": count(*[_type == "blogPost" && length(body) > 0]),
    "withExcerpt": count(*[_type == "blogPost" && defined(excerpt) && excerpt != ""]),
    "withSlug": count(*[_type == "blogPost" && defined(slug.current)]),
    "pagesWithHero": count(*[_type in ["solutionPage","partnershipPage","locationPage","industryPage","servicePage"] && defined(heroHeading) && heroHeading != ""])
  }`)
  console.log("QUALITY:", JSON.stringify(blogQuality))

  const samplePartnership = await client.fetch(`*[_type == "partnershipPage"][0]{ title, "slug": slug.current, heroHeading, seoTitle }`)
  console.log("SAMPLE_PARTNERSHIP:", JSON.stringify(samplePartnership))
}

run().catch(e => { console.error(e.message); process.exit(1) })