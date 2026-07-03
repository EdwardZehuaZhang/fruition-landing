import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fruitionservices.io'

export default function robots(): MetadataRoute.Robots {
  // Deliberately NOT disallowed:
  // - /consulting-blog/{tags,hashtags,search}/ — Wix-era URLs with a stale
  //   "noindex" classification in Search Console. They 404 on this site, but
  //   Google can only discover that if it is allowed to recrawl them.
  // - /consulting-blog/categories/ — noindexed via page metadata; a robots
  //   block would stop Google from ever seeing that tag.
  // - /faqs?category=... — consolidated onto /faqs via its canonical URL.
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/internal/', '/studio/'],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}
