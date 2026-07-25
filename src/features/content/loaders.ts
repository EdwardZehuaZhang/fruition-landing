import { cache } from 'react'
import { client } from '@/sanity/client'

export async function getHomePage() {
  return client.fetch(
    `*[_type == "homePage"][0] {
      _id,
      title,
      seoTitle,
      seoDescription,
      contentBlocks[] {
        _key,
        _type,
        ...
      }
    }`
  )
}

// Deduped per render pass: the root layout fetches this in both
// generateMetadata and the component body, so without cache() every page
// render hit the Sanity CDN twice for the same document.
export const getSiteSettings = cache(async () => {
  return client.fetch(`*[_type == "siteSettings"][0]`)
})
