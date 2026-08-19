import type { PortableTextBlock } from "@portabletext/types"
import type { FaqTab } from "@/components/sections/types"

export interface CentralFaqItem {
  _id: string
  question: string
  answer: PortableTextBlock[]
  category?: string
  categoryOrder?: number
  order?: number
}

/**
 * Preferred tab display order. Categories listed here appear first (in
 * this order); any categories not listed fall back to their Sanity
 * `categoryOrder` value and appear after the preferred ones.
 */
const PREFERRED_TAB_ORDER = [
  'Professional Services',
  'monday Work Management',
  'monday CRM',
  'Expert Consultant Guide',
  'General Questions',
]

/**
 * Group central faqItem documents into the `FaqTab[]` shape that
 * `FaqAccordion` expects.
 *
 * The accordion renders plain-text answers — block text is flattened
 * here with paragraph breaks so existing markup keeps working without
 * upgrading the accordion to full Portable Text.
 */
export function groupFaqsIntoTabs(
  items: CentralFaqItem[],
  /** Category to surface as the very first tab (case-insensitive). Use for
   * industry/solution pages where the page-specific category should lead. */
  preferredFirstCategory?: string,
): FaqTab[] {
  if (!items?.length) return []

  const byCategory = new Map<string, { order: number; items: CentralFaqItem[] }>()
  for (const item of items) {
    const category = item.category || "General Questions"
    if (!byCategory.has(category)) {
      byCategory.set(category, {
        order: item.categoryOrder ?? 99,
        items: [],
      })
    }
    byCategory.get(category)!.items.push(item)
  }

  const firstLc = preferredFirstCategory?.toLowerCase()

  return Array.from(byCategory.entries())
    .sort(([labelA, a], [labelB, b]) => {
      if (firstLc) {
        const aFirst = labelA.toLowerCase() === firstLc
        const bFirst = labelB.toLowerCase() === firstLc
        if (aFirst && !bFirst) return -1
        if (bFirst && !aFirst) return 1
      }
      const idxA = PREFERRED_TAB_ORDER.indexOf(labelA)
      const idxB = PREFERRED_TAB_ORDER.indexOf(labelB)
      // Both in preferred list → use preferred order
      if (idxA !== -1 && idxB !== -1) return idxA - idxB
      // Only one in preferred list → it comes first
      if (idxA !== -1) return -1
      if (idxB !== -1) return 1
      // Neither in preferred list → fall back to categoryOrder
      return a.order - b.order
    })
    .map(([label, group], tabIdx) => ({
      _key: `tab-${tabIdx}-${label.replace(/\s+/g, "-").toLowerCase()}`,
      label,
      items: group.items
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((item) => ({
          _key: item._id,
          question: item.question,
          answer: portableTextToPlain(item.answer),
        })),
    }))
}

function portableTextToPlain(blocks: PortableTextBlock[] | undefined): string {
  if (!Array.isArray(blocks)) return ""
  return blocks
    .map((block) => {
      if (block._type !== "block") return ""
      const children = (block as { children?: Array<{ text?: string }> }).children ?? []
      return children.map((c) => c.text ?? "").join("")
    })
    .filter(Boolean)
    .join("\n\n")
}

/**
 * Pages whose lead FAQ category can't be read off the route slug: the category
 * is named differently from the page (a government page leads with "Public
 * Sector"), or the page's subject is a product rather than an industry.
 * Everything else resolves through the slug match in `leadFaqCategoryForPage`.
 * A list means "first of these that the page actually has".
 */
const FAQ_LEAD_CATEGORY_BY_PAGE: Record<string, string | string[]> = {
  'about-us': 'General Questions',
  'ai-consulting/governance-and-compliance': 'Governance & Compliance',
  'ai-consulting/marketing-automation': 'Agentic Marketing FAQs',
  'ai-consulting/sales-outbound': 'Agentic Sales FAQs',
  'ai-strategy-and-execution': 'AI FAQs',
  'careers': 'General Questions',
  'monday-consulting-solutions/monday-for-cabinetry-renovation': 'Construction',
  'monday-consulting-solutions/monday-for-finance': 'Finance & Accounting',
  'monday-consulting-solutions/monday-for-hr': 'HR',
  'monday-consulting-solutions/monday-product-management': 'monday Dev',
  'monday-consulting-solutions/solar-crm-solution': ['Solar & Renewables', 'monday CRM'],
  'monday-crm-consulting': 'monday CRM',
  'monday-for-finance': 'Finance & Accounting',
  'monday-for-government': 'Public Sector',
  'monday-for-marketing': 'Marketing & Creative',
  'monday-implementation-consultants': 'Implementation Partner',
  'monday-products/ai': 'monday AI',
  'monday-products/crm': 'monday CRM',
  'monday-products/dev': 'monday Dev',
  'monday-products/service': 'monday Service',
  'monday-products/work-management': 'Work Management',
  'partnerships/aircall-partner': 'Aircall FAQs',
  'partnerships/certified-atlassian-partner': 'Atlassian FAQs',
  'partnerships/certified-clickup-partner': 'ClickUp FAQs',
  'partnerships/certified-hubspot-partner': 'HubSpot FAQs',
  'partnerships/monday-consulting-partner': 'Implementation Partner',
  'partnerships/n8n-integration-partner': 'n8n FAQs',
}

/** "Marketing & Creative" -> "marketing-creative", "n8n" -> "n8n". */
function slugifyCategory(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * The FAQ category a page should lead with, so a manufacturing page opens on
 * the Manufacturing tab rather than whichever category sorts first globally.
 *
 * The explicit map wins; otherwise the page key is matched against the
 * categories present in `items` — a route like `monday-for-manufacturing` or
 * `ai-consulting/n8n` names its own category once the `monday-for-`/`monday-`
 * prefix is dropped. No match leaves the default ordering untouched.
 */
export function leadFaqCategoryForPage(
  pageKey: string | undefined,
  items: CentralFaqItem[] | undefined,
): string | undefined {
  if (!pageKey || !items?.length) return undefined
  const present = new Set(items.map((item) => item.category).filter(Boolean) as string[])

  // Listed categories are tried in order: a page can name its ideal lead plus a
  // broader stand-in for when it falls back to the curated /faqs set.
  const mapped = FAQ_LEAD_CATEGORY_BY_PAGE[pageKey]
  if (mapped) {
    const match = (Array.isArray(mapped) ? mapped : [mapped]).find((c) => present.has(c))
    if (match) return match
  }

  const lastSegment = pageKey.split('/').pop() ?? pageKey
  const candidates = new Set([
    pageKey,
    lastSegment,
    lastSegment.replace(/^monday-for-/, ''),
    lastSegment.replace(/^monday-/, ''),
  ])
  return items.find((item) => item.category && candidates.has(slugifyCategory(item.category)))
    ?.category
}

/**
 * `groupFaqsIntoTabs` with the page's own category promoted to the first tab.
 * Prefer this over calling `groupFaqsIntoTabs` directly from a page: the
 * accordion opens on tab 0, so the lead tab is what visitors actually read.
 */
export function groupFaqsForPage(
  items: CentralFaqItem[],
  pageKey: string | undefined,
): FaqTab[] {
  return groupFaqsIntoTabs(items, leadFaqCategoryForPage(pageKey, items))
}
