import { createClient } from '@sanity/client'
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7yt9zi98',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})
const doc = await client.fetch(`*[_type=="page" && slug.current=="about-us"][0]`)
console.log(JSON.stringify(doc, null, 2))
