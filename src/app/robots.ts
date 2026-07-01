import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fruitionservices.io'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/consulting-blog/categories/',
        '/consulting-blog/hashtags/',
        '/consulting-blog/search/',
        '/consulting-blog/tags/',
        '/faqs?category',
        '/internal/',
        '/studio/',
      ],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}
