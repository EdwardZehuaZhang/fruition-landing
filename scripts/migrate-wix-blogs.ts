/**
 * One-off migration: copy recent Wix blog posts from the legacy
 * fruitionservices.io (Wix) site into Sanity. Once in Sanity the React
 * site renders them automatically at /post/<slug> and lists them at
 * /consulting-blog.
 *
 * Source of truth per post:
 *   - meta  : <script type="application/ld+json"> BlogPosting + og: tags
 *   - body  : <section data-hook="post-description"> rendered rich content
 *   - cover : og:image
 *
 * Body is converted to Portable Text (the blogPost schema allows `block`
 * + `image`). Tables are flattened to text rows (schema has no table
 * type); video embeds are collected into the `videoUrls` field.
 *
 * Usage:
 *   npx tsx scripts/migrate-wix-blogs.ts            # DRY RUN — no writes
 *   npx tsx scripts/migrate-wix-blogs.ts --write    # write to Sanity
 *   npx tsx scripts/migrate-wix-blogs.ts --write --only monday-ai-credits-usage
 */
import { parse, HTMLElement } from "node-html-parser"
import { writeClient } from "./sanity-client"

const WRITE = process.argv.includes("--write")
const onlyIdx = process.argv.indexOf("--only")
const ONLY = onlyIdx >= 0 ? process.argv[onlyIdx + 1] : null

const BASE = "https://www.fruitionservices.io/post/"

/** The 6 most-recent posts, with their on-site category label. */
const POSTS: { slug: string; category: string }[] = [
  { slug: "top-5-sales-outbound-tools-for-2026", category: "Aircall" },
  { slug: "manage-purchase-orders-in-mondaycom", category: "monday.com" },
  { slug: "monday-ai-pricing-model-2026", category: "monday.com" },
  { slug: "mondaycom-product-and-ai-roadmap-2026-2027", category: "monday.com" },
  { slug: "monday-ai-credits-usage", category: "AI" },
  { slug: "top-tools-to-manage-ai-tokens", category: "AI" },
]

// ---------- Portable Text types ----------
interface Span {
  _type: "span"
  _key: string
  text: string
  marks: string[]
}
interface MarkDef {
  _type: "link"
  _key: string
  href: string
}
interface Block {
  _type: "block"
  _key: string
  style: string
  listItem?: "bullet" | "number"
  level?: number
  markDefs: MarkDef[]
  children: Span[]
}
interface ImageBlock {
  _type: "image"
  _key: string
  asset: { _type: "reference"; _ref: string }
  alt?: string
  caption?: string
}
type BodyNode = Block | ImageBlock

let keyN = 0
const key = () => `k${(keyN++).toString(36)}${Date.now().toString(36).slice(-4)}`

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
}

// ---------- inline span extraction (marks + links) ----------
function inlineSpans(el: HTMLElement, markDefs: MarkDef[]): Span[] {
  const spans: Span[] = []
  const walk = (node: HTMLElement | { nodeType: number; rawText?: string; text?: string }, marks: string[]) => {
    // text node
    if ((node as { nodeType: number }).nodeType === 3) {
      const raw = (node as { text?: string }).text ?? ""
      const text = raw.replace(/\s+/g, " ")
      if (text) spans.push({ _type: "span", _key: key(), text, marks: [...marks] })
      return
    }
    const e = node as HTMLElement
    if (!e.tagName) {
      const text = (e.text || "").replace(/\s+/g, " ")
      if (text) spans.push({ _type: "span", _key: key(), text, marks: [...marks] })
      return
    }
    const tag = e.tagName.toUpperCase()
    if (tag === "BR") {
      spans.push({ _type: "span", _key: key(), text: "\n", marks: [...marks] })
      return
    }
    let nextMarks = marks
    if (tag === "STRONG" || tag === "B") nextMarks = [...marks, "strong"]
    else if (tag === "EM" || tag === "I") nextMarks = [...marks, "em"]
    else if (tag === "U") nextMarks = [...marks, "underline"]
    else if (tag === "A") {
      const href = e.getAttribute("href") || ""
      if (href) {
        const md: MarkDef = { _type: "link", _key: key(), href }
        markDefs.push(md)
        nextMarks = [...marks, md._key]
      }
    }
    for (const child of e.childNodes) walk(child as HTMLElement, nextMarks)
  }
  for (const child of el.childNodes) walk(child as HTMLElement, [])
  // merge adjacent spans with identical marks
  const merged: Span[] = []
  for (const s of spans) {
    const last = merged[merged.length - 1]
    if (last && JSON.stringify(last.marks) === JSON.stringify(s.marks)) last.text += s.text
    else merged.push(s)
  }
  return merged.filter((s) => s.text.trim() !== "" || s.text === "\n")
}

function textBlock(el: HTMLElement, style: string, listItem?: "bullet" | "number"): Block | null {
  const markDefs: MarkDef[] = []
  const children = inlineSpans(el, markDefs)
  if (children.length === 0) return null
  const block: Block = { _type: "block", _key: key(), style, markDefs, children }
  if (listItem) {
    block.listItem = listItem
    block.level = 1
  }
  return block
}

// ---------- image upload ----------
async function uploadImage(url: string, filename: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`  ! image fetch ${res.status} ${url}`)
      return null
    }
    const buf = Buffer.from(await res.arrayBuffer())
    const asset = await writeClient.assets.upload("image", buf, { filename })
    return asset._id
  } catch (e) {
    console.warn(`  ! image upload failed ${url}: ${(e as Error).message}`)
    return null
  }
}

/** Normalize a wixstatic media URL to a reasonable full-size variant. */
function cleanImageUrl(src: string): string {
  // Strip the /v1/fill/.../ transform segment so we get the original asset.
  const m = src.match(/^(https:\/\/static\.wixstatic\.com\/media\/[^/]+)\//)
  return m ? m[1] : src
}

// ---------- per-post extraction ----------
interface Extracted {
  slug: string
  title: string
  seoTitle: string
  seoDescription: string
  excerpt: string
  author: string
  publishedAt: string
  coverUrl: string
  category: string
  body: BodyNode[]
  videoUrls: string[]
  imageUrls: string[]
}

function metaContent(root: HTMLElement, prop: string): string {
  const el =
    root.querySelector(`meta[property="${prop}"]`) ||
    root.querySelector(`meta[name="${prop}"]`)
  return el?.getAttribute("content") || ""
}

async function extract(slug: string, category: string): Promise<Extracted> {
  const res = await fetch(BASE + slug, { headers: { "User-Agent": "Mozilla/5.0" } })
  if (!res.ok) throw new Error(`fetch ${slug} -> ${res.status}`)
  const html = await res.text()
  const root = parse(html, { blockTextElements: { script: true, style: false } })

  // --- meta from ld+json ---
  let ld: Record<string, unknown> = {}
  for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const j = JSON.parse(s.text)
      const arr = Array.isArray(j) ? j : [j]
      const bp = arr.find((x) => x["@type"] === "BlogPosting")
      if (bp) ld = bp
    } catch {
      /* ignore */
    }
  }
  const ogTitle = metaContent(root, "og:title")
  const rawTitle = (ld.headline as string) || ogTitle || slug
  // Strip the "| Fruition Services | Author" suffix Wix appends in og:title.
  const title = rawTitle.split(/\s*\|\s*Fruition Services/i)[0].trim()
  const seoDescription = metaContent(root, "og:description")
  const coverUrl = metaContent(root, "og:image")
  const author =
    (ld.author as { name?: string } | undefined)?.name || "Fruition Editorial"
  const publishedAt = (ld.datePublished as string) || new Date().toISOString()

  // --- body ---
  const section = root.querySelector('[data-hook="post-description"]')
  if (!section) throw new Error(`no post-description for ${slug}`)

  const body: BodyNode[] = []
  const videoUrls: string[] = []
  const imageUrls: string[] = []

  // Collect block-level elements in document order.
  const blockEls = section.querySelectorAll(
    "h1, h2, h3, h4, p, ul, ol, figure, blockquote, table, iframe",
  )
  const handled = new Set<HTMLElement>()
  for (const el of blockEls) {
    if (handled.has(el)) continue
    const tag = el.tagName.toUpperCase()

    // Skip elements nested inside one we'll handle wholesale.
    if (el.closest("figure") && tag !== "FIGURE") {
      continue
    }
    if (el.closest("table") && tag !== "TABLE") continue
    if (el.closest("li")) continue // list items handled via their UL/OL

    if (tag === "H1" || tag === "H2") {
      const b = textBlock(el, "h2")
      if (b) body.push(b)
    } else if (tag === "H3" || tag === "H4") {
      const b = textBlock(el, "h3")
      if (b) body.push(b)
    } else if (tag === "P") {
      const b = textBlock(el, "normal")
      if (b) body.push(b)
    } else if (tag === "BLOCKQUOTE") {
      const b = textBlock(el, "blockquote")
      if (b) body.push(b)
    } else if (tag === "UL" || tag === "OL") {
      const listType = tag === "UL" ? "bullet" : "number"
      for (const li of el.querySelectorAll("li")) {
        // only direct children of this list
        if (li.closest("ul, ol") !== el) continue
        const b = textBlock(li, "normal", listType)
        if (b) body.push(b)
      }
    } else if (tag === "FIGURE") {
      handled.add(el)
      const iframe = el.querySelector("iframe")
      if (iframe) {
        const src = iframe.getAttribute("src") || ""
        if (src) videoUrls.push(src.startsWith("//") ? "https:" + src : src)
        continue
      }
      const img = el.querySelector("img")
      if (img) {
        const src = img.getAttribute("src") || ""
        if (src) {
          const clean = cleanImageUrl(src)
          imageUrls.push(clean)
          const cap = el.querySelector("figcaption")
          if (WRITE) {
            const id = await uploadImage(clean, `${slug}-img-${imageUrls.length}`)
            if (id) {
              const ib: ImageBlock = {
                _type: "image",
                _key: key(),
                asset: { _type: "reference", _ref: id },
                alt: img.getAttribute("alt") || undefined,
                caption: cap?.text.trim() || undefined,
              }
              body.push(ib)
            }
          }
        }
      }
    } else if (tag === "TABLE") {
      handled.add(el)
      // Flatten table rows to text paragraphs (schema has no table type).
      for (const tr of el.querySelectorAll("tr")) {
        const cells = tr
          .querySelectorAll("td, th")
          .map((c) => c.text.replace(/\s+/g, " ").trim())
          .filter(Boolean)
        if (cells.length === 0) continue
        body.push({
          _type: "block",
          _key: key(),
          style: "normal",
          markDefs: [],
          children: [{ _type: "span", _key: key(), text: cells.join(" — "), marks: [] }],
        })
      }
    } else if (tag === "IFRAME") {
      const src = el.getAttribute("src") || ""
      if (src) videoUrls.push(src.startsWith("//") ? "https:" + src : src)
    }
  }

  // excerpt: first non-empty normal paragraph, capped
  const firstP = body.find((b) => b._type === "block" && (b as Block).style === "normal") as
    | Block
    | undefined
  const excerpt =
    seoDescription ||
    (firstP ? firstP.children.map((c) => c.text).join("").slice(0, 200) : "")

  return {
    slug,
    title,
    seoTitle: title,
    seoDescription,
    excerpt,
    author,
    publishedAt,
    coverUrl,
    category,
    body,
    videoUrls: [...new Set(videoUrls)],
    imageUrls,
  }
}

async function ensureCategory(label: string): Promise<string> {
  const slug = slugify(label)
  const id = `blogCategory-${slug}`
  if (WRITE) {
    await writeClient.createIfNotExists({
      _id: id,
      _type: "blogCategory",
      title: label,
      slug: { _type: "slug", current: slug },
    })
  }
  return id
}

async function upsert(e: Extracted): Promise<void> {
  const docId = `blog-wix-${e.slug}`
  let coverAsset: string | null = null
  if (WRITE && e.coverUrl) coverAsset = await uploadImage(e.coverUrl, `${e.slug}-cover`)
  const catId = await ensureCategory(e.category)

  const doc: Record<string, unknown> = {
    _id: docId,
    _type: "blogPost",
    title: e.title,
    slug: { _type: "slug", current: e.slug },
    publishedAt: e.publishedAt,
    author: e.author,
    excerpt: e.excerpt,
    seoTitle: e.seoTitle,
    seoDescription: e.seoDescription,
    body: e.body,
    categories: [{ _type: "reference", _key: key(), _ref: catId }],
  }
  if (e.videoUrls.length) doc.videoUrls = e.videoUrls
  if (coverAsset) {
    doc.coverImage = { _type: "image", asset: { _type: "reference", _ref: coverAsset } }
  }
  await writeClient.createOrReplace(doc as never)
}

async function main() {
  const targets = ONLY ? POSTS.filter((p) => p.slug === ONLY) : POSTS
  console.log(`${WRITE ? "WRITE" : "DRY RUN"} — ${targets.length} post(s)\n`)
  for (const { slug, category } of targets) {
    try {
      const e = await extract(slug, category)
      const blocks = e.body.filter((b) => b._type === "block").length
      const imgs = e.body.filter((b) => b._type === "image").length
      console.log(`• ${slug}`)
      console.log(`    title:   ${e.title}`)
      console.log(`    author:  ${e.author}   date: ${e.publishedAt.slice(0, 10)}`)
      console.log(`    cat:     ${e.category}`)
      console.log(`    cover:   ${e.coverUrl ? "yes" : "—"}`)
      console.log(
        `    body:    ${blocks} text blocks, ${imgs} inline images (${e.imageUrls.length} found), ${e.videoUrls.length} videos`,
      )
      console.log(`    excerpt: ${e.excerpt.slice(0, 100)}...`)
      if (WRITE) {
        await upsert(e)
        console.log(`    -> wrote blog-wix-${slug} (renders at /post/${slug})`)
      }
      console.log("")
    } catch (err) {
      console.error(`  ✗ ${slug}: ${(err as Error).message}\n`)
    }
  }
  console.log(WRITE ? "Done." : "Dry run complete. Re-run with --write to publish.")
}

main()
