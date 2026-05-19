/**
 * Seed remaining hardcoded fallbacks from MondayForConstructionContent.tsx
 * into the industryPage doc with slug `monday-for-construction`.
 *
 * Most fields (heroHeading, comparisonTabs, lifecycleStages, industryTestimonials,
 * calendly copy, primary/secondary CTA labels, logo cloud heading) are already
 * populated in Sanity. This patch only fills the few schema-backed fields that
 * are currently null but consumed via `||` fallbacks in the component:
 *   - faqHeading      → "Frequently asked questions"
 *   - secondaryCtaUrl → "https://monday.com"
 *
 * Idempotent (uses setIfMissing). Run with:
 *   npx tsx scripts/sanity-migrate/monday-for-construction.ts
 */
import { writeClient } from './lib'

const SLUG = 'monday-for-construction'
const TYPE = 'industryPage'

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{ _id }`,
    { type: TYPE, slug: SLUG },
  )
  if (!existing?._id) throw new Error(`No ${TYPE} doc with slug ${SLUG}`)

  await writeClient
    .patch(existing._id)
    .setIfMissing({
      faqHeading: 'Frequently asked questions',
      secondaryCtaUrl: 'https://monday.com',
    })
    .commit()

  console.log(`✅ patched ${TYPE}:${SLUG}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
