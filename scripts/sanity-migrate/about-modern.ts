/**
 * Migration: backfill the About Us (`page` doc, slug `about-us`) with
 * field values previously hardcoded in AboutModern.tsx.
 *
 * Only writes into fields that ALREADY exist on the `page` schema and
 * are already pulled by `getPageBySlug`. Fields that require NEW schema
 * additions are documented separately in the script's report (see the
 * companion task report) and intentionally NOT written here.
 *
 * Idempotent: uses setIfMissing so existing edits in Sanity Studio win.
 *
 * Run:
 *   pnpm tsx scripts/sanity-migrate/about-modern.ts
 */
import { writeClient } from './lib'

const SLUG = 'about-us'
const TYPE = 'page'

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{ _id }`,
    { type: TYPE, slug: SLUG },
  )
  if (!existing?._id) throw new Error(`No ${TYPE} doc with slug ${SLUG}`)

  await writeClient
    .patch(existing._id)
    .setIfMissing({
      // Hero eyebrow chip (currently hardcoded fallback "About Fruition")
      heroEyebrow: 'About Fruition',
      // Secondary CTA in hero (currently hardcoded "▶️ Meet the team" → /fruition-team)
      secondaryCtaLabel: '▶️ Meet the team',
      secondaryCtaUrl: '/fruition-team',
      // ChallengesBento eyebrow (currently hardcoded fallback "What we solve")
      capabilitiesEyebrow: 'What we solve',
    })
    .commit()

  console.log(`✅ patched ${TYPE}:${SLUG}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
