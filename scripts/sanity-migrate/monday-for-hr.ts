/**
 * Populate Sanity fields for the monday-for-hr solutionPage doc
 * so the frontend can stop falling back to hardcoded constants.
 *
 * Idempotent — re-running patches the existing doc; fields already set in
 * Sanity Studio are preserved (we use setIfMissing for everything).
 *
 *   pnpm tsx scripts/sanity-migrate/monday-for-hr.ts
 */
import { writeClient } from './lib'

const SLUG = 'monday-for-hr'
const TYPE = 'solutionPage'

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{ _id }`,
    { type: TYPE, slug: SLUG },
  )
  if (!existing?._id) throw new Error(`No ${TYPE} doc with slug ${SLUG}`)

  // comparisonTabs / lifecycleStages / fitReasons / comparisonHeading /
  // comparisonSubheading / hero fields are all already populated in the
  // production doc. The only gap is the logo-cloud heading strings, which
  // were being satisfied by hardcoded `||` fallbacks in the React component.
  await writeClient
    .patch(existing._id)
    .setIfMissing({
      logoCloudHeadingPart1: 'Clients who have used our ',
      logoCloudHeadingAccent: 'monday.com consulting services',
    })
    .commit()

  console.log(`✓ patched ${TYPE}:${SLUG}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
