/* eslint-disable */
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'bt6nb58h',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const doc = await client.fetch(`*[_type == "page" && slug.current == "consulting-blog"][0]`)
console.log('=== page:consulting-blog ===')
console.log(JSON.stringify(doc, null, 2))

const cats = await client.fetch(`*[_type == "blogCategory"] | order(title asc) { _id, title, "slug": slug.current, description }`)
console.log('=== blogCategory list ===')
console.log(JSON.stringify(cats, null, 2))
