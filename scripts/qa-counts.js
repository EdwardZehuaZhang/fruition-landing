require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')
const client = createClient({ projectId:'bt6nb58h', dataset:'production', apiVersion:'2024-01-01', token:process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN, useCdn:false })
;(async()=>{
const counts = {
siteSettings: await client.fetch('count(*[_type == "siteSettings"])'),
solutionPage: await client.fetch('count(*[_type == "solutionPage"])'),
partnershipPage: await client.fetch('count(*[_type == "partnershipPage"])'),
locationPage: await client.fetch('count(*[_type == "locationPage"])'),
industryPage: await client.fetch('count(*[_type == "industryPage"])'),
servicePage: await client.fetch('count(*[_type == "servicePage"])'),
blogCategory: await client.fetch('count(*[_type == "blogCategory"])'),
blogPost: await client.fetch('count(*[_type == "blogPost"])')
}
const staticSamples = await client.fetch('*[_type in ["solutionPage","partnershipPage","locationPage","industryPage","servicePage"]][0..4]{_type,title,"slug":slug.current,heroHeading,"bodyBlocks": length(body)}')
const blogSamples = await client.fetch('*[_type == "blogPost"] | order(publishedAt desc)[0..4]{title,"slug":slug.current,author,publishedAt,"bodyBlocks": length(body), excerpt}')
console.log(JSON.stringify({counts, staticSamples, blogSamples}, null, 2))
})().catch(e=>{console.error(e);process.exit(1)})