/**
 * Populate Sanity fields for the monday-project-management solutionPage doc
 * so the frontend can stop falling back to hardcoded constants.
 *
 * Idempotent — re-running patches the existing doc; we use setIfMissing for
 * anything an editor may have already curated.
 *
 *   npx tsx scripts/sanity-migrate/monday-project-management.ts
 */
import { writeClient } from './lib'

const SLUG = 'monday-project-management'
const TYPE = 'solutionPage'

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{ _id }`,
    { type: TYPE, slug: SLUG },
  )
  if (!existing?._id) throw new Error(`No ${TYPE} doc with slug ${SLUG}`)

  // Sanity already has comparisonTabs, capabilitiesCards, solutionCards,
  // industryTabs, calendlyHeading, joinStats etc. Remaining inline JSX
  // fallbacks to backfill so the FE can drop the `||` defaults safely:
  //
  //   - logo cloud heading + accent
  //   - calendly subheading (heading already set)
  //   - testimonial banner heading (part1 / accent / part2)
  await writeClient
    .patch(existing._id)
    .setIfMissing({
      logoCloudHeadingPart1: 'Clients who have used our ',
      logoCloudHeadingAccent: 'monday.com consulting services',
      calendlySubheading:
        'Schedule a demo with our certified monday.com consultants to explore how Monday.com can streamline your project management workflows. Discover custom solutions for planning, tracking, and reporting projects, and receive a 4-week extended trial.',
      testimonialBannerHeadingPart1: 'Join ',
      testimonialBannerHeadingAccent: '500+ organisations',
      testimonialBannerHeadingPart2:
        ' that have maximised their workflows with our monday.com expert support',
    })
    .commit()

  console.log(`✅ patched ${TYPE}:${SLUG}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
