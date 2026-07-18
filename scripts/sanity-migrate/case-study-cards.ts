/**
 * Consolidate the /customer-testimonials page-field card array
 * (page.caseStudyCards) into central `caseStudy` docs with kind == "card" —
 * the same store as quote testimonials (handover open item #1).
 *
 * Mapping: card.product → caseStudy.platform (shared filter facet);
 * title/image/services/timeline/verifiedSource copy 1:1; pages/order place it.
 *
 * CREATE-ONLY (createIfNotExists, dot-free ids) — rerun-safe; the page field
 * is left untouched and keeps working as render fallback.
 *
 * Run with: npx tsx scripts/sanity-migrate/case-study-cards.ts
 */
import { writeClient } from './lib'

const PAGE_KEY = 'customer-testimonials'

interface RawCard {
  title?: string
  image?: unknown
  product?: string
  industry?: string
  services?: string
  timeline?: string
  verifiedSource?: string
}

async function main() {
  let created = 0
  let existed = 0
  let skipped = 0

  const page: { caseStudyCards?: RawCard[] } | null = await writeClient.fetch(
    `*[_type == "page" && slug.current == $slug][0]{ caseStudyCards }`,
    { slug: PAGE_KEY }
  )
  const cards = page?.caseStudyCards ?? []

  for (let i = 0; i < cards.length; i++) {
    const c = cards[i]
    if (!c?.title?.trim()) { skipped++; continue }
    const _id = `caseStudy-card-${PAGE_KEY}-${i}`
    const doc = {
      _id,
      _type: 'caseStudy' as const,
      kind: 'card' as const,
      title: c.title.trim(),
      ...(c.image && typeof c.image === 'object' ? { image: c.image } : {}),
      ...(c.product?.trim() ? { platform: c.product.trim() } : {}),
      ...(c.industry?.trim() ? { industry: c.industry.trim() } : {}),
      ...(c.services?.trim() ? { services: c.services.trim() } : {}),
      ...(c.timeline?.trim() ? { timeline: c.timeline.trim() } : {}),
      ...(c.verifiedSource?.trim() ? { verifiedSource: c.verifiedSource.trim() } : {}),
      pages: [PAGE_KEY],
      order: i,
    }
    const before = await writeClient.fetch(`defined(*[_id == $id][0])`, { id: _id })
    if (before) {
      existed++
    } else {
      await writeClient.createIfNotExists(doc)
      created++
    }
  }

  console.log(`Done. Created ${created} card docs, ${existed} already existed, ${skipped} skipped (missing title). Source array: ${cards.length} cards.`)
}

main().catch((e) => { console.error(e); process.exit(1) })
