/**
 * Populate Sanity fields for the certified-atlassian-partner partnershipPage
 * doc so the frontend can stop falling back to hardcoded constants.
 *
 * Idempotent — uses setIfMissing for values the frontend used to default to,
 * so re-running preserves anything already edited in Studio.
 *
 *   pnpm tsx scripts/sanity-migrate/certified-atlassian-partner.ts
 */
import { writeClient } from './lib'

const SLUG = 'certified-atlassian-partner'
const TYPE = 'partnershipPage'

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{ _id }`,
    { type: TYPE, slug: SLUG },
  )
  if (!existing?._id) throw new Error(`No ${TYPE} doc with slug ${SLUG}`)

  await writeClient
    .patch(existing._id)
    // Only fields the frontend previously fell back to when missing.
    // Major content (atlassianTabs, provenStats, serviceCards, expertCards,
    // hero copy, comparison/calendly headings, CTAs) is already populated.
    .setIfMissing({
      logoCloudHeadingPart1: "Clients we've worked with: ",
      logoCloudHeadingAccent: '',
    })
    // Ensure the secondary CTA anchor matches the in-page <div id="atlassian-process" />.
    // Existing value was "#our-process" which did not match.
    .set({
      secondaryCtaUrl: '#atlassian-process',
    })
    .commit()

  console.log(`✅ patched ${TYPE}:${SLUG}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
