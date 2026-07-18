/**
 * Consolidate the scattered per-page quote-testimonial arrays into central
 * `caseStudy` docs (the existing testimonial store), tagged with page keys.
 *
 * Sources (all already in Sanity, on page docs):
 *  - industryPage.industryTestimonials   → pageKey = slug
 *  - partnershipPage.partnerTestimonials → pageKey = partnerships/<slug>
 *  - *.solarTestimonials                 → pageKey from slug (solution page)
 *  - *.inlineTestimonials                → pageKey from slug
 *
 * CREATE-ONLY (createIfNotExists, dot-free ids) — rerun-safe; page fields are
 * left untouched and keep working as render fallbacks. Sanity image refs are
 * copied into profilePhoto; string photo URLs are skipped (initial-avatar
 * fallback covers them at render time).
 *
 * Run with: npx tsx scripts/sanity-migrate/central-testimonials.ts
 */
import { writeClient } from './lib'

const idSafe = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, '-')

interface RawT {
  quote?: string
  name?: string
  role?: string
  company?: string
  title?: string
  image?: unknown
  photo?: unknown
}

/** Sanity image ref object (not a URL string) or undefined. */
const imageRef = (t: RawT) => {
  for (const v of [t.image, t.photo]) {
    if (v && typeof v === 'object') return v
  }
  return undefined
}

async function main() {
  let created = 0
  let existed = 0
  let skipped = 0

  const push = async (pageKey: string, industry: string | undefined, items: RawT[] | undefined) => {
    if (!items?.length) return
    for (let i = 0; i < items.length; i++) {
      const t = items[i]
      if (!t?.quote?.trim() || !t?.name?.trim()) { skipped++; continue }
      const _id = `caseStudy-migrated-${idSafe(pageKey)}-${i}`
      const before = await writeClient.fetch(`defined(*[_id == $id][0])`, { id: _id })
      const img = imageRef(t)
      const doc = {
        _id,
        _type: 'caseStudy' as const,
        clientName: t.name.trim(),
        clientRole: t.role?.trim(),
        clientCompany: t.company?.trim(),
        quote: t.quote.trim(),
        ...(t.title?.trim() ? { headline: t.title.trim() } : {}),
        ...(img ? { profilePhoto: img } : {}),
        ...(industry ? { industry } : {}),
        pages: [pageKey],
        order: i,
      }
      if (before) {
        // Backfill fields an earlier script version missed; never touch edited text.
        const patch: Record<string, unknown> = {}
        if (img) patch.profilePhoto = img
        if (t.title?.trim()) patch.headline = t.title.trim()
        if (Object.keys(patch).length) {
          await writeClient.patch(_id).setIfMissing(patch).commit()
        }
        existed++
      } else {
        await writeClient.createIfNotExists(doc)
        created++
      }
    }
  }

  /* 1. Industry pages */
  const industryDocs: { slug: string; title?: string; industryTestimonials?: RawT[] }[] =
    await writeClient.fetch(`*[_type == "industryPage" && defined(industryTestimonials)]{ "slug": slug.current, title, industryTestimonials }`)
  for (const d of industryDocs) await push(d.slug, d.title, d.industryTestimonials)

  /* 2. Partnership pages */
  const partnerDocs: { slug: string; partnerTestimonials?: RawT[] }[] =
    await writeClient.fetch(`*[_type == "partnershipPage" && defined(partnerTestimonials)]{ "slug": slug.current, partnerTestimonials }`)
  for (const d of partnerDocs) await push(`partnerships/${d.slug}`, undefined, d.partnerTestimonials)

  /* 3+4. Any doc carrying solarTestimonials / inlineTestimonials */
  const solarDocs: { _type: string; slug?: string; solarTestimonials?: RawT[] }[] =
    await writeClient.fetch(`*[defined(solarTestimonials)]{ _type, "slug": slug.current, solarTestimonials }`)
  for (const d of solarDocs) {
    if (!d.slug) continue
    await push(`monday-consulting-solutions/${d.slug}`, 'Solar & Renewables', d.solarTestimonials)
  }
  const inlineDocs: { _type: string; slug?: string; inlineTestimonials?: RawT[] }[] =
    await writeClient.fetch(`*[defined(inlineTestimonials)]{ _type, "slug": slug.current, inlineTestimonials }`)
  for (const d of inlineDocs) {
    if (!d.slug) continue
    await push(`monday-consulting-solutions/${d.slug}`, undefined, d.inlineTestimonials)
  }

  console.log(`Done. Created ${created} caseStudy docs, ${existed} already existed, ${skipped} skipped (missing quote/name).`)
  console.log(`Sources: ${industryDocs.length} industry, ${partnerDocs.length} partnership, ${solarDocs.length} solar, ${inlineDocs.length} inline.`)
}

main().catch((e) => { console.error(e); process.exit(1) })
