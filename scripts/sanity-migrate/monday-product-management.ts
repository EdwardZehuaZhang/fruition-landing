/**
 * Populate Sanity fields for the monday-product-management solutionPage doc
 * so the frontend can stop falling back to hardcoded constants.
 *
 * Idempotent — re-running patches the existing doc; fields already set in
 * Sanity Studio are preserved (we use setIfMissing for everything).
 *
 *   npx tsx scripts/sanity-migrate/monday-product-management.ts
 */
import { writeClient } from './lib'

const SLUG = 'monday-product-management'
const TYPE = 'solutionPage'

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{ _id }`,
    { type: TYPE, slug: SLUG },
  )
  if (!existing?._id) throw new Error(`No ${TYPE} doc with slug ${SLUG}`)

  // Almost everything is already populated in Sanity (whyProductTeamsCards,
  // strategicApproachTabs, industryProductSolutionsTabs, productDevelopmentTabs
  // along with their headings). The only inline fallbacks remaining in JSX
  // are the logo-cloud headings + calendly heading defaults. Backfill those
  // so the frontend can drop the `||` defaults safely.
  await writeClient
    .patch(existing._id)
    .setIfMissing({
      logoCloudHeadingPart1: 'Clients who have used our ',
      logoCloudHeadingAccent: 'monday.com consulting services',
      calendlyHeading:
        'Schedule A 30-Min Consultation With One of Our monday.com Consultants',
    })
    .commit()

  console.log(`✅ patched ${TYPE}:${SLUG}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
