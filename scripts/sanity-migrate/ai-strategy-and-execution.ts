/**
 * Populate Sanity fields for the ai-strategy-and-execution servicePage doc
 * so the frontend can stop falling back to hardcoded constants.
 *
 * Idempotent — re-running patches the existing doc; values already set in
 * Sanity Studio are preserved (we use setIfMissing).
 *
 *   pnpm tsx scripts/sanity-migrate/ai-strategy-and-execution.ts
 */
import { writeClient } from './lib'

const SLUG = 'ai-strategy-and-execution'
const TYPE = 'servicePage'

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{ _id }`,
    { type: TYPE, slug: SLUG },
  )
  if (!existing?._id) throw new Error(`No ${TYPE} doc with slug ${SLUG}`)

  await writeClient
    .patch(existing._id)
    .setIfMissing({
      // Logo cloud headings — previously hardcoded in AiStrategyContent.tsx
      logoCloudHeadingPart1: 'Clients who have used our ',
      logoCloudHeadingAccent: 'monday.com consulting services',
      // Hero image local fallback — preserves GIF animation that the Sanity
      // image pipeline strips when transcoding to webp/avif. Previously
      // hardcoded as `heroImageUrl="/images/ai-strategy-hero.gif"` in the
      // component.
      heroImageUrl: '/images/ai-strategy-hero.gif',
    })
    .commit()

  console.log(`✅ patched ${TYPE}:${SLUG}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
