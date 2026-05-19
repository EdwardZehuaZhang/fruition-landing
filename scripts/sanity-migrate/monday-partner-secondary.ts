/**
 * Phase 2: migrate inline hardcoded JSX strings on the 5 monday-partner-*
 * location pages into Sanity.
 *
 * Per-page values come straight from the previous JSX. Uses `setIfMissing`
 * so re-running is a no-op for fields already populated in Sanity.
 *
 *   npx tsx scripts/sanity-migrate/monday-partner-secondary.ts
 */
import { writeClient } from './lib'

interface LocationDoc {
  _id: string
  [key: string]: unknown
}

type Patch = Record<string, unknown>

const COMMON_TEAM_CTA: Patch = {
  teamGridCtaLabel: 'Learn More About Us',
  teamGridCtaUrl: '/fruition-team',
}

const COMMON_TESTIMONIALS: Patch = {
  testimonialsGridHeading: 'What our customers say about us 🙌',
  testimonialsGridCtaLabel: '🚀  Start Your Transformation',
  testimonialsGridStatValue: '500+',
  testimonialsGridStatSubtitle:
    'have maximised their workflows with our monday.com expert support',
  testimonialsGridStatCtaLabel: 'Read our case studies',
  testimonialsGridStatCtaUrl: '/customer-testimonials',
}

const COMMON_FAQ: Patch = {
  faqHeading: 'Frequently asked questions',
}

const PATCHES: Record<string, Patch> = {
  'monday-partner-australia': {
    comparisonHeading:
      'Streamline Operations & Maximise Efficiency with Our monday.com Consultants',
    comparisonSubheading:
      'Our expert consultants empower you to adopt workflow automation & AI systems',
    teamGridHeading: 'Meet the Fruition Australia team',
    ...COMMON_TEAM_CTA,
    ...COMMON_TESTIMONIALS,
    ...COMMON_FAQ,
  },
  'monday-partner-uk': {
    comparisonHeading:
      'Streamline Operations & Maximise Efficiency with Our monday.com Consultants',
    comparisonSubheading:
      'Our expert consultants empower you to adopt workflow automation & AI systems',
    teamGridHeading: 'Meet the Fruition UK team',
    ...COMMON_TEAM_CTA,
    ...COMMON_TESTIMONIALS,
    ...COMMON_FAQ,
  },
  'monday-partner-us': {
    comparisonHeading:
      'Streamline Operations & Maximize Efficiency with Our monday.com Consultants',
    comparisonSubheading:
      'Our expert consultants empower you to adopt workflow automation & AI systems',
    teamGridHeading: 'Meet the Fruition US team',
    ...COMMON_TEAM_CTA,
    ...COMMON_TESTIMONIALS,
    ...COMMON_FAQ,
  },
  'monday-partner-singapore': {
    comparisonHeading:
      'Streamline Operations & Maximise Efficiency with a monday.com Expert',
    comparisonSubheading:
      'We transform fragmented business processes into cohesive, automated systems that enhance team collaboration and deliver measurable ROI across your entire organisation.',
    teamGridHeading: 'Meet the Fruition Singapore team',
    ...COMMON_TEAM_CTA,
    ...COMMON_TESTIMONIALS,
    ...COMMON_FAQ,
  },
  'monday-partner-india': {
    comparisonHeading:
      'Streamline Operations & Maximise Efficiency with Our monday.com Consultants',
    comparisonSubheading:
      'Our expert consultants empower you to adopt workflow automation & AI systems',
    teamGridHeading: 'Meet the Fruition India team',
    teamGridSubheading:
      "Our monday.com consultants have expertise across various industries. As a certified monday.com partner, we guarantee the delivery of the right solution and training to optimise your team's efficiency.",
    ...COMMON_TEAM_CTA,
    ...COMMON_TESTIMONIALS,
    ...COMMON_FAQ,
  },
}

async function main() {
  for (const [slug, patch] of Object.entries(PATCHES)) {
    const doc = await writeClient.fetch<LocationDoc | null>(
      `*[_type == "locationPage" && slug.current == $slug][0]`,
      { slug }
    )
    if (!doc?._id) {
      console.warn(`  ! locationPage:${slug} not found — skipping`)
      continue
    }

    // setIfMissing skips any field already populated.
    const toSet: Patch = {}
    for (const [key, value] of Object.entries(patch)) {
      const current = doc[key]
      if (current === null || current === undefined || current === '') {
        toSet[key] = value
      }
    }

    if (Object.keys(toSet).length === 0) {
      console.log(`  · locationPage:${slug} — all fields already populated`)
      continue
    }

    console.log(`  ✎ locationPage:${slug} — setting:`, Object.keys(toSet))
    await writeClient.patch(doc._id).setIfMissing(toSet).commit()
  }

  console.log('✓ Phase 2 monday-partner-* secondary fields populated')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
