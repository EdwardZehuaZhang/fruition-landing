/**
 * Populate Sanity fields for the certified-clickup-partner partnershipPage doc
 * so the frontend can stop falling back to hardcoded constants.
 *
 * Idempotent — re-running patches the existing doc; only fills missing
 * scalar overrides (setIfMissing). The large hardcoded arrays
 * (everythingAppCards, servicesTabs, industryTabsPartnership, provenStats,
 * everythingAppFeatures) were already populated in Sanity at the time of
 * migration — no array seeding is performed here.
 *
 *   pnpm tsx scripts/sanity-migrate/certified-clickup-partner.ts
 */
import { writeClient } from './lib'

const SLUG = 'certified-clickup-partner'
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
      logoCloudHeadingPart1: 'Clients who trust our ',
      logoCloudHeadingAccent: 'ClickUp implementation services',
    })
    .commit()

  console.log(`patched ${TYPE}:${SLUG}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
