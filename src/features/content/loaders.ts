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

/**
 * Everything the 2026 home page needs, in one round trip.
 *
 * The page's copy lives in `src/components/home/data.ts`; this only fetches the
 * parts that must stay live — client logos, testimonials, office phone numbers
 * and the three most recent posts. Testimonials still come from the homePage
 * `contentBlocks` so the marketing team keeps editing them where they always
 * have, even though the blocks are no longer rendered by BlockRenderer.
 */
export async function getHomeSectionData() {
  return client.fetch(
    `{
      "settings": *[_type == "siteSettings"][0]{
        contactEmail,
        phone,
        calendlyLink,
        offices,
        carouselLogos[]{ _key, alt, image }
      },
      "testimonials": *[_type == "homePage"][0].contentBlocks[_type == "testimonialBlock"]{
        _key,
        quote,
        authorName,
        authorRole,
        company,
        profilePhoto
      },
      "posts": *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc)[0...3]{
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        author,
        excerpt,
        "coverImage": coalesce(coverImage, mainImage, featuredImage, heroImage, body[_type == "image"][0]),
        "charCount": length(pt::text(body)),
        categories[]->{ _id, title }
      }
    }`
  )
}
