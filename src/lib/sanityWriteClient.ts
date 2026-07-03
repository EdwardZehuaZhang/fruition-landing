/**
 * Sanity write helpers used by /api/internal/onboarding.
 * Kept separate from src/sanity/client.ts so the read-only client can
 * stay `useCdn: true`.
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"

function getToken(): string {
  const t = process.env.SANITY_WRITE_TOKEN
  if (!t) throw new Error("SANITY_WRITE_TOKEN missing")
  return t
}

function base(): string {
  if (!PROJECT_ID || !DATASET) throw new Error("Sanity project id / dataset missing")
  return `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}`
}

export async function uploadImageAsset(
  bytes: ArrayBuffer | Uint8Array,
  mime: string,
  filename: string,
): Promise<string> {
  const ext = (mime.split("/")[1] ?? "jpg").split(";")[0]
  const url = `${base()}/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}.${ext}`
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": mime,
      Authorization: `Bearer ${getToken()}`,
    },
    body: u8 as unknown as BodyInit,
  })
  if (!r.ok) throw new Error(`sanity asset upload ${r.status} ${await r.text()}`)
  const j = (await r.json()) as { document?: { _id?: string } }
  const id = j.document?._id
  if (!id) throw new Error("sanity asset upload returned no _id")
  return id
}

export interface CreateTeamMemberInput {
  docId: string
  name: string
  role: string
  regions: string[]
  bio?: string
  emoji?: string
  linkedinUrl?: string
  photoAssetId?: string
  order?: number
}

function buildTeamMemberDoc(input: CreateTeamMemberInput): Record<string, unknown> {
  const doc: Record<string, unknown> = {
    _id: input.docId,
    _type: "teamMember",
    name: input.name,
    role: input.role,
    regions: input.regions,
    order: input.order ?? 9999,
  }
  if (input.bio) doc.bio = input.bio
  if (input.emoji) doc.emoji = input.emoji
  if (input.linkedinUrl) doc.linkedinUrl = input.linkedinUrl
  if (input.photoAssetId) {
    doc.photo = { _type: "image", asset: { _type: "reference", _ref: input.photoAssetId } }
  }
  return doc
}

async function mutate(mutations: unknown[]): Promise<void> {
  const r = await fetch(`${base()}/data/mutate/${DATASET}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ mutations }),
  })
  if (!r.ok) throw new Error(`sanity mutate ${r.status} ${await r.text()}`)
}

export async function createTeamMember(input: CreateTeamMemberInput): Promise<{ id: string }> {
  await mutate([{ create: buildTeamMemberDoc(input) }])
  return { id: input.docId }
}

export async function upsertTeamMember(input: CreateTeamMemberInput): Promise<{ id: string }> {
  await mutate([{ createOrReplace: buildTeamMemberDoc(input) }])
  return { id: input.docId }
}

export interface UpsertBlogPostInput {
  /** Stable doc id, e.g. `blog-monday-<pulseId>`. Allows re-publish to update in place. */
  docId: string
  title: string
  /** Markdown body. See bodyToPortableText for the supported subset. */
  body: string
  slug?: string
  excerpt?: string
  industry?: string
  author?: string
  seoTitle?: string
  seoDescription?: string
  coverImageAssetId?: string
  /** _ids of blogCategory documents to reference. */
  categoryIds?: string[]
  mondayItemId?: string
  publishedAt?: string
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
}

interface PortableTextSpan {
  _type: "span"
  _key: string
  text: string
  marks: string[]
}

interface LinkMarkDef {
  _key: string
  _type: "link"
  href: string
}

interface PortableTextBlock {
  _type: "block"
  _key: string
  style: string
  markDefs: LinkMarkDef[]
  children: PortableTextSpan[]
  /** Present only for list items — "bullet" or "number". */
  listItem?: "bullet" | "number"
  /** Nesting level for list items (1-based). */
  level?: number
}

interface VideoEmbedBlock {
  _type: "videoEmbed"
  _key: string
  url: string
}

type BodyBlock = PortableTextBlock | VideoEmbedBlock

/**
 * If a line is nothing but a YouTube / Vimeo / Loom URL, return that URL so it
 * can be rendered as an inline video block. Otherwise null (treat as text).
 */
function loneVideoUrl(line: string): string | null {
  if (/\s/.test(line)) return null
  if (!/^https?:\/\//i.test(line)) return null
  return /(?:youtube\.com|youtu\.be|vimeo\.com|loom\.com)/i.test(line) ? line : null
}

let keyCounter = 0
function nextKey(): string {
  keyCounter += 1
  return `k${Date.now().toString(36)}${keyCounter.toString(36)}`
}

function span(text: string, marks: string[]): PortableTextSpan {
  return { _type: "span", _key: nextKey(), text, marks }
}

/**
 * Split a run of plain text (no links) into spans, applying `em` marks on top
 * of any base marks. Handles `*italic*` and `_italic_`.
 */
function splitItalic(text: string, baseMarks: string[], out: PortableTextSpan[]): void {
  const re = /(\*|_)(.+?)\1/g
  let idx = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > idx) {
      const pre = text.slice(idx, m.index)
      if (pre) out.push(span(pre, baseMarks))
    }
    out.push(span(m[2], [...baseMarks, "em"]))
    idx = m.index + m[0].length
  }
  const rest = text.slice(idx)
  if (rest) out.push(span(rest, baseMarks))
}

/**
 * Split a run of plain text (no links) into spans, applying `strong` first
 * (`**bold**` / `__bold__`) then `em` inside each run.
 */
function splitMarks(text: string): PortableTextSpan[] {
  const out: PortableTextSpan[] = []
  const re = /(\*\*|__)(.+?)\1/g
  let idx = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > idx) splitItalic(text.slice(idx, m.index), [], out)
    splitItalic(m[2], ["strong"], out)
    idx = m.index + m[0].length
  }
  if (idx < text.length) splitItalic(text.slice(idx), [], out)
  return out
}

/**
 * Parse a single line of inline markdown into Portable Text spans + link
 * markDefs. Links (`[text](url)`) are extracted first, then bold/italic are
 * applied within the non-link runs.
 */
function parseInline(text: string): { children: PortableTextSpan[]; markDefs: LinkMarkDef[] } {
  const markDefs: LinkMarkDef[] = []
  const children: PortableTextSpan[] = []
  const linkRe = /\[([^\]]+)\]\(([^)\s]+)\)/g
  let idx = 0
  let m: RegExpExecArray | null
  while ((m = linkRe.exec(text))) {
    if (m.index > idx) children.push(...splitMarks(text.slice(idx, m.index)))
    const key = nextKey()
    markDefs.push({ _key: key, _type: "link", href: m[2] })
    children.push(span(m[1], [key]))
    idx = m.index + m[0].length
  }
  if (idx < text.length) children.push(...splitMarks(text.slice(idx)))
  // A block must always have at least one child span.
  if (children.length === 0) children.push(span("", []))
  return { children, markDefs }
}

function makeBlock(
  style: string,
  text: string,
  extra?: Pick<PortableTextBlock, "listItem" | "level">,
): PortableTextBlock {
  const { children, markDefs } = parseInline(text)
  return { _type: "block", _key: nextKey(), style, markDefs, children, ...extra }
}

/**
 * Markdown → Portable Text conversion for the internal blog editor.
 *
 * Supports (matching the marks/styles rendered by BlogPostTemplate.tsx):
 *   - Headings `#`..`####` → h1..h4
 *   - Blockquotes (`> `)
 *   - Bullet lists (`- ` / `* `) and numbered lists (`1. ` / `1) `)
 *   - Inline `**bold**`/`__bold__`, `*italic*`/`_italic_`, `[text](url)` links
 *   - Blank-line-separated paragraphs (soft-wrapped lines are joined)
 *
 * Nested lists and images-in-body are out of scope (cover image is handled
 * separately); tables/HTML pass through as plain text.
 */
function bodyToPortableText(body: string): BodyBlock[] {
  const blocks: BodyBlock[] = []
  const lines = body.replace(/\r\n/g, "\n").split("\n")
  let paragraph: string[] = []

  const flushParagraph = () => {
    if (paragraph.length === 0) return
    const text = paragraph.join(" ").trim()
    if (text) blocks.push(makeBlock("normal", text))
    paragraph = []
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) {
      flushParagraph()
      continue
    }
    const videoUrl = loneVideoUrl(line)
    if (videoUrl) {
      flushParagraph()
      blocks.push({ _type: "videoEmbed", _key: nextKey(), url: videoUrl })
      continue
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(line)
    if (heading) {
      flushParagraph()
      blocks.push(makeBlock(`h${heading[1].length}`, heading[2]))
      continue
    }
    const quote = /^>\s+(.*)$/.exec(line)
    if (quote) {
      flushParagraph()
      blocks.push(makeBlock("blockquote", quote[1]))
      continue
    }
    const bullet = /^[-*]\s+(.*)$/.exec(line)
    if (bullet) {
      flushParagraph()
      blocks.push(makeBlock("normal", bullet[1], { listItem: "bullet", level: 1 }))
      continue
    }
    const numbered = /^\d+[.)]\s+(.*)$/.exec(line)
    if (numbered) {
      flushParagraph()
      blocks.push(makeBlock("normal", numbered[1], { listItem: "number", level: 1 }))
      continue
    }
    paragraph.push(line)
  }
  flushParagraph()
  return blocks
}

function buildBlogPostDoc(input: UpsertBlogPostInput): Record<string, unknown> {
  const doc: Record<string, unknown> = {
    _id: input.docId,
    _type: "blogPost",
    title: input.title,
    slug: { _type: "slug", current: input.slug || slugify(input.title) },
    body: bodyToPortableText(input.body),
    publishedAt: input.publishedAt ?? new Date().toISOString(),
    author: input.author ?? "Fruition Editorial",
  }
  if (input.excerpt) doc.excerpt = input.excerpt
  if (input.industry) doc.industry = input.industry
  if (input.seoTitle) doc.seoTitle = input.seoTitle
  if (input.seoDescription) doc.seoDescription = input.seoDescription
  if (input.categoryIds && input.categoryIds.length > 0) {
    doc.categories = input.categoryIds.map((id) => ({
      _type: "reference",
      _key: nextKey(),
      _ref: id,
    }))
  }
  if (input.mondayItemId) doc.mondayItemId = input.mondayItemId
  if (input.coverImageAssetId) {
    doc.coverImage = {
      _type: "image",
      asset: { _type: "reference", _ref: input.coverImageAssetId },
    }
  }
  return doc
}

export async function upsertBlogPost(
  input: UpsertBlogPostInput,
): Promise<{ id: string; slug: string }> {
  const doc = buildBlogPostDoc(input)
  await mutate([{ createOrReplace: doc }])
  const slug = (doc.slug as { current: string }).current
  return { id: input.docId, slug }
}
