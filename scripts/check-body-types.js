require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')
const client = createClient({ projectId: 'bt6nb58h', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false })
async function run() {
  const types = await client.fetch('array::unique(*[_type == "blogPost"].body[]._type)')
  console.log('Body block types in use:', JSON.stringify(types))
  // Sample a post body to see structure
  const post = await client.fetch('*[_type == "blogPost" && defined(body)][0]{ title, body[0..5] }')
  console.log('\nSample post body blocks:', JSON.stringify(post.body, null, 2))
}
run().catch(e => console.error(e.message))