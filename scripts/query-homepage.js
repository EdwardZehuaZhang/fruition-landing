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
  const doc = await client.fetch('*[_type == "homePage"][0]{ _id, contentBlocks[]{ _key, _type, heading } }')
  console.log(JSON.stringify(doc, null, 2))
}

run().catch(console.error)
