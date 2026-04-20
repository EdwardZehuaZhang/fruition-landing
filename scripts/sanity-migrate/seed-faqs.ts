/**
 * Seed central faqItem documents from /tmp/fruition-faqs-full.json.
 *
 * The source JSON is produced by `node scripts/scrape-faqs-full.js`, which
 * walks the live site and captures every question/answer pair tagged with
 * the tab path the pair was found under, on every page that surfaces FAQs.
 *
 * Why one central document type:
 *   The old model embedded faqTabs[] on every page document, so the same
 *   question (e.g. "Does monday.com offer complimentary CRM functionality?")
 *   lived on 4–5 page docs and drifted. With a single faqItem document per
 *   question, edits happen in one place; the `pages` array controls where
 *   the FAQ surfaces; the `category` string groups items into tabs.
 *
 * Run:  npx tsx scripts/sanity-migrate/seed-faqs.ts
 *       npx tsx scripts/sanity-migrate/seed-faqs.ts --dry-run
 */
import * as fs from 'fs'
import * as crypto from 'crypto'
import { writeClient, textToPortableText } from './lib'

const SRC_PATH = '/tmp/fruition-faqs-full.json'
const DRY_RUN = process.argv.includes('--dry-run')

/**
 * Canonical category labels used as tabs on the FAQs page and individual
 * page FAQ sections. Any scraped tabPath entry whose label matches (case-
 * insensitive, normalized) one of these is treated as the category.
 *
 * Values are ordered — lower index = tab shown earlier.
 */
const CANONICAL_CATEGORIES: Array<{ label: string; aliases?: string[] }> = [
  { label: 'Professional Services' },
  { label: 'monday Work Management', aliases: ['Work Management'] },
  { label: 'monday CRM' },
  { label: 'Expert Consultant Guide' },
  { label: 'General Questions' },
  { label: 'monday Service' },
  { label: 'monday Dev' },
  { label: 'Project Management' },
  { label: 'Training' },
  { label: 'AI FAQs' },
  { label: 'Construction' },
  { label: 'Manufacturing' },
  { label: 'Retail' },
  { label: 'Public Sector' },
  { label: 'Finance & Accounting' },
  { label: 'Marketing & Creative' },
  { label: 'HR' },
  { label: 'Real Estate' },
  { label: 'n8n FAQs' },
  { label: 'Atlassian FAQs' },
  { label: 'Aircall FAQs' },
  { label: 'make.com FAQs' },
  { label: 'Partnership FAQs' },
]

const categoryOrderByLabel = new Map<string, number>()
CANONICAL_CATEGORIES.forEach((c, i) => categoryOrderByLabel.set(c.label, i))

/**
 * Map scraper page slug → the page key stored in faqItem.pages[].
 * The scraper uses its own slug namespace for multi-word partner URLs,
 * so we flatten those back to the real site path.
 */
const SLUG_TO_PAGE_KEY: Record<string, string> = {
  'faqs': 'faqs',
  'monday-training': 'monday-training',
  'monday-implementation-consultants': 'monday-implementation-consultants',
  'implementation-packages': 'implementation-packages',
  'monday-consulting-solutions': 'monday-consulting-solutions',
  'monday-crm-consulting': 'monday-crm-consulting',
  'monday-for-construction': 'monday-for-construction',
  'monday-for-manufacturing': 'monday-for-manufacturing',
  'monday-for-retail': 'monday-for-retail',
  'monday-for-professional-services': 'monday-for-professional-services',
  'monday-for-government': 'monday-for-government',
  'monday-for-marketing': 'monday-for-marketing',
  'monday-for-real-estate': 'monday-for-real-estate',
  'ai-strategy-and-execution': 'ai-strategy-and-execution',
  'partnerships': 'partnerships',
  'partnerships-make-partners': 'partnerships/make-partners',
  'partnerships-n8n': 'partnerships/n8n-integration-partner',
  'partnerships-aircall': 'partnerships/aircall-partner',
  'partnerships-atlassian': 'partnerships/certified-atlassian-partner',
  'partnerships-monday': 'partnerships/monday-consulting-partner',
}

/**
 * Fallback category when the scraped tabPath doesn't match anything
 * canonical — used so every FAQ still lands in a sensible tab even
 * when it was captured from an inner section without FAQ-tab context.
 */
const PAGE_FALLBACK_CATEGORY: Record<string, string> = {
  'monday-for-construction': 'Construction',
  'monday-for-manufacturing': 'Manufacturing',
  'monday-for-retail': 'Retail',
  'monday-for-professional-services': 'Professional Services',
  'monday-for-government': 'Public Sector',
  'monday-for-marketing': 'Marketing & Creative',
  'monday-for-real-estate': 'Real Estate',
  'monday-crm-consulting': 'monday CRM',
  'monday-training': 'Training',
  'ai-strategy-and-execution': 'AI FAQs',
  'partnerships/make-partners': 'make.com FAQs',
  'partnerships/n8n-integration-partner': 'n8n FAQs',
  'partnerships/aircall-partner': 'Aircall FAQs',
  'partnerships/certified-atlassian-partner': 'Atlassian FAQs',
  'partnerships/monday-consulting-partner': 'Partnership FAQs',
  'implementation-packages': 'Professional Services',
  'monday-implementation-consultants': 'Expert Consultant Guide',
  'monday-consulting-solutions': 'General Questions',
  'partnerships': 'Partnership FAQs',
  'faqs': 'General Questions',
}

/** Lowercase-normalize and collapse whitespace to compare scraped labels. */
function normalizeLabel(s: string) {
  return s
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/&amp;/g, '&')
    .trim()
}

const normalizedCanonical = new Map<string, string>()
for (const c of CANONICAL_CATEGORIES) {
  normalizedCanonical.set(normalizeLabel(c.label), c.label)
  for (const alias of c.aliases ?? []) {
    normalizedCanonical.set(normalizeLabel(alias), c.label)
  }
}

function pickCategoryFromTabPath(tabPath: string[], pageKey: string): string {
  // Walk from deepest to shallowest, return the first canonical match.
  for (let i = tabPath.length - 1; i >= 0; i--) {
    const hit = normalizedCanonical.get(normalizeLabel(tabPath[i]))
    if (hit) return hit
  }
  return PAGE_FALLBACK_CATEGORY[pageKey] ?? 'General Questions'
}

/** Stable doc id — derive from the question so reruns upsert, not duplicate. */
function faqId(question: string) {
  const hash = crypto.createHash('sha1').update(question.trim().toLowerCase()).digest('hex')
  return `faq-${hash.slice(0, 16)}`
}

/** Question key used to dedupe — same question on many pages becomes one doc. */
function questionKey(q: string) {
  return q.trim().toLowerCase().replace(/\s+/g, ' ')
}

type ScrapedRecord = {
  question: string
  answer: string
  tabPath: string[]
}

type ScrapedPage = {
  slug: string
  url: string
  records?: ScrapedRecord[]
  error?: string
}

type MergedFaq = {
  question: string
  answer: string
  category: string
  pages: Set<string>
  firstSeenIndex: number
}

function loadSource(): ScrapedPage[] {
  if (!fs.existsSync(SRC_PATH)) {
    throw new Error(`Missing ${SRC_PATH} — run scripts/scrape-faqs-full.js first.`)
  }
  return JSON.parse(fs.readFileSync(SRC_PATH, 'utf-8'))
}

/**
 * Pages that are 100%-dedicated to a single FAQ category — anything
 * captured from one of these pages can be confidently tagged with
 * that category even when the scraper didn't detect a matching tab.
 * Maps pageKey → canonical category.
 */
const DEDICATED_PAGE_CATEGORIES: Record<string, string> = {
  'partnerships/n8n-integration-partner': 'n8n FAQs',
  'partnerships/aircall-partner': 'Aircall FAQs',
  'partnerships/certified-atlassian-partner': 'Atlassian FAQs',
  'partnerships/make-partners': 'make.com FAQs',
  'ai-strategy-and-execution': 'AI FAQs',
  'monday-for-construction': 'Construction',
  'monday-for-manufacturing': 'Manufacturing',
  'monday-for-retail': 'Retail',
  'monday-for-professional-services': 'Professional Services',
  'monday-for-government': 'Public Sector',
  'monday-for-marketing': 'Marketing & Creative',
  'monday-for-real-estate': 'Real Estate',
  'monday-training': 'Training',
}

/**
 * Score a (tabPath, pageKey) pair for how "specific" its category
 * assignment is. Higher is better. Used when the same question is
 * captured under multiple tab paths to pick the most informative one.
 *
 *   +3  (default) capture on a dedicated-topic page — trust the page
 *   +2  tabPath ends at a canonical FAQ category (deepest tab match)
 *   +1  tabPath has any canonical FAQ category at any depth
 *    0  no canonical match and no dedicated page — fall back only
 */
function categoryConfidence(tabPath: string[], pageKey: string): number {
  if (
    tabPath.length === 1 &&
    tabPath[0] === '(default)' &&
    DEDICATED_PAGE_CATEGORIES[pageKey]
  ) {
    return 3
  }
  if (tabPath.length === 0 || tabPath[0] === '(default)') return 0
  for (let i = tabPath.length - 1; i >= 0; i--) {
    if (normalizedCanonical.has(normalizeLabel(tabPath[i]))) {
      return i === tabPath.length - 1 ? 2 : 1
    }
  }
  return 0
}

function mergeRecords(pages: ScrapedPage[]): MergedFaq[] {
  const merged = new Map<string, MergedFaq & { confidence: number }>()
  let idx = 0
  for (const page of pages) {
    const pageKey = SLUG_TO_PAGE_KEY[page.slug]
    if (!pageKey) continue
    for (const rec of page.records ?? []) {
      const q = rec.question.trim()
      if (!q || q.length < 5) continue
      const key = questionKey(q)
      const dedicated = DEDICATED_PAGE_CATEGORIES[pageKey]
      const category =
        dedicated && (rec.tabPath.length === 0 || rec.tabPath[0] === '(default)')
          ? dedicated
          : pickCategoryFromTabPath(rec.tabPath, pageKey)
      const confidence = categoryConfidence(rec.tabPath, pageKey)
      if (merged.has(key)) {
        const existing = merged.get(key)!
        existing.pages.add(pageKey)
        // Only adopt the new category when it's more confident than
        // what we already picked. Stops the first (default) capture
        // from locking in a fallback label.
        if (confidence > existing.confidence) {
          existing.category = category
          existing.confidence = confidence
        }
        // Keep the longest answer (most complete).
        if (rec.answer.length > existing.answer.length) existing.answer = rec.answer
      } else {
        merged.set(key, {
          question: q,
          answer: rec.answer,
          category,
          pages: new Set([pageKey, 'faqs']),
          firstSeenIndex: idx++,
          confidence,
        })
      }
    }
  }
  return Array.from(merged.values()).map(({ confidence: _c, ...rest }) => rest)
}

async function main() {
  console.log(`Loading ${SRC_PATH}…`)
  const pages = loadSource()
  const totals = pages.map((p) => `${p.slug}=${p.records?.length ?? 0}`).join(', ')
  console.log(`Source summary: ${totals}`)

  const items = mergeRecords(pages)
  console.log(`Deduped into ${items.length} unique FAQ items.`)

  const byCategory = new Map<string, MergedFaq[]>()
  for (const item of items) {
    if (!byCategory.has(item.category)) byCategory.set(item.category, [])
    byCategory.get(item.category)!.push(item)
  }
  for (const [cat, group] of byCategory) {
    console.log(`  [${cat}] ${group.length} items`)
  }

  if (DRY_RUN) {
    console.log('\n--dry-run: not writing to Sanity.')
    // Dump a preview to /tmp for inspection.
    fs.writeFileSync(
      '/tmp/faq-seed-preview.json',
      JSON.stringify(
        items.map((i) => ({
          question: i.question,
          category: i.category,
          pages: Array.from(i.pages),
          answerPreview: i.answer.slice(0, 120),
        })),
        null,
        2,
      ),
    )
    console.log('Preview saved to /tmp/faq-seed-preview.json')
    return
  }

  // Assign per-category order based on first-seen index.
  items.sort((a, b) => a.firstSeenIndex - b.firstSeenIndex)
  const categoryOrder = new Map<string, number>()
  for (const item of items) {
    const next = (categoryOrder.get(item.category) ?? 0) + 1
    categoryOrder.set(item.category, next)
    ;(item as unknown as { order: number }).order = next
  }

  console.log(`\nWriting ${items.length} faqItem documents…`)
  let written = 0
  for (const item of items) {
    const doc = {
      _id: faqId(item.question),
      _type: 'faqItem' as const,
      question: item.question,
      answer: textToPortableText(item.answer),
      category: item.category,
      categoryOrder: categoryOrderByLabel.get(item.category) ?? 99,
      order: (item as unknown as { order: number }).order,
      pages: Array.from(item.pages).sort(),
    }
    await writeClient.createOrReplace(doc)
    written++
    if (written % 25 === 0) console.log(`  …${written}/${items.length}`)
  }

  const count = await writeClient.fetch('count(*[_type == "faqItem"])')
  console.log(`\nDone. Wrote ${written}. faqItem count in Sanity: ${count}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
