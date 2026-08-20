/**
 * Regression tests for the internal blog editor's markdown round trip.
 *
 * The portal stores drafts as markdown (portal_drafts.body_markdown), so the
 * save → reload path is exactly:
 *
 *   editor doc -> markdown.getMarkdown()  (what POST /api/internal/blog/draft stores)
 *              -> setContent(markdown)    (what the edit page does on refresh)
 *
 * These tests drive a real headless Tiptap editor built from the same
 * `blogEditorExtensions()` the portal UI uses, so they cover the actual
 * serialiser rather than a stand-in helper.
 *
 * Bugs they lock down:
 *
 * - tiptap-markdown's built-in GFM table serialiser bailed to an HTML fallback
 *   for any table that wasn't "simple" (no header row, a cell with more than
 *   one block, merged cells). With `html: false` that fallback wrote the
 *   literal placeholder `[table]`, so the table — and any image inside it —
 *   was destroyed on save.
 * - Video nodes serialised to a bare URL but had no parse side, so a reload
 *   turned them into autolinked paragraphs and the *second* save wrote the
 *   `<url>` autolink form, which the publish pipeline no longer recognises as
 *   a video. Anything asserting round-trip stability therefore runs more than
 *   one cycle (see `saveCycles`).
 */
import { beforeAll, afterEach, describe, expect, it } from "vitest"
import { Editor } from "@tiptap/core"
import type { JSONContent } from "@tiptap/core"
import { blogEditorExtensions } from "@/lib/blogEditorExtensions"
import { bodyToPortableText } from "@/lib/sanityWriteClient"

beforeAll(() => {
  // Tiptap's focus command uses rAF; jsdom in this config doesn't provide it.
  globalThis.requestAnimationFrame ??= ((cb: FrameRequestCallback) =>
    setTimeout(() => cb(0), 0) as unknown as number) as typeof requestAnimationFrame
  globalThis.cancelAnimationFrame ??= ((id: number) =>
    clearTimeout(id)) as typeof cancelAnimationFrame
})

let editor: Editor | null = null

function makeEditor(content: JSONContent | string): Editor {
  editor = new Editor({ extensions: blogEditorExtensions(), content })
  return editor
}

afterEach(() => {
  editor?.destroy()
  editor = null
})

/** The markdown the draft API would persist for this doc. */
function save(content: JSONContent | string): string {
  const e = makeEditor(content)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (e.storage as any).markdown.getMarkdown() as string
}

/** Save, then reload that markdown the way the edit page does on refresh. */
function saveReloadSave(content: JSONContent | string): {
  saved: string
  reloaded: string
  doc: JSONContent
} {
  const saved = save(content)
  const e = makeEditor(saved)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reloaded = (e.storage as any).markdown.getMarkdown() as string
  return { saved, reloaded, doc: e.getJSON() }
}

/**
 * Markdown after each of `cycles` successive save → reload passes, plus the doc
 * the last reload produced.
 *
 * `saves[0]` is the first save; `saves[1]` is the save after one reload, and so
 * on. Some drift only shows up from `saves[1]` onward — the editor round-trips
 * a node correctly once and then degrades what it parsed back — so anything
 * claiming to be stable has to be checked over more than one cycle.
 */
function saveCycles(
  content: JSONContent | string,
  cycles: number,
): { saves: string[]; doc: JSONContent } {
  const saves = [save(content)]
  let e = makeEditor(saves[0])
  while (saves.length < cycles) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const next = (e.storage as any).markdown.getMarkdown() as string
    saves.push(next)
    e = makeEditor(next)
  }
  return { saves, doc: e.getJSON() }
}

/* ----------------------------- doc builders ----------------------------- */

const para = (text: string): JSONContent => ({
  type: "paragraph",
  content: [{ type: "text", text }],
})
const hdr = (text: string): JSONContent => ({ type: "tableHeader", content: [para(text)] })
const cell = (...blocks: JSONContent[]): JSONContent => ({ type: "tableCell", content: blocks })
const txtCell = (text: string): JSONContent => cell(para(text))
const row = (...cells: JSONContent[]): JSONContent => ({ type: "tableRow", content: cells })
const table = (...rows: JSONContent[]): JSONContent => ({ type: "table", content: rows })
const doc = (...content: JSONContent[]): JSONContent => ({ type: "doc", content })

const heading = (text: string, level = 2): JSONContent => ({
  type: "heading",
  attrs: { level },
  content: [{ type: "text", text }],
})
const bullets = (...items: string[]): JSONContent => ({
  type: "bulletList",
  content: items.map((text) => ({ type: "listItem", content: [para(text)] })),
})
const quote = (text: string): JSONContent => ({ type: "blockquote", content: [para(text)] })

/** The 2x2 header table every "block before a table" case below reuses. */
const simpleTable = (): JSONContent =>
  table(row(hdr("Feature"), hdr("Value")), row(txtCell("Speed"), txtCell("Fast")))

const IMG_URL = "https://cdn.sanity.io/images/abc123/production/deadbeef-800x600.png"
const image = (src: string, alt: string): JSONContent => ({ type: "image", attrs: { src, alt } })

const VIMEO_URL = "https://vimeo.com/76979871"
const LOOM_URL = "https://www.loom.com/share/0f1e2d3c4b5a69788796a5b4c3d2e1f0"
const TWITCH_URL = "https://www.twitch.tv/videos/1234567890"
const YT_URL = "https://www.youtube.com/watch?v=aBcDeFgHiJk"
const video = (src: string, provider: string): JSONContent => ({
  type: "videoEmbed",
  attrs: { src, provider },
})
const youtube = (src: string): JSONContent => ({ type: "youtube", attrs: { src } })

/** Every node type present in a doc, flattened. */
function nodeTypes(node: JSONContent): string[] {
  const out: string[] = node.type ? [node.type] : []
  for (const child of node.content ?? []) out.push(...nodeTypes(child))
  return out
}

/** A text node carrying a link mark — what the toolbar Link button produces. */
const link = (text: string, href: string): JSONContent => ({
  type: "text",
  text,
  marks: [{ type: "link", attrs: { href } }],
})

/** Every mark type present in a doc, flattened. */
function markTypes(node: JSONContent): string[] {
  const out = (node.marks ?? []).map((m) => m.type)
  for (const child of node.content ?? []) out.push(...markTypes(child))
  return out
}

/** All text carried by a doc, so we can assert nothing was silently dropped. */
function allText(node: JSONContent): string {
  if (node.type === "text") return node.text ?? ""
  return (node.content ?? []).map(allText).join(" ")
}

/* -------------------------------- tables -------------------------------- */

describe("table persistence through save + reload", () => {
  it("keeps a header-row table as a GFM table, never a [table] placeholder", () => {
    const { saved, reloaded, doc: out } = saveReloadSave(
      doc(table(row(hdr("Feature"), hdr("Value")), row(txtCell("Speed"), txtCell("Fast")))),
    )

    expect(saved).not.toContain("[table]")
    expect(saved).toContain("| Feature | Value |")
    expect(saved).toContain("| Speed | Fast |")
    // Reload is stable — a second save produces byte-identical markdown.
    expect(reloaded).toBe(saved)
    expect(nodeTypes(out)).toContain("table")
  })

  it("keeps a table that has no header row (toolbar 'Header' toggled off)", () => {
    // Regression: tiptap-markdown refused to serialise this and emitted `[table]`,
    // so the whole table was replaced by literal text on the next load.
    const { saved, reloaded, doc: out } = saveReloadSave(
      doc(table(row(txtCell("A"), txtCell("B")), row(txtCell("1"), txtCell("2")))),
    )

    expect(saved).not.toContain("[table]")
    expect(nodeTypes(out)).toContain("table")
    // Every authored cell survives; GFM needs a header, so an empty one is added.
    for (const value of ["A", "B", "1", "2"]) expect(allText(out)).toContain(value)
    expect(reloaded).toBe(saved)
  })

  it("keeps a table whose cell holds two paragraphs (Enter pressed in a cell)", () => {
    const { saved, doc: out } = saveReloadSave(
      doc(table(row(hdr("A"), hdr("B")), row(cell(para("line one"), para("line two")), txtCell("2")))),
    )

    expect(saved).not.toContain("[table]")
    expect(nodeTypes(out)).toContain("table")
    // Both blocks are flattened into the one cell rather than dropped.
    expect(saved).toContain("line one line two")
  })

  it("keeps a table with merged cells by expanding the span", () => {
    const { saved, doc: out } = saveReloadSave(
      doc(
        table(
          row({ type: "tableHeader", attrs: { colspan: 2, rowspan: 1 }, content: [para("Wide")] }),
          row(txtCell("1"), txtCell("2")),
        ),
      ),
    )

    expect(saved).not.toContain("[table]")
    expect(nodeTypes(out)).toContain("table")
    expect(allText(out)).toContain("Wide")
    // Grid stays rectangular: header and body rows have the same column count.
    const rows = saved.trim().split("\n").filter((l) => l.startsWith("|"))
    const widths = new Set(rows.map((l) => l.split("|").length))
    expect(widths.size).toBe(1)
  })

  it("survives the toolbar's insertTable when saved before anything is typed", () => {
    // The 3x3 header table the toolbar inserts, saved immediately.
    const e = makeEditor("<p></p>")
    e.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const saved = (e.storage as any).markdown.getMarkdown() as string
    expect(saved).not.toContain("[table]")

    const reloaded = makeEditor(saved)
    expect(nodeTypes(reloaded.getJSON())).toContain("table")
  })

  it("clamps an absurd colspan from a pasted table instead of expanding it", () => {
    const { saved } = saveReloadSave(
      doc(
        table(
          row({
            type: "tableHeader",
            attrs: { colspan: 200, rowspan: 1 },
            content: [para("Wide")],
          }),
          row(txtCell("1")),
        ),
      ),
    )

    expect(saved).not.toContain("[table]")
    const columns = saved.trim().split("\n")[0].split("|").length - 2
    expect(columns).toBeLessThanOrEqual(64)
  })

  it("escapes pipes in cell text so the grid survives", () => {
    const { saved, doc: out } = saveReloadSave(
      doc(table(row(hdr("A"), hdr("B")), row(txtCell("x | y"), txtCell("2")))),
    )

    expect(saved).toContain("x \\| y")
    // The literal pipe comes back as content, not as an extra column.
    const bodyRow = saved.trim().split("\n").find((l) => l.includes("x \\| y"))!
    expect(bodyRow.split(/(?<!\\)\|/).filter((s) => s.trim()).length).toBe(2)
    expect(allText(out)).toContain("x | y")
  })

  it("keeps inline marks inside cells", () => {
    const { saved } = saveReloadSave(
      doc(
        table(
          row(hdr("A"), hdr("B")),
          row(
            cell({
              type: "paragraph",
              content: [{ type: "text", marks: [{ type: "bold" }], text: "bold" }],
            }),
            txtCell("plain"),
          ),
        ),
      ),
    )

    expect(saved).not.toContain("[table]")
    expect(saved).toContain("**bold**")
  })
})

/* ------------- tables that follow another block (the glue bug) ----------- */

describe("table persistence when preceded by other blocks", () => {
  // Regression: the table serialiser renders every cell up front (buildGrid)
  // before it writes a single row, and captureInline's renderInline spent the
  // *previous* block's pending close in the process. By the time the first row
  // was written the blank-line separator was gone, so the save produced
  // `## Comparison| Feature | Value |` — glued. markdown-it read that as a
  // heading plus paragraphs and the table node was gone on reload. Save alone
  // looked fine in the database; the damage only showed on the way back in.

  it.each([
    ["heading", heading("Comparison"), "## Comparison"],
    ["paragraph", para("Intro copy."), "Intro copy."],
    // The marker is the block's *last* line — that's what the table would glue onto.
    ["bullet list", bullets("one", "two"), "- two"],
    ["blockquote", quote("quoted"), "> quoted"],
  ])("keeps the table when a %s comes first", (_label, before, beforeMarkdown) => {
    const { saved, reloaded, doc: out } = saveReloadSave(doc(before, simpleTable()))

    // The preceding block ends its own line — the table is not glued onto it.
    expect(saved).toContain(`${beforeMarkdown}\n\n| Feature | Value |`)
    expect(saved).not.toContain(`${beforeMarkdown}|`)
    expect(nodeTypes(out)).toContain("table")
    // Header and body cells both came back as real cells.
    expect(nodeTypes(out)).toContain("tableHeader")
    expect(nodeTypes(out)).toContain("tableCell")
    for (const value of ["Feature", "Value", "Speed", "Fast"]) {
      expect(allText(out)).toContain(value)
    }
    expect(reloaded).toBe(saved)
  })

  it("keeps two back-to-back tables as two tables", () => {
    // Glued, the second table's header row landed in the first table's body and
    // the two merged into one on reload.
    const { saved, reloaded, doc: out } = saveReloadSave(
      doc(
        table(row(hdr("A"), hdr("B")), row(txtCell("1"), txtCell("2"))),
        table(row(hdr("C"), hdr("D")), row(txtCell("3"), txtCell("4"))),
      ),
    )

    expect(saved).toContain("| 1 | 2 |\n\n| C | D |")
    expect(nodeTypes(out).filter((t) => t === "table")).toHaveLength(2)
    expect(reloaded).toBe(saved)
  })

  it("stays stable over repeated round trips with a heading in front", () => {
    const { saves, doc: out } = saveCycles(doc(heading("Comparison"), simpleTable()), 3)

    expect(saves[1]).toBe(saves[0])
    expect(saves[2]).toBe(saves[0])
    for (const saved of saves) expect(saved).toContain("## Comparison\n\n| Feature | Value |")
    expect(nodeTypes(out)).toContain("table")
    expect(nodeTypes(out)).toContain("heading")
  })

  it("keeps the reported draft shape: heading + paragraph + table with an in-cell image", () => {
    // The exact shape from the reported draft. Before the fix this reloaded as
    // heading + paragraph ("Here is how they stack up.| Shot | Note | | --- |")
    // + a stray top-level image + a "| ok |" paragraph — no table at all.
    const content = doc(
      heading("Comparison"),
      para("Here is how they stack up."),
      table(row(hdr("Shot"), hdr("Note")), row(cell(image(IMG_URL, "screenshot")), txtCell("ok"))),
    )
    const { saved, reloaded, doc: out } = saveReloadSave(content)

    expect(saved).toContain("Here is how they stack up.\n\n| Shot | Note |")
    expect(saved).toContain(`![screenshot](${IMG_URL})`)
    expect(reloaded).toBe(saved)

    const types = nodeTypes(out)
    expect(types).toContain("table")
    expect(types).toContain("image")
    // The image is inside the table, not stranded as a sibling of it.
    const tableNode = out.content!.find((n) => n.type === "table")!
    expect(nodeTypes(tableNode)).toContain("image")
    expect(out.content!.some((n) => n.type === "image")).toBe(false)
    expect(allText(out)).toContain("ok")

    // And the publish pipeline still sees a table block, not stray prose.
    const blocks = bodyToPortableText(saved) as { _type: string; rows?: { cells?: string[] }[] }[]
    const tableBlock = blocks.find((b) => b._type === "table")
    expect(tableBlock).toBeDefined()
    expect(tableBlock!.rows?.[0].cells).toEqual(["Shot", "Note"])
    expect(tableBlock!.rows?.[1].cells?.[1]).toBe("ok")
  })
})

/* -------------------------------- images -------------------------------- */

describe("image persistence through save + reload", () => {
  it("keeps a body image as a lone markdown image line", () => {
    const { saved, reloaded, doc: out } = saveReloadSave(
      doc(para("intro"), image(IMG_URL, "A chart"), para("outro")),
    )

    expect(saved).toContain(`![A chart](${IMG_URL})`)
    expect(reloaded).toBe(saved)
    expect(nodeTypes(out)).toContain("image")
    const img = out.content!.find((n) => n.type === "image")!
    expect(img.attrs).toMatchObject({ src: IMG_URL, alt: "A chart" })
  })

  it("keeps an image that lives inside a table cell", () => {
    // Regression: the upstream serialiser only rendered a cell's first child and
    // only when it had text content, so an image in a cell vanished on save.
    const { saved, reloaded, doc: out } = saveReloadSave(
      doc(table(row(hdr("Shot"), hdr("Note")), row(cell(image(IMG_URL, "screenshot")), txtCell("ok")))),
    )

    expect(saved).not.toContain("[table]")
    expect(saved).toContain(`![screenshot](${IMG_URL})`)
    expect(nodeTypes(out)).toContain("image")
    expect(reloaded).toBe(saved)
  })

  it("keeps an image alongside text in the same cell", () => {
    const { saved, doc: out } = saveReloadSave(
      doc(
        table(
          row(hdr("A"), hdr("B")),
          row(cell(para("caption"), image(IMG_URL, "pic")), txtCell("2")),
        ),
      ),
    )

    expect(saved).toContain("caption")
    expect(saved).toContain(`![pic](${IMG_URL})`)
    expect(nodeTypes(out)).toContain("image")
  })

  it("keeps alt text safe for the publish pipeline's lone-image regex", () => {
    const { saved } = saveReloadSave(doc(image(IMG_URL, "square [brackets] here")))
    // Brackets would terminate the `![...]` capture — they get flattened away.
    expect(saved).toContain(`![square brackets here](${IMG_URL})`)
  })
})

/* -------------------------------- videos -------------------------------- */

describe("video persistence through repeated save + reload", () => {
  // Regression: a video node serialises to a bare URL on its own line, but
  // nothing parsed that line back into a node. markdown-it's `linkify` turned
  // it into a paragraph holding an autolink, so (a) the embed was gone from the
  // editor and (b) prosemirror-markdown re-emitted it in the `<url>` autolink
  // form on the *second* save. loneVideoUrl() (publish) requires the line to
  // start with `http`, so the published post lost its videoEmbed block too.
  // One cycle looked fine, which is why this has to run at least two.

  it("keeps a video URL bare and byte-stable across two round trips", () => {
    const { saves, doc: out } = saveCycles(doc(para("before"), video(VIMEO_URL, "vimeo"), para("after")), 3)

    for (const saved of saves) {
      expect(saved).not.toContain("<http")
      expect(saved).not.toContain(">")
      expect(saved).toContain(`\n${VIMEO_URL}\n`)
    }
    // The second save is where the angle brackets used to appear.
    expect(saves[1]).toBe(saves[0])
    expect(saves[2]).toBe(saves[0])
    // And the embed is still an embed, not a paragraph with a link in it.
    expect(nodeTypes(out)).toContain("videoEmbed")
    const embed = out.content!.find((n) => n.type === "videoEmbed")!
    expect(embed.attrs).toMatchObject({ src: VIMEO_URL, provider: "vimeo" })
  })

  it.each([
    ["vimeo", VIMEO_URL],
    ["loom", LOOM_URL],
    ["twitch", TWITCH_URL],
  ])("keeps a %s embed intact over two round trips", (provider, url) => {
    const { saves, doc: out } = saveCycles(doc(video(url, provider)), 3)

    expect(saves[0].trim()).toBe(url)
    expect(saves[1]).toBe(saves[0])
    expect(saves[2]).toBe(saves[0])
    expect(saves[1]).not.toContain("<")
    expect(nodeTypes(out)).toContain("videoEmbed")
  })

  it("keeps a YouTube embed intact over two round trips", () => {
    // Same serialiser family, same bug: Youtube's markdown storage also writes
    // a bare URL and had no parse side.
    const { saves, doc: out } = saveCycles(doc(youtube(YT_URL)), 3)

    expect(saves[0].trim()).toBe(YT_URL)
    expect(saves[1]).toBe(saves[0])
    expect(saves[2]).toBe(saves[0])
    expect(saves[1]).not.toContain("<")
    expect(nodeTypes(out)).toContain("youtube")
    expect(out.content!.find((n) => n.type === "youtube")!.attrs).toMatchObject({ src: YT_URL })
  })

  it("repairs a draft that was already saved in the <url> form", () => {
    // Drafts saved before this fix are sitting in the database angle-bracketed.
    // markdown-it parses both spellings into the same anchor, so loading one
    // rebuilds the node and the next save writes it bare again.
    const { saves, doc: out } = saveCycles(`intro\n\n<${VIMEO_URL}>\n\noutro`, 2)

    expect(saves[0]).toContain(VIMEO_URL)
    expect(saves[0]).not.toContain("<http")
    expect(saves[1]).toBe(saves[0])
    expect(nodeTypes(out)).toContain("videoEmbed")
  })

  it("keeps a video inside a table cell bare across two round trips", () => {
    const { saves } = saveCycles(
      doc(table(row(hdr("Clip"), hdr("Note")), row(cell(video(VIMEO_URL, "vimeo")), txtCell("ok")))),
      3,
    )

    expect(saves[0]).toContain(`| ${VIMEO_URL} |`)
    expect(saves[1]).toBe(saves[0])
    expect(saves[2]).toBe(saves[0])
    expect(saves[1]).not.toContain("<http")
  })

  it("leaves a video URL that has text around it as an ordinary link", () => {
    // Only a whole-line bare URL is a video — the same rule loneVideoUrl uses
    // at publish time. Nothing here should be promoted to an embed.
    const { saves, doc: out } = saveCycles(doc(para(`watch ${VIMEO_URL} today`)), 3)

    expect(nodeTypes(out)).not.toContain("videoEmbed")
    expect(allText(out)).toContain("watch")
    expect(allText(out)).toContain("today")
    // It stays ordinary prose: with linkify off nothing promotes the URL to a
    // link, so no `<url>` autolink form ever appears and the markdown settles.
    expect(saves[2]).not.toContain("<http")
    expect(saves[2]).toBe(saves[1])
  })
})

/* --------------------------- links ---------------------------- */

describe("links are only ever created deliberately", () => {
  // The editor used to manufacture links on its own: tiptap's `autolink` while
  // typing, its paste rule on any pasted text, and markdown-it's `linkify`
  // when a stored draft was parsed back in. The last one was the damaging one
  // — a bare "monday.com" in a draft came back as a link, serialised out as
  // real `[monday.com](http://monday.com)` markdown, and published as a live
  // hyperlink nobody had asked for.

  it("leaves a bare domain in prose as plain text", () => {
    const { saves, doc: out } = saveCycles(doc(para("We are a monday.com partner.")), 3)

    expect(markTypes(out)).not.toContain("link")
    expect(saves[0]).toBe("We are a monday.com partner.")
    // Reloading is where linkify used to strike, so check past the first save.
    expect(saves[2]).toBe(saves[0])
  })

  it("leaves a bare URL in prose as plain text", () => {
    const { saves, doc: out } = saveCycles(doc(para("Pricing is at https://monday.com/pricing.")), 3)

    expect(markTypes(out)).not.toContain("link")
    expect(saves[2]).not.toContain("<http")
    expect(saves[2]).not.toContain("](")
    expect(saves[2]).toBe(saves[0])
  })

  it("keeps a link the editor was told to make", () => {
    // What the toolbar Link button produces — this must still survive.
    const { saves, doc: out } = saveCycles(
      doc({
        type: "paragraph",
        content: [{ type: "text", text: "See " }, link("monday.com", "https://monday.com")],
      }),
      3,
    )

    expect(markTypes(out)).toContain("link")
    expect(saves[0]).toContain("[monday.com](https://monday.com)")
    expect(saves[2]).toBe(saves[0])
  })

  it("publishes a bare domain with no link markDefs", () => {
    const { saved } = saveReloadSave(doc(para("Ask us about monday.com and asana.com.")))

    const blocks = bodyToPortableText(saved) as { _type: string; markDefs?: unknown[] }[]
    expect(blocks.every((b) => (b.markDefs ?? []).length === 0)).toBe(true)
  })

  it("still publishes a deliberate link as a link markDef", () => {
    const { saved } = saveReloadSave(
      doc({
        type: "paragraph",
        content: [{ type: "text", text: "See " }, link("our partner", "https://monday.com")],
      }),
    )

    const blocks = bodyToPortableText(saved) as {
      _type: string
      markDefs?: { _type: string; href: string }[]
    }[]
    const defs = blocks.flatMap((b) => b.markDefs ?? [])
    expect(defs).toHaveLength(1)
    expect(defs[0].href).toBe("https://monday.com")
  })
})

/* ------------------- the markdown the publish step sees ------------------ */

describe("saved markdown still feeds the Sanity publish pipeline", () => {
  it("turns a round-tripped table into a Portable Text table block", () => {
    const { saved } = saveReloadSave(
      doc(table(row(hdr("Feature"), hdr("Value")), row(txtCell("Speed"), txtCell("Fast")))),
    )

    const blocks = bodyToPortableText(saved) as { _type: string; rows?: { cells?: string[] }[] }[]
    const tableBlock = blocks.find((b) => b._type === "table")
    expect(tableBlock).toBeDefined()
    expect(tableBlock!.rows?.map((r) => r.cells)).toEqual([
      ["Feature", "Value"],
      ["Speed", "Fast"],
    ])
  })

  it("unescapes pipes back into cell text", () => {
    const { saved } = saveReloadSave(
      doc(table(row(hdr("A"), hdr("B")), row(txtCell("x | y"), txtCell("2")))),
    )

    const blocks = bodyToPortableText(saved) as { _type: string; rows?: { cells?: string[] }[] }[]
    const tableBlock = blocks.find((b) => b._type === "table")!
    expect(tableBlock.rows![1].cells).toEqual(["x | y", "2"])
  })

  it("still turns a twice-round-tripped video into a videoEmbed block", () => {
    // The user-visible half of the bug: once the second save wrote `<url>`,
    // loneVideoUrl() stopped matching and publishing silently downgraded the
    // video to a paragraph of link text.
    const { saves } = saveCycles(doc(para("intro"), video(VIMEO_URL, "vimeo")), 3)

    const blocks = bodyToPortableText(saves[2]) as { _type: string; url?: string }[]
    const embed = blocks.find((b) => b._type === "videoEmbed")
    expect(embed).toBeDefined()
    expect(embed!.url).toBe(VIMEO_URL)
  })

  it("turns a round-tripped body image into a Portable Text image block", () => {
    const { saved } = saveReloadSave(doc(para("intro"), image(IMG_URL, "A chart")))

    const blocks = bodyToPortableText(saved) as {
      _type: string
      alt?: string
      asset?: { _ref?: string }
    }[]
    const imageBlock = blocks.find((b) => b._type === "image")
    expect(imageBlock).toBeDefined()
    expect(imageBlock!.alt).toBe("A chart")
    expect(imageBlock!.asset?._ref).toBe("image-deadbeef-800x600-png")
  })
})
