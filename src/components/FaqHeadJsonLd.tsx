import type { PortableTextBlock } from "@portabletext/types"
import { headers } from "next/headers"
import { getFaqItemsForPage, getPageFaqTabsBySlug } from "@/sanity/queries"
import {
  answerToPlainText,
  faqTabsToPairs,
  generateFaqJsonLdFromPairs,
  type FaqTextPair,
} from "@/lib/faqSchema"
import type { FaqTab } from "@/components/sections/types"

/**
 * FaqHeadJsonLd — server component that auto-generates FAQPage JSON-LD for the
 * current route. Placed in the root layout <head> so crawlers index the markup
 * before body content.
 *
 * Uses the `x-pathname` header set by middleware.ts to determine the page key.
 * Falls back gracefully when no FAQ content exists or the header is absent.
 *
 * Source precedence mirrors resolveFaqTabs exactly: the page document's own
 * `faqTabs` win, the central `faqItem` collection is only the fallback. That
 * matters because getFaqItemsForPage falls back to the curated /faqs set for
 * pages with no tagged items, so building the markup from the central list
 * alone advertised generic CRM questions on pages that render nothing of the
 * sort — structured data that contradicts the page it describes.
 */
export default async function FaqHeadJsonLd() {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || "/"

  // Derive page key: strip leading "/" and any trailing slash
  const pageKey = pathname === "/"
    ? "home"
    : pathname.replace(/^\/+/, "").replace(/\/+$/, "")

  if (!pageKey || pageKey === "home") {
    // Homepage doesn't have tagged FAQ items
    return null
  }

  let pairs: FaqTextPair[]
  try {
    const curated = (await getPageFaqTabsBySlug(pageKey)) as FaqTab[] | null
    const curatedPairs = faqTabsToPairs(curated)

    if (curatedPairs.length > 0) {
      pairs = curatedPairs
    } else {
      const faqItems = (await getFaqItemsForPage(pageKey)) as Array<{
        _id: string
        question: string
        answer: PortableTextBlock[]
      }> | null
      if (!faqItems?.length) return null
      pairs = faqItems.map((it) => ({
        question: it.question,
        answer: answerToPlainText(it.answer),
      }))
    }
  } catch {
    return null
  }

  const faqJsonLd = generateFaqJsonLdFromPairs(pairs)
  if (faqJsonLd.mainEntity.length === 0) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
    />
  )
}
