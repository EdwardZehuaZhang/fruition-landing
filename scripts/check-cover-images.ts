import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const client = createClient({ projectId: 'bt6nb58h', dataset: 'production', apiVersion: '2024-01-01', useCdn: false })

async function main() {
  const posts = await client.fetch(
    `*[_type == "blogPost"] | order(publishedAt desc)[0...24]{
      title,
      "slug": slug.current,
      "hasCover": defined(coverImage.asset),
      "ref": coverImage.asset._ref
    }`
  )
  console.log('Total:', posts.length)
  console.log('With cover:', posts.filter((p: any) => p.hasCover).length)
  console.log('\nWithout cover:')
  posts.filter((p: any) => !p.hasCover).forEach((p: any) => console.log(' -', p.title.substring(0, 70), '[' + p.slug + ']'))
  console.log('\nWith cover:')
  posts.filter((p: any) => p.hasCover).forEach((p: any) => console.log(' -', p.title.substring(0, 60), '→', p.ref))
}

main()
