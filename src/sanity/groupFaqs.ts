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
export function groupFaqsIntoTabs(items: CentralFaqItem[]): FaqTab[] {
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

  return Array.from(byCategory.entries())
    .sort(([labelA, a], [labelB, b]) => {
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
