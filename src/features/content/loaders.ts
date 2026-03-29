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

export async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]`)
}
