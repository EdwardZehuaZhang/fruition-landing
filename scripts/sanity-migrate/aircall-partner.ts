/**
 * Seed remaining fallback fields for the aircall-partner partnershipPage doc
 * so the frontend can drop all hardcoded `||` fallbacks.
 *
 * The large arrays (aircallTabs, aircallFeatures) are already populated in
 * Sanity; this script only fills small scalar overrides via setIfMissing.
 *
 *   pnpm tsx scripts/sanity-migrate/aircall-partner.ts
 */
import { writeClient } from './lib'

const SLUG = 'aircall-partner'
const TYPE = 'partnershipPage'

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{ _id }`,
    { type: TYPE, slug: SLUG },
  )
  if (!existing?._id) throw new Error(`No ${TYPE} doc with slug ${SLUG}`)

  await writeClient
    .patch(existing._id)
    .setIfMissing({
      logoCloudHeadingPart1: 'Clients who have used our ',
      logoCloudHeadingAccent: 'Aircall implementation services',
      joinCtaLabel: 'BOOK A MEETING',
      faqHeading: 'Frequently asked questions',
    })
    .commit()

  console.log(`patched ${TYPE}:${SLUG}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
