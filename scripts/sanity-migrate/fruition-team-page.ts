/**
 * Populate Sanity fields for the `page` doc with slug `fruition-team`
 * so the /fruition-team route can read content from Sanity instead of
 * relying on inline JSX literals.
 *
 * Idempotent — uses setIfMissing so values an editor changes in Studio
 * are preserved on re-run.
 *
 *   pnpm tsx scripts/sanity-migrate/fruition-team-page.ts
 */
import { writeClient } from './lib'

const SLUG = 'fruition-team'
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
      // Hero CTA — was a hardcoded "🚀 Book a Meeting" string in the client.
      primaryCtaLabel: '🚀 Book a Meeting',
    })
    .commit()

  console.log(`✅ patched ${TYPE}:${SLUG}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
