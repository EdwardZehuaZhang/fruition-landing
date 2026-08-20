import type { PortableTextBlock } from "@portabletext/react"
import type { FaqTab } from "@/components/sections/types"

/** Convert PortableText blocks to a flat plain-text string. */
export function answerToPlainText(answer: PortableTextBlock[] | undefined): string {
  if (!Array.isArray(answer)) return ""
  return answer
    .map((block) => {
      if (block?._type !== "block" || !Array.isArray((block as { children?: unknown }).children)) return ""
      const children = (block as { children: Array<{ text?: string }> }).children
      return children.map((c) => c.text ?? "").join(" ")
    })
    .join(" ")
}

interface FaqSchemaItem {
  _id: string
  question: string
  answer: PortableTextBlock[]
}

/** A question/answer pair already flattened to plain text. */
export interface FaqTextPair {
  question?: string
  answer?: string
}

/**
 * Build FAQPage JSON-LD from plain-text pairs. Drops blanks and dedupes by
 * question. Both FAQ sources funnel through here so the markup is identical
 * whichever one a page renders.
 */
export function generateFaqJsonLdFromPairs(pairs: FaqTextPair[]) {
  const seenQ = new Set<string>()
  const mainEntity = pairs
    .map((it) => ({
      // Trim first: a question stored as "  ## Foo" would otherwise keep its
      // hashes, since /^#+/ cannot match past the leading whitespace.
      question: it.question?.trim().replace(/^#+\s*/, "").trim(),
      answer: it.answer?.trim(),
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

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  }
}

/**
 * Flatten the `faqTabs` array curated on a page document into schema pairs.
 * Those answers are already plain strings, unlike central `faqItem` docs.
 */
export function faqTabsToPairs(tabs: FaqTab[] | undefined | null): FaqTextPair[] {
  return (tabs ?? []).flatMap((tab) =>
    (tab?.items ?? []).map((item) => ({ question: item?.question, answer: item?.answer })),
  )
}

/**
 * Build FAQPage JSON-LD for rich snippets / "People Also Ask". Drops blanks and
 * dedupes by question. Rendered server-side so crawlers index it.
 */
export function generateFaqJsonLd(items: FaqSchemaItem[]) {
  return generateFaqJsonLdFromPairs(
    items.map((it) => ({ question: it.question, answer: answerToPlainText(it.answer) })),
  )
}
