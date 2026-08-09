/**
 * Regional landing-page SEO refresh — all six monday-partner-* location pages.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  DO NOT RUN UNTIL VADIM + EDWARD HAVE SIGNED OFF ON THE KEYWORD COPY.    │
 * │  Josh's brief (monday.com update 126683821, 2026-08-09; Slack            │
 * │  #fruition-digital thread 1786271014.579209) asks Vadim to review the    │
 * │  keyword set *with* Edward before the copy lands. Everything below is an │
 * │  evidence-based draft; running this patches the live production dataset. │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * Why this exists
 * ---------------
 * `seo-cro-text.ts` (the Feb CRO audit) covered only US / UK / Australia.
 * India and Singapore were never in that pass and still carry the generic
 * "… | Fruition Services" titles with thin, near-duplicate descriptions.
 * Philippines was added later and has a 78-character title that truncates in
 * the SERP. This script brings all six onto one deliberate pattern:
 *
 *     seoTitle        "monday.com Partner <Geo> | <high-intent secondary>"
 *     seoDescription  distinct per region, 140–160 chars, benefit-first
 *
 * Keyword evidence (not invented)
 * -------------------------------
 * • "monday com implementation specialist" holds Position 1 for Fruition, and
 *   "monday.com professional services" reached Position 10 — per the Semrush /
 *   GA reports on monday.com board 5025525973 (updates 109250513, 112011268).
 *   That is why every title carries an "implementation consultants" variant.
 * • "monday.com partner <geo>" is the existing primary for these pages and is
 *   preserved verbatim at the front of every title.
 * • Geo modifiers are limited to offices Fruition actually has, per
 *   `patch-footer-offices.ts`: Sydney, New York, London, Singapore, India,
 *   Philippines. Manila / Cebu / Davao are retained only because they are
 *   already live in the Philippines description — not newly asserted here.
 *
 * Claims discipline
 * -----------------
 * "certified monday.com partner" only — the phrasing already live on all six
 * pages. No tier claim (Platinum/Silver), no client outcomes, no performance
 * numbers, per docs/voice-guide-fruition.md "CLAIMS (still enforced)".
 *
 * Only Singapore's H1 is touched: it is currently the bare string
 * "monday.com Partner Singapore" with no value proposition, unlike the other
 * five. The audit-approved AU/UK/US H1s and the IN/PH H1s are left alone.
 *
 * Dry run:  DRY=1 npx tsx scripts/sanity-migrate/regional-seo-refresh.ts
 * Live:     npx tsx scripts/sanity-migrate/regional-seo-refresh.ts
 */
import { writeClient } from './lib'

const DRY = !!process.env.DRY

interface RegionalSeo {
  slug: string
  seoTitle: string
  seoDescription: string
  /** Optional H1 patch — only set where the current H1 is genuinely weak. */
  heroHeading?: string
}

const PAGES: RegionalSeo[] = [
  {
    slug: 'monday-partner-australia',
    seoTitle: 'monday.com Partner Australia | Implementation Consultants',
    seoDescription:
      'Certified monday.com partner in Australia. Our implementation consultants build CRM, workflow automation and reporting for Sydney and Melbourne teams.',
  },
  {
    slug: 'monday-partner-uk',
    seoTitle: 'monday.com Partner UK | London Implementation Consultants',
    seoDescription:
      'Certified monday.com partner in the UK. From our London office we implement monday.com CRM, workflow automation and training for growing teams.',
  },
  {
    slug: 'monday-partner-us',
    seoTitle: 'monday.com Partner USA | CRM & Workflow Implementation',
    seoDescription:
      'Certified monday.com partner in the US. Our implementation consultants turn manual processes into monday.com CRM and automated workflows that scale.',
  },
  {
    slug: 'monday-partner-india',
    seoTitle: 'monday.com Partner India | Implementation & CRM Consultants',
    seoDescription:
      'Certified monday.com partner in India. Get expert monday.com implementation, CRM setup, integrations and team training from consultants in your timezone.',
  },
  {
    slug: 'monday-partner-singapore',
    seoTitle: 'monday.com Partner Singapore | Implementation Consultants',
    seoDescription:
      'Certified monday.com partner in Singapore. Our consultants deliver monday.com implementation, CRM and workflow automation for lean, fast-growing teams.',
    // Current H1 is the bare keyword with no value proposition — the only one
    // of the six that reads as a placeholder. Brought onto the AU/UK/US shape.
    heroHeading: 'Scale Your Operations with a Certified monday.com Partner Singapore.',
  },
  {
    slug: 'monday-partner-philippines',
    seoTitle: 'monday.com Partner Philippines | Implementation Consultants',
    seoDescription:
      'Certified monday.com partner in the Philippines. Local consultants deliver monday.com implementation, CRM and work management in Manila, Cebu and Davao.',
  },
]

/** SERP guardrails — titles truncate near 60 chars, descriptions near 160. */
const TITLE_MAX = 60
const DESC_MIN = 140
const DESC_MAX = 160

function lint(): boolean {
  let clean = true
  const titles = new Set<string>()
  const descriptions = new Set<string>()

  for (const p of PAGES) {
    if (p.seoTitle.length > TITLE_MAX) {
      console.error(`  ✗ ${p.slug} — title is ${p.seoTitle.length} chars (max ${TITLE_MAX})`)
      clean = false
    }
    if (p.seoDescription.length < DESC_MIN || p.seoDescription.length > DESC_MAX) {
      console.error(
        `  ✗ ${p.slug} — description is ${p.seoDescription.length} chars (want ${DESC_MIN}-${DESC_MAX})`
      )
      clean = false
    }
    // Duplicate titles/descriptions across regional pages are a ranking
    // liability — these six pages compete for the same head term.
    if (titles.has(p.seoTitle)) {
      console.error(`  ✗ ${p.slug} — duplicate seoTitle`)
      clean = false
    }
    if (descriptions.has(p.seoDescription)) {
      console.error(`  ✗ ${p.slug} — duplicate seoDescription`)
      clean = false
    }
    titles.add(p.seoTitle)
    descriptions.add(p.seoDescription)
  }
  return clean
}

async function run() {
  console.log(`\n${DRY ? '🌵 DRY RUN — no writes' : '✍️  LIVE — patching Sanity'}\n`)

  if (!lint()) {
    console.error('\nSEO lint failed — fix the copy above before running.\n')
    process.exit(1)
  }

  let ok = 0
  let missing = 0

  for (const page of PAGES) {
    const id = await writeClient.fetch<string | null>(
      `*[_type == "locationPage" && slug.current == $slug][0]._id`,
      { slug: page.slug }
    )
    if (!id) {
      console.warn(`  ! ${page.slug} — no locationPage doc found — SKIPPING`)
      missing++
      continue
    }

    // Partial .set() only — never replaces the doc, so hero media, CRO
    // sections, FAQ tabs and every other field are preserved untouched.
    const patch: Record<string, unknown> = {
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      ...(page.heroHeading ? { heroHeading: page.heroHeading } : {}),
    }

    if (DRY) {
      const current = await writeClient.fetch(
        `*[_id == $id][0]{ seoTitle, seoDescription, heroHeading }`,
        { id }
      )
      console.log(`  • ${page.slug}  (${id})`)
      console.log(`      set: ${JSON.stringify(patch)}`)
      console.log(`      was: ${JSON.stringify(current)}`)
    } else {
      await writeClient.patch(id).set(patch).commit()
      console.log(`  ✎ ${page.slug}  (${id})`)
    }
    ok++
  }

  console.log(`\nDone. ${ok}/${PAGES.length} resolved${missing ? `, ${missing} missing` : ''}.\n`)
  if (missing) process.exitCode = 1
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
