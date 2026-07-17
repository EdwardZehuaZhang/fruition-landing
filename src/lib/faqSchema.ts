import type { PortableTextBlock } from "@portabletext/react"

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

/**
 * Build FAQPage JSON-LD for rich snippets / "People Also Ask". Drops blanks and
 * dedupes by question. Rendered server-side so crawlers index it.
 */
export function generateFaqJsonLd(items: FaqSchemaItem[]) {
  const seenQ = new Set<string>()
  const mainEntity = items
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

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  }
}
