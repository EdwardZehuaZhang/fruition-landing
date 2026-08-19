/**
 * Tests for the shared inline-markdown tokenizer.
 *
 * The bug that motivated it: Sanity stores blog table cells as plain strings,
 * so a cell the editor showed as bold was published as the literal text
 * `**Use case**` and the live post rendered the asterisks. The renderer now
 * parses cells with parseInlineMarkdown.
 *
 * The second half of this file pins bodyToPortableText's inline output. That
 * function used to carry its own copy of this parser and now delegates to it,
 * so these cases exist to prove the publish path still emits byte-identical
 * spans and markDefs — including the rough edges (see "quirks" below), which
 * are locked in deliberately: table cells have to render the same way the same
 * text renders in a paragraph, warts and all.
 */
import { describe, expect, it } from "vitest"
import { parseInlineMarkdown } from "@/lib/inlineMarkdown"
import { bodyToPortableText } from "@/lib/sanityWriteClient"

/** Spans of the first block, as [text, marks] — markDefs keys are random. */
function spans(markdown: string): [string, string[]][] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const block = (bodyToPortableText(markdown) as any[])[0]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (block?.children ?? []).map((s: any) => [s.text, s.marks])
}

/** Spans with link mark keys replaced by the href they point at. */
function spansWithHrefs(markdown: string): [string, string[]][] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const block = (bodyToPortableText(markdown) as any[])[0]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defs: any[] = block?.markDefs ?? []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (block?.children ?? []).map((s: any) => [
    s.text,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (s.marks ?? []).map((m: string) => defs.find((d: any) => d._key === m)?.href ?? m),
  ])
}

describe("parseInlineMarkdown", () => {
  it("returns nothing for an empty string", () => {
    expect(parseInlineMarkdown("")).toEqual([])
  })

  it("returns a single unstyled run for plain text", () => {
    expect(parseInlineMarkdown("plain text")).toEqual([{ text: "plain text" }])
  })

  it("parses both bold spellings", () => {
    expect(parseInlineMarkdown("**bold**")).toEqual([{ text: "bold", strong: true }])
    expect(parseInlineMarkdown("__bold__")).toEqual([{ text: "bold", strong: true }])
  })

  it("parses both italic spellings", () => {
    expect(parseInlineMarkdown("*it*")).toEqual([{ text: "it", em: true }])
    expect(parseInlineMarkdown("_it_")).toEqual([{ text: "it", em: true }])
  })

  it("nests italic inside bold", () => {
    expect(parseInlineMarkdown("**bold with *italic* inside**")).toEqual([
      { text: "bold with ", strong: true },
      { text: "italic", strong: true, em: true },
      { text: " inside", strong: true },
    ])
  })

  it("keeps the text between marks", () => {
    expect(parseInlineMarkdown("a **b** c *d* e")).toEqual([
      { text: "a " },
      { text: "b", strong: true },
      { text: " c " },
      { text: "d", em: true },
      { text: " e" },
    ])
  })

  it("extracts links, keeping the surrounding text", () => {
    // The Systems column of a real post: "JSM, [monday.com](...), Slack".
    expect(parseInlineMarkdown("JSM, [monday.com](http://monday.com), Slack")).toEqual([
      { text: "JSM, " },
      { text: "monday.com", href: "http://monday.com" },
      { text: ", Slack" },
    ])
  })

  it("handles a bold run and a link in the same cell", () => {
    expect(parseInlineMarkdown("**Tier** — see [docs](https://x.com)")).toEqual([
      { text: "Tier", strong: true },
      { text: " — see " },
      { text: "docs", href: "https://x.com" },
    ])
  })

  it("leaves an unmatched delimiter as literal text", () => {
    // Real authored content: a stray `**` must not eat the rest of the cell.
    expect(parseInlineMarkdown("Assigned a Jira** g, the agent reproduces it")).toEqual([
      { text: "Assigned a Jira** g, the agent reproduces it" },
    ])
    expect(parseInlineMarkdown("trailing **")).toEqual([{ text: "trailing **" }])
  })

  it("does not emit empty runs", () => {
    for (const run of parseInlineMarkdown("**a** *b* [c](https://d.com)")) {
      expect(run.text).not.toBe("")
    }
  })

  /* Quirks — inherited from the paragraph parser, asserted so a future change
   * to either one is a deliberate, visible decision rather than a silent
   * divergence between table cells and body text. */
  describe("quirks shared with paragraph text", () => {
    it("does not scan link text for marks", () => {
      expect(parseInlineMarkdown("[**bold link**](https://x.com)")).toEqual([
        { text: "**bold link**", href: "https://x.com" },
      ])
    })

    it("does not let a bold run span a link", () => {
      expect(parseInlineMarkdown("**bold [link](https://x.com) more**")).toEqual([
        { text: "**bold " },
        { text: "link", href: "https://x.com" },
        { text: " more**" },
      ])
    })

    it("treats underscores inside a word as italic", () => {
      expect(parseInlineMarkdown("snake_case_name here")).toEqual([
        { text: "snake" },
        { text: "case", em: true },
        { text: "name here" },
      ])
    })
  })
})

describe("bodyToPortableText inline marks (unchanged by the shared parser)", () => {
  it("emits one strong span for bold", () => {
    expect(spans("**bold**")).toEqual([["bold", ["strong"]]])
    expect(spans("__bold__")).toEqual([["bold", ["strong"]]])
  })

  it("emits em nested inside strong in that mark order", () => {
    expect(spans("**bold with *italic* inside**")).toEqual([
      ["bold with ", ["strong"]],
      ["italic", ["strong", "em"]],
      [" inside", ["strong"]],
    ])
  })

  it("splits mixed inline marks", () => {
    expect(spans("a **b** c *d* e")).toEqual([
      ["a ", []],
      ["b", ["strong"]],
      [" c ", []],
      ["d", ["em"]],
      [" e", []],
    ])
  })

  it("points a link span at a link markDef", () => {
    expect(spansWithHrefs("see [monday.com](http://monday.com) now")).toEqual([
      ["see ", []],
      ["monday.com", ["http://monday.com"]],
      [" now", []],
    ])
  })

  it("gives every link its own markDef", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const block = (bodyToPortableText("[a](https://a.com) and [b](https://b.com)") as any[])[0]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const defs: any[] = block.markDefs
    expect(defs).toHaveLength(2)
    expect(defs.map((d) => d.href)).toEqual(["https://a.com", "https://b.com"])
    expect(defs.every((d) => d._type === "link")).toBe(true)
    expect(new Set(defs.map((d) => d._key)).size).toBe(2)
  })

  it("keeps unmatched delimiters literal", () => {
    expect(spans("Assigned a Jira** g")).toEqual([["Assigned a Jira** g", []]])
  })

  it("emits a block with children for a line that is nothing but a link", () => {
    // Portable Text requires at least one child span on every block.
    expect(spansWithHrefs("[link](https://example.com)")).toEqual([
      ["link", ["https://example.com"]],
    ])
  })

  it("still parses inline marks inside table cells", () => {
    const md = ["| **#** | **Use case** |", "| --- | --- |", "| **1** | Ticket triage |"].join("\n")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = (bodyToPortableText(md) as any[])[0]
    // Cells stay raw strings in Sanity — the renderer is what parses them.
    expect(table._type).toBe("table")
    expect(table.rows[0].cells).toEqual(["**#**", "**Use case**"])
    expect(parseInlineMarkdown(table.rows[0].cells[1])).toEqual([
      { text: "Use case", strong: true },
    ])
  })
})
