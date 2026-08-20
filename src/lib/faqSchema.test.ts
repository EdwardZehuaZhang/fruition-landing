/**
 * Unit tests for FAQ schema generation utilities.
 */
import { describe, expect, it } from "vitest"
import type { PortableTextBlock } from "@portabletext/types"
import {
  generateFaqJsonLd,
  generateFaqJsonLdFromPairs,
  faqTabsToPairs,
  answerToPlainText,
} from "@/lib/faqSchema"

/** Helper: build a minimal Portable Text span. */
function span(text: string) {
  return { _type: "span" as const, _key: Math.random().toString(36).slice(2), text }
}

/** Helper: build a minimal Portable Text block. */
function block(children: ReturnType<typeof span>[]) {
  return {
    _type: "block" as const,
    _key: Math.random().toString(36).slice(2),
    style: "normal" as const,
    markDefs: [] as Array<{ _type: string; _key: string }>,
    children,
  }
}

describe("answerToPlainText", () => {
  it("returns an empty string for undefined input", () => {
    expect(answerToPlainText(undefined as unknown as PortableTextBlock[])).toBe("")
  })

  it("returns an empty string for an empty array", () => {
    expect(answerToPlainText([])).toBe("")
  })

  it("returns an empty string for non-array input", () => {
    expect(answerToPlainText(null as unknown as PortableTextBlock[])).toBe("")
  })

  it("flattens Portable Text blocks into a single string", () => {
    const blocks = [block([span("Hello"), span("world")])]
    expect(answerToPlainText(blocks)).toBe("Hello world")
  })

  it("joins multiple blocks with spaces", () => {
    const blocks = [block([span("First block")]), block([span("Second block")])]
    expect(answerToPlainText(blocks)).toBe("First block Second block")
  })

  it("skips non-block types", () => {
    const blocks = [
      block([span("Visible")]),
      { _type: "image", _key: "img1" } as PortableTextBlock,
      block([span("Also visible")]),
    ]
    // Non-block types return empty string which gets space-joined
    expect(answerToPlainText(blocks)).toBe("Visible  Also visible")
  })

  it("handles blocks with undefined text properties", () => {
    const blocks: PortableTextBlock[] = [{
      _type: "block",
      _key: "b1",
      style: "normal",
      markDefs: [],
      children: [
        { _type: "span", _key: "s1" },
        span("hello"),
      ],
    }]
    expect(answerToPlainText(blocks)).toBe(" hello")
  })

  it("returns single space when all blocks are non-block types", () => {
    const blocks = [
      { _type: "image", _key: "img1" } as PortableTextBlock,
      { _type: "video", _key: "vid1" } as PortableTextBlock,
    ]
    // Both blocks return empty string, joined with space = single space
    expect(answerToPlainText(blocks)).toBe(" ")
  })
})

describe("generateFaqJsonLd", () => {
  it("returns FAQPage schema with empty mainEntity for empty items", () => {
    const result = generateFaqJsonLd([])
    expect(result["@context"]).toBe("https://schema.org")
    expect(result["@type"]).toBe("FAQPage")
    expect(result.mainEntity).toEqual([])
  })

  it("generates valid FAQPage JSON-LD for a single FAQ", () => {
    const items = [
      {
        _id: "1",
        question: "What is Fruition?",
        answer: [block([span("Fruition is a consulting firm.")])],
      },
    ]
    const result = generateFaqJsonLd(items)
    expect(result["@context"]).toBe("https://schema.org")
    expect(result["@type"]).toBe("FAQPage")
    expect(result.mainEntity).toHaveLength(1)
    expect(result.mainEntity[0]).toEqual({
      "@type": "Question",
      name: "What is Fruition?",
      acceptedAnswer: { "@type": "Answer", text: "Fruition is a consulting firm." },
    })
  })

  it("generates JSON-LD for multiple FAQs", () => {
    const items = [
      { _id: "1", question: "Q1?", answer: [block([span("A1")])] },
      { _id: "2", question: "Q2?", answer: [block([span("A2")])] },
    ]
    const result = generateFaqJsonLd(items)
    expect(result.mainEntity).toHaveLength(2)
    expect(result.mainEntity[0].name).toBe("Q1?")
    expect(result.mainEntity[1].name).toBe("Q2?")
  })

  it("filters out items with empty questions", () => {
    const items = [
      { _id: "1", question: "", answer: [block([span("Answer")])] },
      { _id: "2", question: "Valid question?", answer: [block([span("Valid answer")])] },
    ]
    const result = generateFaqJsonLd(items)
    expect(result.mainEntity).toHaveLength(1)
    expect(result.mainEntity[0].name).toBe("Valid question?")
  })

  it("filters out items with empty answers", () => {
    const items = [
      { _id: "1", question: "Question with empty answer?", answer: [] as PortableTextBlock[] },
      { _id: "2", question: "Valid question?", answer: [block([span("Valid answer")])] },
    ]
    const result = generateFaqJsonLd(items)
    expect(result.mainEntity).toHaveLength(1)
    expect(result.mainEntity[0].name).toBe("Valid question?")
  })

  it("deduplicates by question text", () => {
    const items = [
      { _id: "1", question: "Duplicate?", answer: [block([span("First")])] },
      { _id: "2", question: "Duplicate?", answer: [block([span("Second")])] },
      { _id: "3", question: "Unique?", answer: [block([span("Unique answer")])] },
    ]
    const result = generateFaqJsonLd(items)
    expect(result.mainEntity).toHaveLength(2)
    // First occurrence of "Duplicate?" is kept
    expect(result.mainEntity[0].name).toBe("Duplicate?")
    expect(result.mainEntity[1].name).toBe("Unique?")
  })

  it("strips markdown heading markers from questions", () => {
    const items = [
      { _id: "1", question: "## What is this?", answer: [block([span("Answer")])] },
      { _id: "2", question: "# Top level heading", answer: [block([span("Answer 2")])] },
    ]
    const result = generateFaqJsonLd(items)
    expect(result.mainEntity[0].name).toBe("What is this?")
    expect(result.mainEntity[1].name).toBe("Top level heading")
  })

  it("filters out whitespace-only questions after trimming", () => {
    const items = [
      { _id: "1", question: "   ", answer: [block([span("Answer")])] },
      { _id: "2", question: "Real question?", answer: [block([span("Real answer")])] },
    ]
    const result = generateFaqJsonLd(items)
    expect(result.mainEntity).toHaveLength(1)
  })
})

describe("faqTabsToPairs", () => {
  it("flattens every tab's items into a single pair list, in order", () => {
    const pairs = faqTabsToPairs([
      { _key: "t0", label: "Real estate", items: [
        { _key: "a", question: "What is monday.com for real estate?", answer: "A work management platform." },
        { _key: "b", question: "Is it good for brokers?", answer: "Yes." },
      ] },
      { _key: "t1", label: "Pricing", items: [
        { _key: "c", question: "How much?", answer: "It depends on seats." },
      ] },
    ])
    expect(pairs.map((p) => p.question)).toEqual([
      "What is monday.com for real estate?",
      "Is it good for brokers?",
      "How much?",
    ])
  })

  it("returns an empty list for undefined, empty, or item-less tabs", () => {
    expect(faqTabsToPairs(undefined)).toEqual([])
    expect(faqTabsToPairs(null)).toEqual([])
    expect(faqTabsToPairs([])).toEqual([])
    expect(faqTabsToPairs([{ _key: "t0", label: "Empty" }])).toEqual([])
  })
})

describe("generateFaqJsonLdFromPairs", () => {
  it("builds FAQPage markup from plain-text pairs", () => {
    const out = generateFaqJsonLdFromPairs([
      { question: "What is monday.com for real estate?", answer: "A work management platform." },
    ])
    expect(out["@type"]).toBe("FAQPage")
    expect(out.mainEntity).toHaveLength(1)
    expect(out.mainEntity[0]).toEqual({
      "@type": "Question",
      name: "What is monday.com for real estate?",
      acceptedAnswer: { "@type": "Answer", text: "A work management platform." },
    })
  })

  it("drops blanks, trims, strips leading markdown hashes and dedupes by question", () => {
    const out = generateFaqJsonLdFromPairs([
      { question: "  ## Does it integrate?  ", answer: "  Yes.  " },
      { question: "Does it integrate?", answer: "Duplicate — dropped." },
      { question: "No answer", answer: "   " },
      { question: "", answer: "No question" },
      { question: "Another", answer: undefined },
    ])
    expect(out.mainEntity).toHaveLength(1)
    expect(out.mainEntity[0].name).toBe("Does it integrate?")
    expect(out.mainEntity[0].acceptedAnswer.text).toBe("Yes.")
  })

  it("returns empty mainEntity when given nothing usable", () => {
    expect(generateFaqJsonLdFromPairs([]).mainEntity).toEqual([])
  })

  it("agrees with generateFaqJsonLd for equivalent content", () => {
    const fromBlocks = generateFaqJsonLd([
      {
        _id: "x",
        question: "Does it integrate?",
        answer: [
          { _type: "block", children: [{ text: "Yes." }] },
        ] as unknown as PortableTextBlock[],
      },
    ])
    const fromPairs = generateFaqJsonLdFromPairs([{ question: "Does it integrate?", answer: "Yes." }])
    expect(fromBlocks).toEqual(fromPairs)
  })
})
