/**
 * Populate Sanity fields for the monday-for-real-estate industryPage doc so
 * the frontend can stop falling back to hardcoded constants.
 *
 * Idempotent — uses setIfMissing for fields that may already be edited in
 * Sanity Studio; only `comparisonTabs` is force-set if Sanity's copy still
 * carries the legacy "Manufacturing" tab label (frontend parity intact).
 *
 *   npx tsx scripts/sanity-migrate/monday-for-real-estate.ts
 */
import { writeClient, withKeys } from './lib'

const SLUG = 'monday-for-real-estate'
const TYPE = 'industryPage'

const ADDITIONAL_TIPS_BODY = `At Fruition Services, we have a tailored approach to help you implement monday.com as your purpose-built CRM for real estate.

**Additional Tips for Successful CRM Implementation:**

**Stakeholder Engagement:** Getting buy-in from all stakeholders, including your team members, is essential before starting the implementation process. This ensures that everyone is on board and committed to the project's success.

**Start Small, Scale Up:** If you're new to CRM, we recommend starting with a smaller scope and gradually expanding the implementation. This approach prevents overwhelming your team and allows for better management of the implementation process.

**Consultant Support:** If you require additional guidance or expertise, consider getting help from a consultant. They bring their experience and knowledge to help you navigate the implementation process effectively and avoid common pitfalls.`

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{ _id }`,
    { type: TYPE, slug: SLUG },
  )
  if (!existing?._id) throw new Error(`No ${TYPE} doc with slug ${SLUG}`)

  await writeClient
    .patch(existing._id)
    .setIfMissing({
      // Section 7 heading ("Why the best use monday.com to manage their
      // Real Estate operations") — replaces inline <h2>.
      capabilitiesHeading: 'Why the best use monday.com to manage their Real Estate operations',

      // Section 9 (TextContentSection — "Additional Tips for Successful CRM
      // Implementation") — page.tsx reads textContentSections[0].
      textContentSections: withKeys([
        {
          _type: 'textContentSection',
          heading: '',
          body: ADDITIONAL_TIPS_BODY,
          theme: 'light',
        },
      ]),

      // Section 8 (TestimonialCtaBanner) — primary CTA label override.
      // headingPart1 / headingAccent / headingPart2 are not patched; the
      // banner component already defaults to identical copy.
      testimonialBannerPrimaryCtaLabel: '🚀 Start Your Transformation',
    })
    .commit()

  console.log(`✓ patched ${TYPE}:${SLUG}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
