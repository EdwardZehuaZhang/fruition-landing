/**
 * Inline-markdown tokenizer shared by the two places that have to understand
 * the inline subset the blog editor emits: `**bold**` / `__bold__`,
 * `*italic*` / `_italic_`, and `[text](url)` links.
 *
 * Two consumers, and they must agree:
 *
 *   1. bodyToPortableText (src/lib/sanityWriteClient.ts) turns markdown into
 *      Portable Text spans + link markDefs on publish.
 *   2. BlogPostTemplate's table renderer. Sanity stores table cells as plain
 *      strings (`cells: [{type: "string"}]` in src/sanity/schemas/blogPost.ts),
 *      so a bold cell is published as the literal characters `**Use case**`.
 *      Nothing had ever parsed them back, which is why tables looked right in
 *      the editor but rendered raw `**` on the live post.
 *
 * Runs come back flat rather than as a tree because Portable Text spans are
 * flat too — a `**bold with *italic* inside**` cell is three runs, the middle
 * one carrying both marks.
 *
 * Deliberate limits, kept because paragraph text has always behaved this way
 * and cells must not diverge from it:
 *   - link text is not scanned for marks, so `[**x**](url)` keeps its asterisks
 *   - a bold run may not span a link (`**a [b](url) c**` stays literal)
 *   - unmatched delimiters stay literal, which is what keeps malformed author
 *     input (`Assigned a Jira** g`) readable instead of swallowing the rest
 *     of the sentence
 */

/** One styled run of text. `href` runs carry no marks — see parseInlineMarkdown. */
export interface InlineRun {
  text: string
  strong?: boolean
  em?: boolean
  /** Set when the run is link text; mutually exclusive with strong/em. */
  href?: string
}

/** Split a run of plain text (no links) into runs, applying `em` on top of `strong`. */
function splitEm(text: string, strong: boolean, out: InlineRun[]): void {
  const re = /(\*|_)(.+?)\1/g
  let idx = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > idx) {
      const pre = text.slice(idx, m.index)
      if (pre) out.push({ text: pre, ...(strong && { strong }) })
    }
    out.push({ text: m[2], ...(strong && { strong }), em: true })
    idx = m.index + m[0].length
  }
  const rest = text.slice(idx)
  if (rest) out.push({ text: rest, ...(strong && { strong }) })
}

/** Split a run of plain text (no links) into runs, applying `strong` then `em`. */
function splitStrong(text: string, out: InlineRun[]): void {
  const re = /(\*\*|__)(.+?)\1/g
  let idx = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > idx) splitEm(text.slice(idx, m.index), false, out)
    splitEm(m[2], true, out)
    idx = m.index + m[0].length
  }
  if (idx < text.length) splitEm(text.slice(idx), false, out)
}

/**
 * Parse one line of inline markdown into styled runs. Links are extracted
 * first, then bold/italic are applied within the runs between them.
 *
 * Empty runs are never emitted, so `parseInlineMarkdown("")` is `[]`.
 */
export function parseInlineMarkdown(text: string): InlineRun[] {
  const out: InlineRun[] = []
  const linkRe = /\[([^\]]+)\]\(([^)\s]+)\)/g
  let idx = 0
  let m: RegExpExecArray | null
  while ((m = linkRe.exec(text))) {
    if (m.index > idx) splitStrong(text.slice(idx, m.index), out)
    out.push({ text: m[1], href: m[2] })
    idx = m.index + m[0].length
  }
  if (idx < text.length) splitStrong(text.slice(idx), out)
  return out
}
