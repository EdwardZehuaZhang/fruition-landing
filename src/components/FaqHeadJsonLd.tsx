import type { PortableTextBlock } from "@portabletext/types"
import { headers } from "next/headers"
import { getFaqItemsForPage } from "@/sanity/queries"
import { answerToPlainText } from "@/lib/faqSchema"

/**
 * FaqHeadJsonLd — server component that auto-generates FAQPage JSON-LD for the
 * current route when Sanity faqItem documents are tagged for it. Placed in the
 * root layout <head> so crawlers index the markup before body content.
 *
 * Uses the `x-pathname` header set by middleware.ts to determine the page key.
 * Falls back gracefully when no FAQ items exist or the header is absent.
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

  let faqItems: Array<{ _id: string; question: string; answer: PortableTextBlock[] }> | null
  try {
    faqItems = await getFaqItemsForPage(pageKey) as Array<{ _id: string; question: string; answer: PortableTextBlock[] }> | null
  } catch {
    return null
  }

  if (!faqItems?.length) return null

  // Generate FAQPage JSON-LD — dedupe by question, skip blanks
  const seenQ = new Set<string>()
  const mainEntity = faqItems
    .map((it) => ({
      question: it.question?.replace(/^#+\s*/, "").trim(),
      answer: answerToPlainText(it.answer).trim(),
    }))
    .filter((it) => {
      if (!it.question || !it.answer) return false
      if (seenQ.has(it.question)) return false
      seenQ.add(it.question)
      return true
    })
    .map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    }))

  if (mainEntity.length === 0) return null

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
    />
  )
}
