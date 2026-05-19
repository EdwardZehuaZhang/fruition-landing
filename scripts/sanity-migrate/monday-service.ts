/**
 * Populate Sanity fields for the monday-service solutionPage doc so the
 * frontend can stop falling back to hardcoded constants.
 *
 * Audit confirmed comparisonTabs, fourCards, faqFlatItems, strategicColumns,
 * heroSubheading, calendly headings, testimonialBanner* heading parts are
 * already populated on the doc. The only remaining inline fallbacks in JSX
 * are runtime guards (calendly URL) and a route-specific override for the
 * third partner-badge slot pointing at /images/monday-svc-logo.avif — the
 * latter is per-page chrome that lives outside the global navbar badges,
 * so we expose a dedicated heroPartnerBadges array on the doc and let the
 * FE read it.
 *
 *   npx tsx scripts/sanity-migrate/monday-service.ts
 */
import { writeClient, uploadLocalImage } from './lib'

const SLUG = 'monday-service'
const TYPE = 'solutionPage'

async function main() {
  const existing = await writeClient.fetch<{
    _id: string
    heroPartnerBadges?: unknown[]
  } | null>(
    `*[_type == $type && slug.current == $slug][0]{ _id, heroPartnerBadges }`,
    { type: TYPE, slug: SLUG },
  )
  if (!existing?._id) throw new Error(`No ${TYPE} doc with slug ${SLUG}`)

  // Backfill page-level fallbacks. Most copy is already on the doc.
  await writeClient
    .patch(existing._id)
    .setIfMissing({
      // hero subheading already set, calendly heading/subheading already set,
      // testimonialBanner heading already set — no action needed here.
      // Reserved key so re-runs are still idempotent if Sanity returns nothing.
      hideTestimonialBanner: false,
    })
    .commit()

  // Seed heroPartnerBadges only if the editor hasn't curated them. We mirror
  // the existing navbar badges + add monday-svc-logo as the third slot so the
  // FE can render directly from `heroPartnerBadges` and stop reaching for the
  // hardcoded /images/monday-svc-logo.avif path.
  if (!existing.heroPartnerBadges || (existing.heroPartnerBadges as unknown[]).length === 0) {
    const settings = await writeClient.fetch<{
      navbarPartnerBadges?: Array<{ name?: string; image?: unknown; width?: number; height?: number }>
    } | null>(`*[_type == "siteSettings"][0]{ navbarPartnerBadges }`)
    const navbarBadges = settings?.navbarPartnerBadges ?? []
    if (navbarBadges.length >= 2) {
      const svcLogo = await uploadLocalImage('/images/monday-svc-logo.avif')
      const badges = [
        { ...navbarBadges[0], _key: 'svc-badge-0' },
        { ...navbarBadges[1], _key: 'svc-badge-1' },
        {
          _key: 'svc-badge-2',
          name: 'monday Service',
          image: svcLogo,
          width: 120,
          height: 44,
        },
      ]
      await writeClient.patch(existing._id).set({ heroPartnerBadges: badges }).commit()
      console.log('  ✓ seeded heroPartnerBadges with monday Service logo')
    } else {
      console.log('  ⚠ navbarPartnerBadges < 2; left heroPartnerBadges empty')
    }
  } else {
    console.log('  ↺ heroPartnerBadges already curated; preserved')
  }

  console.log(`✅ patched ${TYPE}:${SLUG}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
