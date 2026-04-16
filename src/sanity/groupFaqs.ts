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
 * Group central faqItem documents into the `FaqTab[]` shape that
 * `FaqAccordion` expects. Preserves the curated category order set by
 * the seed script (see scripts/sanity-migrate/seed-faqs.ts).
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
    .sort(([, a], [, b]) => a.order - b.order)
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
