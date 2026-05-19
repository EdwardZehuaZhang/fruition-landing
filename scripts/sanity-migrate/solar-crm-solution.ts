/**
 * Populate Sanity fields for the solar-crm-solution solutionPage doc
 * so the frontend can stop falling back to hardcoded constants.
 *
 * Idempotent — re-running patches the existing doc; fields already set in
 * Sanity Studio are preserved (we use setIfMissing for new fields and a
 * forced .set() only for arrays we own end-to-end).
 *
 *   npx tsx scripts/sanity-migrate/solar-crm-solution.ts
 */
import { writeClient, withKeys } from './lib'

const SLUG = 'solar-crm-solution'
const TYPE = 'solutionPage'

const KEY_FEATURES = [
  {
    title: 'Sales Acceleration',
    body: 'Streamlined CPQ process with real-time inventory visibility and automated proposal generation',
  },
  {
    title: 'Operational Efficiency',
    body: 'Automated project board creation from accepted proposals with standardised installation workflows',
  },
  {
    title: 'Resource Optimisation',
    body: 'Integrated inventory management with supplier connections and automated reordering',
  },
  {
    title: 'Portfolio Management',
    body: 'Real-time visibility across all projects with performance tracking and resource allocation tools',
  },
  {
    title: 'Customer Lifecycle',
    body: 'Complete customer journey management from lead acquisition through installation and scheduled maintenance',
  },
]

// 4-stat grid that sits below the Before/After comparison.
// Re-uses the existing `joinStats` field (value/label match exactly).
const FINAL_STATS = [
  { value: '50% reduction', label: 'in repetitive admin tasks' },
  { value: '60% quicker', label: 'quote-to-cash' },
  { value: '30% increase', label: 'in on-time delivery' },
  { value: '20% reduction', label: 'in carrying costs' },
]

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{ _id }`,
    { type: TYPE, slug: SLUG },
  )
  if (!existing?._id) throw new Error(`No ${TYPE} doc with slug ${SLUG}`)

  await writeClient
    .patch(existing._id)
    // Arrays we own end-to-end (replace whatever's there):
    .set({
      keyFeatures: withKeys(KEY_FEATURES),
      joinStats: withKeys(FINAL_STATS),
    })
    // Scalars / headings — only set if missing so the Studio can override.
    .setIfMissing({
      // Logo-cloud heading
      logoCloudHeadingPart1: "500+ clients globally use Fruition's ",
      logoCloudHeadingAccent: 'monday.com expert consultants',

      // Trusted-by caption directly under hero
      trustedByCaption: 'Trusted by 300+ businesses worldwide',

      // Key features + Services dual-column section headings
      keyFeaturesHeadingPart1: 'Key ',
      keyFeaturesHeadingAccent: 'Features',
      servicesListHeadingPart1: 'Our ',
      servicesListHeadingAccent: 'Services',

      // Returns banner (purple gradient with testimonials)
      returnsBannerHeading: 'We bring real returns on investment.',
      returnsBannerSubheading:
        'Join 300+ organisations that have implemented with us.',
      returnsBannerPrimaryLabel: '🚀  Book a Consultation',
      returnsBannerSecondaryLabel: '▶️  Get Started with monday.com',
      returnsBannerSecondaryUrl: 'https://monday.com',
    })
    .commit()

  console.log(`✅ patched ${TYPE}:${SLUG}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
