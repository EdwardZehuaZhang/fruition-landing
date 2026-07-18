/**
 * Portable Text → Markdown, the reverse of bodyToPortableText in
 * src/lib/sanityWriteClient.ts. Lets the internal portal load a published
 * Sanity post back into the markdown blog editor.
 *
 * Supports the same subset the editor produces — headings h1–h4, blockquotes,
 * flat bullet/numbered lists, bold/italic/links, GFM tables, videoEmbed
 * blocks (lone URL line) — plus body `image` blocks from legacy imported
 * posts, which become lone `![alt](cdn-url)` lines (bodyToPortableText
 * converts those back into image blocks on republish).
 */

interface PTSpan {
  _type?: string
  text?: string
  marks?: string[]
}

interface PTMarkDef {
  _key: string
  _type: string
  href?: string
}

interface PTBlock {
  _type: string
  style?: string
  listItem?: "bullet" | "number"
  children?: PTSpan[]
  markDefs?: PTMarkDef[]
  /** table */
  rows?: { cells?: string[] }[]
  /** videoEmbed */
  url?: string
  /** image */
  asset?: { _ref?: string }
  alt?: string
}

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET

/** `image-<hash>-<WxH>-<fmt>` asset ref → public CDN URL (null if malformed). */
export function imageRefToUrl(ref: string): string | null {
  const m = /^image-([A-Za-z0-9]+)-(\d+x\d+)-([a-z0-9]+)$/.exec(ref)
  if (!m || !PROJECT_ID || !DATASET) return null
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${m[1]}-${m[2]}.${m[3]}`
}

function spanToMd(s: PTSpan, markDefs: PTMarkDef[]): string {
  let text = s.text ?? ""
  if (!text) return ""
  const marks = s.marks ?? []
  if (marks.includes("em")) text = `*${text}*`
  if (marks.includes("strong")) text = `**${text}**`
  for (const mark of marks) {
    const def = markDefs.find((d) => d._key === mark)
    if (def?._type === "link" && def.href) text = `[${text}](${def.href})`
  }
  return text
}

function blockText(b: PTBlock): string {
  return (b.children ?? []).map((s) => spanToMd(s, b.markDefs ?? [])).join("")
}

/** Escape unescaped pipes so cell text survives the GFM row format. */
function tableCell(cell: string): string {
  return cell.replace(/\|/g, "\\|")
}

export function portableTextToMarkdown(body: unknown): string {
  const blocks = (Array.isArray(body) ? body : []) as PTBlock[]
  const out: string[] = []
  let numberCounter = 0
  let prevListItem: "bullet" | "number" | undefined

  for (const b of blocks) {
    const listItem = b._type === "block" ? b.listItem : undefined
    if (listItem !== "number") numberCounter = 0

    let text: string | null = null
    if (b._type === "block") {
      const inline = blockText(b)
      if (listItem === "bullet") {
        text = `- ${inline}`
      } else if (listItem === "number") {
        numberCounter += 1
        text = `${numberCounter}. ${inline}`
      } else {
        const style = b.style ?? "normal"
        const heading = /^h([1-4])$/.exec(style)
        if (heading) text = `${"#".repeat(Number(heading[1]))} ${inline}`
        else if (style === "blockquote") text = `> ${inline}`
        else text = inline
      }
    } else if (b._type === "videoEmbed" && b.url) {
      text = b.url
    } else if (b._type === "table" && b.rows?.length) {
      const rows = b.rows.map((r) => (r.cells ?? []).map(tableCell))
      const header = `| ${rows[0].join(" | ")} |`
      const sep = `| ${rows[0].map(() => "---").join(" | ")} |`
      const bodyRows = rows.slice(1).map((r) => `| ${r.join(" | ")} |`)
      text = [header, sep, ...bodyRows].join("\n")
    } else if (b._type === "image" && b.asset?._ref) {
      const url = imageRefToUrl(b.asset._ref)
      if (url) text = `![${b.alt ?? ""}](${url})`
    }

    if (text === null) continue // unknown block type — skip rather than corrupt

    // Items of the same list stick together; everything else gets a blank line.
    if (out.length > 0 && listItem && listItem === prevListItem) {
      out.push(`\n${text}`)
    } else {
      out.push(out.length > 0 ? `\n\n${text}` : text)
    }
    prevListItem = listItem
  }
  return out.join("")
}
