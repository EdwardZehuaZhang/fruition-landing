/**
 * Populate Sanity fields for the monday-consulting-solutions `page` doc
 * that backs `/monday-consulting-solutions/catalog`.
 *
 * Idempotent — re-running patches the existing doc; fields already set in
 * Sanity Studio are preserved (we use setIfMissing for everything).
 *
 *   pnpm tsx scripts/sanity-migrate/monday-consulting-solutions.ts
 *
 * ────────────────────────────────────────────────────────────────────
 *  NOT migrated (no matching schema field on `page`):
 *  ────────────────────────────────────────────────
 *  - CatalogHero `STATS` — array of 4 free-form badge strings
 *      ("45 solutions", "289 client builds", "US, APAC & UK",
 *       "monday.com Platinum Partner"). The closest schema field is
 *      `heroStats` but that is { value, label }, not a plain string list.
 *      Left as a frontend constant in CatalogHero.tsx.
 *  - SolutionModal `TAB_LABELS` — internal a11y labels
 *      ("Overview", "Workflow", "Similar Builds"). These are tab a11y
 *      strings tightly coupled to the three render branches (OverviewTab,
 *      WorkflowTab, SimilarTab). No matching field on `page`.
 *      Left as a frontend constant in SolutionModal.tsx.
 *  - All of CatalogContent's component data (`SOLUTIONS`, `RICH_MERMAID`,
 *      industry map, project builds index, etc.) lives in
 *      `catalog/data/*` and is out of scope for this migration.
 * ────────────────────────────────────────────────────────────────────
 */
import { writeClient } from './lib'

const SLUG = 'monday-consulting-solutions'
const TYPE = 'page'

async function main() {
  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{ _id }`,
    { type: TYPE, slug: SLUG },
  )
  if (!existing?._id) throw new Error(`No ${TYPE} doc with slug ${SLUG}`)

  // Hero copy + SEO. setIfMissing so anything set in Studio wins.
  await writeClient
    .patch(existing._id)
    .setIfMissing({
      title: 'monday.com Consulting Solutions',
      seoTitle: 'Solutions Catalog | Fruition Services',
      seoDescription:
        'The full map of what Fruition builds on monday.com. 45 solutions across Work Management, CRM, Service, Operations, and the 2026 R&D pipeline.',
      heroHeading: 'monday.com Solutions',
      heroSubheading:
        'Purpose-built solutions for every team. Powered by monday.com, configured by Fruition.',
      primaryCtaLabel: 'Book a Consultation',
      primaryCtaUrl: 'https://calendly.com/global-calendar-fruitionservices',
    })
    .commit()

  console.log(`✅ patched ${TYPE}:${SLUG}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
