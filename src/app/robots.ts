import type { MetadataRoute } from 'next'

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
      ],
    },
  }
}
