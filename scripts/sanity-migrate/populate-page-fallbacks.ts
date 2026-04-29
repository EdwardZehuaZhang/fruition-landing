/**
 * Patch `page` documents that previously relied on hardcoded fallback strings
 * inside route components (customer-testimonials, careers, faqs).
 *
 * Only sets fields that are currently empty/null/undefined in Sanity.
 *
 *   npx tsx scripts/sanity-migrate/populate-page-fallbacks.ts
 */
import { writeClient } from './lib'

interface PageDoc {
  _id: string
  [key: string]: unknown
}

const PAGE_PATCHES: Record<string, Record<string, unknown>> = {
  'customer-testimonials': {
    heroHeading: 'Case Studies',
    heroSubheading:
      'A big part of our operation is ensuring we set up our clients for success through our specialized monday.com and AI expertise.',
    heroBody:
      'Become part of the growing community of companies across all industries that have optimised their workflows and boosted team performance with our proven guidance.',
    primaryCtaLabel: '🚀 Get Started',
    secondaryCtaLabel: '📑 Learn More',
    secondaryCtaUrl: '#case-studies',
    logoCloudHeadingPart1: 'Clients who have used our ',
    logoCloudHeadingAccent: 'monday.com expert consultants',
    calendlyHeading: 'Schedule Your Personalised Demo With A monday.com Expert',
    calendlySubheading:
      'Schedule a demo with our monday.com implementation consultants to discover how monday.com can be customised for your business, and get a free 4-week extended trial to experience its full potential.',
    discoverHeading: 'Discover how much monday.com can do for your team.',
    discoverPrimaryCtaLabel: 'Schedule a Consultation',
    discoverSecondaryCtaLabel: 'Get Started with monday.com',
  },
  faqs: {
    calendlyHeading: 'Still have questions?',
    calendlySubheading:
      'Our team is happy to walk you through monday.com and how Fruition can help your business grow.',
  },
}

async function main() {
  for (const [slug, patch] of Object.entries(PAGE_PATCHES)) {
    const doc = await writeClient.fetch<PageDoc | null>(
      `*[_type == "page" && slug.current == $slug][0]`,
      { slug }
    )
    if (!doc?._id) {
      console.warn(`page:${slug} not found — skipping`)
      continue
    }

    // Only set fields that are currently empty
    const filtered: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(patch)) {
      const current = doc[key]
      if (current === null || current === undefined || current === '') {
        filtered[key] = value
      }
    }

    if (Object.keys(filtered).length === 0) {
      console.log(`page:${slug} — nothing to patch (all fields already set)`)
      continue
    }

    console.log(`Patching page:${slug} fields:`, Object.keys(filtered))
    await writeClient.patch(doc._id).set(filtered).commit()
  }

  console.log('✓ Page fallback fields populated')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
