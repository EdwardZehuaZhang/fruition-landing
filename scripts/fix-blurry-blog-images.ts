/**
 * Repair blog images that were scraped at placeholder resolution.
 *
 * WHAT WENT WRONG
 * Wix server-renders `<img src>` with a lazy-load placeholder — a 49px or 147px
 * crop with a gaussian blur baked in. `import-blog.ts` and `migrate-blog-images.ts`
 * uploaded that `src` verbatim, so ~100 body images across the older posts are
 * stored in Sanity at 147x83 and rendered into a 740px slot. That is the blur.
 *
 * WHY IT IS RECOVERABLE
 * A Wix placeholder URL still names the same media id, and stripping the
 * `/v1/<transform>/` segment makes Wix serve the full-resolution upload (see
 * src/lib/wixImage.ts). So the repair is: find the original URL, strip the
 * transform, re-upload, re-point the reference. Two ways to find that URL:
 *
 *   1. `coverImageUrl` — the migration kept the Wix URL on 214 posts. Covers only.
 *   2. An archived copy of the Wix post page. Defaults to the Wayback Machine,
 *      pinned to before the site moved off Wix; `--source-base` points at a
 *      still-live Wix host instead.
 *
 * SAFETY
 * Read-only by default. A replacement is only written when the re-fetched image
 * decodes and is meaningfully wider than what is already there, so a failed
 * recovery can never downgrade a post. Alt text, captions and `_key`s are
 * preserved — only `asset._ref` moves.
 *
 * USAGE
 *   npx tsx scripts/fix-blurry-blog-images.ts                    # audit, no network beyond Sanity
 *   npx tsx scripts/fix-blurry-blog-images.ts --plan             # audit + resolve replacements, no writes
 *   npx tsx scripts/fix-blurry-blog-images.ts --apply            # resolve, upload, patch Sanity
 *   npx tsx scripts/fix-blurry-blog-images.ts --plan --only ai-call-recording-apps
 *   npx tsx scripts/fix-blurry-blog-images.ts --apply --target 1480 --report out.json
 *
 * FLAGS
 *   --plan | --apply     resolve replacements / also write them (default: audit only)
 *   --only <slug>        restrict to one post
 *   --target <px>        width a blog image needs to be sharp (default 1480 = 740 @2x)
 *   --limit <n>          stop after n posts that need work
 *   --source-base <url>  scrape this origin instead of the Wayback Machine
 *   --before <YYYYMMDD>  newest archive snapshot to consider (default 20260301)
 *   --delay <ms>         pause between upstream requests (default 1200)
 *   --report <path>      write the full findings as JSON
 *
 * Needs SANITY_WRITE_TOKEN in .env.local for --apply; audit only needs read access.
 */
import { parse } from "node-html-parser"
import type { HTMLElement } from "node-html-parser"
import { writeClient } from "./sanity-client.js"
import { imageSize } from "../src/lib/imageSize.js"
import { parseWixMediaUrl, wixOriginalUrl } from "../src/lib/wixImage.js"

// ---------------------------------------------------------------- CLI

const argv = process.argv.slice(2)
const has = (flag: string) => argv.includes(flag)
function opt(flag: string, fallback: string): string {
  const i = argv.indexOf(flag)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback
}

if (has("--help") || has("-h")) {
  console.log(
    [
      "fix-blurry-blog-images — re-fetch blog images that were scraped at placeholder size",
      "",
      "  --plan | --apply     resolve replacements / also write them (default: audit only)",
      "  --only <slug>        restrict to one post",
      "  --target <px>        sharpness target (default 1480 = the 740px slot at 2x)",
      "  --limit <n>          stop after n posts that need work",
      "  --source-base <url>  scrape this origin instead of the Wayback Machine",
      "  --before <YYYYMMDD>  newest archive snapshot to consider (default 20260301)",
      "  --delay <ms>         pause between upstream requests (default 1200)",
      "  --report <path>      write the full findings as JSON",
    ].join("\n"),
  )
  process.exit(0)
}

const APPLY = has("--apply")
const PLAN = APPLY || has("--plan")
const ONLY = opt("--only", "")
const TARGET = Number(opt("--target", "1480"))
const LIMIT = Number(opt("--limit", "0"))
const SOURCE_BASE = opt("--source-base", "").replace(/\/+$/, "")
const BEFORE = opt("--before", "20260301")
const DELAY = Number(opt("--delay", "1200"))
const REPORT = opt("--report", "")

/** The blog body column is 740px wide; below that an image is soft even at 1x. */
const SLOT_WIDTH = 740

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ---------------------------------------------------------------- types

interface SanityImage {
  assetId: string | null
  width: number | null
  height: number | null
  filename: string | null
}
interface BodyImage extends SanityImage {
  key: string
  alt: string | null
}
interface Post {
  _id: string
  slug: string | null
  title: string | null
  coverImageUrl: string | null
  cover: SanityImage | null
  bodyImages: BodyImage[] | null
}

type SlotKind = "cover" | "body"

interface Slot {
  kind: SlotKind
  /** Position among the post's body images, 1-based, as the scraper saw them. */
  index: number
  key?: string
  alt: string
  width: number
  height: number
  filename: string | null
  /** Sanity patch path for this slot's asset reference. */
  path: string
}

interface Finding extends Slot {
  postId: string
  slug: string
  candidateUrl?: string
  candidateWidth?: number
  outcome: "sharp" | "unresolved" | "no-better-source" | "fetch-failed" | "replaceable" | "replaced"
  note?: string
}

// ---------------------------------------------------------------- helpers

/**
 * `<slug>-body-7` / `<slug>-img-3` — the scrapers numbered each body image in
 * page order, which survives even when the blocks were later reshuffled. Falls
 * back to the block's position in the body array.
 */
function scrapeIndex(filename: string | null, fallback: number): number {
  const n = filename ? /-(?:body|img)-(\d+)$/.exec(filename)?.[1] : null
  return n ? Number(n) : fallback
}

function normaliseAlt(s: string | null | undefined): string {
  return (s ?? "").toLowerCase().replace(/\s+/g, " ").trim()
}

/** Every body-image slot plus the cover, as uniform records. */
function slotsFor(post: Post): Slot[] {
  const slots: Slot[] = []
  if (post.cover?.assetId && post.cover.width) {
    slots.push({
      kind: "cover",
      index: 0,
      alt: "",
      width: post.cover.width,
      height: post.cover.height ?? 0,
      filename: post.cover.filename,
      path: "coverImage.asset._ref",
    })
  }
  ;(post.bodyImages ?? []).forEach((img, i) => {
    if (!img.assetId || !img.width) return
    slots.push({
      kind: "body",
      index: scrapeIndex(img.filename, i + 1),
      key: img.key,
      alt: img.alt ?? "",
      width: img.width,
      height: img.height ?? 0,
      filename: img.filename,
      path: `body[_key=="${img.key}"].asset._ref`,
    })
  })
  return slots
}

// ---------------------------------------------------------------- upstream

interface ArchivedPage {
  url: string
  cover: string | null
  body: { src: string; alt: string }[]
}

async function getHtml(url: string): Promise<HTMLElement | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "FruitionBlogImageRepair/1.0 (+https://fruitionservices.io)" },
      signal: AbortSignal.timeout(45000),
      redirect: "follow",
    })
    if (!res.ok) return null
    return parse(await res.text()) as unknown as HTMLElement
  } catch {
    return null
  }
}

/**
 * Newest Wayback capture of a URL at or before --before. The cutoff matters:
 * captures after the Sanity migration are of the *new* site, which already
 * serves the blurry images we are trying to replace.
 */
async function waybackSnapshot(pageUrl: string): Promise<string | null> {
  const cdx =
    "https://web.archive.org/cdx/search/cdx" +
    `?url=${encodeURIComponent(pageUrl)}` +
    `&output=json&filter=statuscode:200&filter=mimetype:text/html` +
    `&to=${BEFORE}&collapse=digest&limit=-3`
  try {
    const res = await fetch(cdx, { signal: AbortSignal.timeout(45000) })
    if (!res.ok) return null
    const rows = (await res.json()) as string[][]
    const data = rows.slice(1)
    if (data.length === 0) return null
    const timestamp = data[data.length - 1][1]
    // `id_` returns the original bytes, without Wayback's URL rewriting — so the
    // wixstatic URLs in the markup are still the real ones.
    return `https://web.archive.org/web/${timestamp}id_/${pageUrl}`
  } catch {
    return null
  }
}

/**
 * Hosts the blog may have been archived under.
 *
 * CDX keys a capture by its exact host, so `www.` and the apex are separate
 * lookups — asking for only one of them reports "no archived copy" for pages
 * that were captured under the other.
 */
const ARCHIVE_HOSTS = ["https://www.fruitionservices.io", "https://fruitionservices.io"]

/**
 * One domain-wide CDX sweep, logged before the per-post work starts.
 *
 * Answers the question a run of "no archived copy" lines cannot: is the blog
 * absent from the archive entirely, or were we asking under the wrong host?
 */
async function cdxRows(query: string): Promise<string[][] | null> {
  try {
    const res = await fetch(`https://web.archive.org/cdx/search/cdx?${query}`, {
      signal: AbortSignal.timeout(60000),
    })
    if (!res.ok) {
      console.log(`  CDX returned ${res.status}`)
      return null
    }
    const text = await res.text()
    if (!text.trim()) return []
    return (JSON.parse(text) as string[][]).slice(1)
  } catch (err) {
    console.log(`  CDX lookup failed — ${err instanceof Error ? err.message : String(err)}`)
    return null
  }
}

async function reportArchiveCoverage(): Promise<void> {
  const domain = `url=${encodeURIComponent("fruitionservices.io")}&matchType=domain&output=json&to=${BEFORE}`

  // Two queries, because one number cannot tell "never archived" apart from
  // "archived, but my filter was wrong".
  const all = await cdxRows(`${domain}&collapse=urlkey&fl=original,timestamp&limit=5000`)
  await sleep(DELAY)
  const posts = all?.filter(([original]) => original?.includes("/post/")) ?? []

  if (all === null) {
    console.log("archive coverage: unknown — the sweep itself failed, treat misses below as inconclusive")
    return
  }
  console.log(
    `archive coverage: ${all.length} distinct URLs archived on the domain at or before ${BEFORE}, ` +
      `${posts.length} of them blog posts`,
  )
  for (const [original, timestamp] of posts.slice(0, 5)) {
    console.log(`  e.g. ${timestamp}  ${original}`)
  }
  if (all.length === 0) {
    console.log("  → nothing from this domain is in the archive at all")
  } else if (posts.length === 0) {
    console.log("  → the domain was crawled but never a /post/ page; body images are unrecoverable from the archive")
  }
}

/** First archived capture of a post across every host spelling we know. */
async function findSnapshot(slug: string): Promise<string | null> {
  for (const host of ARCHIVE_HOSTS) {
    const hit = await waybackSnapshot(`${host}/post/${slug}`)
    if (hit) return hit
    await sleep(DELAY)
  }
  return null
}

/** Wix wraps images in <wow-image data-image-info='{"imageData":{"uri":"…"}}'>. */
function wowImageUri(el: HTMLElement): string | null {
  const raw = el.getAttribute("data-image-info")
  if (!raw) return null
  try {
    const info = JSON.parse(raw) as { imageData?: { uri?: string } }
    const uri = info.imageData?.uri
    return uri ? `https://static.wixstatic.com/media/${uri}` : null
  } catch {
    return null
  }
}

function bodyContainer(root: HTMLElement): HTMLElement | null {
  return (
    root.querySelector('[data-hook="post-description"]') ||
    root.querySelector(".post-description") ||
    root.querySelector('[class*="post-description"]') ||
    root.querySelector('[data-hook="post-content"]') ||
    root.querySelector("article") ||
    null
  )
}

/** Pull the cover and the ordered body images out of an archived Wix post page. */
async function fetchArchivedPage(slug: string): Promise<ArchivedPage | null> {
  const target = SOURCE_BASE ? `${SOURCE_BASE}/post/${slug}` : await findSnapshot(slug)
  if (!target) return null
  await sleep(DELAY)

  const root = await getHtml(target)
  if (!root) return null

  const og = root.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? ""
  const container = bodyContainer(root)
  const body: { src: string; alt: string }[] = []
  const seen = new Set<string>()

  if (container) {
    for (const el of container.querySelectorAll("img, wow-image")) {
      const raw =
        (el.tagName?.toLowerCase() === "wow-image" ? wowImageUri(el) : null) ??
        el.getAttribute("src") ??
        el.getAttribute("data-src") ??
        el.getAttribute("data-pin-media") ??
        ""
      const parsed = parseWixMediaUrl(raw)
      if (!parsed) continue
      if (seen.has(parsed.original)) continue
      seen.add(parsed.original)
      body.push({ src: parsed.original, alt: el.getAttribute("alt") ?? "" })
    }
  }

  return { url: target, cover: og ? wixOriginalUrl(og) : null, body }
}

/** Pick the archived image that belongs to a slot: alt text first, then order. */
function matchArchived(slot: Slot, page: ArchivedPage): string | null {
  if (slot.kind === "cover") return page.cover
  const alt = normaliseAlt(slot.alt)
  if (alt) {
    const byAlt = page.body.find((img) => normaliseAlt(img.alt) === alt)
    if (byAlt) return byAlt.src
  }
  return page.body[slot.index - 1]?.src ?? null
}

interface Downloaded {
  bytes: Buffer
  mime: string
  width: number
  height: number
}

/** Fetch a candidate and read its real dimensions before anything is written. */
async function download(url: string): Promise<Downloaded | null> {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "image/*,*/*;q=0.8",
        "User-Agent": "FruitionBlogImageRepair/1.0 (+https://fruitionservices.io)",
      },
      signal: AbortSignal.timeout(60000),
      redirect: "follow",
    })
    if (!res.ok) return null
    const mime = res.headers.get("content-type")?.split(";")[0]?.trim() ?? "image/jpeg"
    if (!mime.startsWith("image/")) return null
    const bytes = Buffer.from(await res.arrayBuffer())
    const size = imageSize(bytes)
    if (!size) return null
    return { bytes, mime, width: size.width, height: size.height }
  } catch {
    return null
  }
}

/**
 * Only swap in a replacement that is a real improvement: strictly wider, and
 * either sharp enough for the slot or a decisive jump. Stops the repair from
 * churning assets for a 5% gain.
 */
function isUpgrade(current: number, next: number): boolean {
  if (next <= current) return false
  return next >= TARGET || next >= current * 1.25
}

// ---------------------------------------------------------------- main

const QUERY = `*[_type == "blogPost" ${ONLY ? "&& slug.current == $only " : ""}] | order(publishedAt asc) {
  _id,
  "slug": slug.current,
  title,
  coverImageUrl,
  "cover": coverImage{
    "assetId": asset._ref,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "filename": asset->originalFilename
  },
  "bodyImages": body[_type == "image"]{
    "key": _key,
    alt,
    "assetId": asset._ref,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "filename": asset->originalFilename
  }
}`

async function main() {
  if (APPLY && !process.env.SANITY_WRITE_TOKEN) {
    throw new Error("--apply needs SANITY_WRITE_TOKEN in .env.local")
  }

  const posts: Post[] = await writeClient.fetch(QUERY, ONLY ? { only: ONLY } : {})
  const mode = APPLY ? "APPLY" : PLAN ? "PLAN" : "AUDIT"
  console.log(`${mode} — ${posts.length} post(s), sharpness target ${TARGET}px\n`)

  // Only meaningful when we are actually going to consult the archive.
  if (PLAN && !SOURCE_BASE) {
    await reportArchiveCoverage()
    console.log()
  }

  const findings: Finding[] = []
  let postsTouched = 0
  let replaced = 0

  for (const post of posts) {
    const slug = post.slug ?? post._id
    const slots = slotsFor(post)
    const degraded = slots.filter((s) => s.width < TARGET)
    for (const s of slots.filter((s) => s.width >= TARGET)) {
      findings.push({ ...s, postId: post._id, slug, outcome: "sharp" })
    }
    if (degraded.length === 0) continue
    if (LIMIT && postsTouched >= LIMIT) break
    postsTouched++

    const worst = Math.min(...degraded.map((s) => s.width))
    console.log(
      `${slug}\n  ${degraded.length}/${slots.length} image(s) under ${TARGET}px (smallest ${worst}px)`,
    )

    if (!PLAN) {
      for (const s of degraded) {
        findings.push({ ...s, postId: post._id, slug, outcome: "unresolved", note: "audit only" })
      }
      continue
    }

    // One archive fetch per post, and only when something actually needs it.
    const needsArchive = degraded.some((s) => s.kind === "body" || !post.coverImageUrl)
    const page = needsArchive ? await fetchArchivedPage(slug) : null
    if (needsArchive && !page) console.log(`  ! no archived copy of /post/${slug}`)

    const patch: Record<string, string> = {}

    for (const slot of degraded) {
      const finding: Finding = { ...slot, postId: post._id, slug, outcome: "unresolved" }
      findings.push(finding)

      const label = slot.kind === "cover" ? "cover" : `body #${slot.index}`
      const stored =
        slot.kind === "cover" && post.coverImageUrl ? wixOriginalUrl(post.coverImageUrl) : null
      const candidate = stored ?? (page ? matchArchived(slot, page) : null)

      if (!candidate) {
        console.log(`  - ${label} ${slot.width}px — no source found`)
        continue
      }
      finding.candidateUrl = candidate

      await sleep(DELAY)
      const got = await download(candidate)
      if (!got) {
        finding.outcome = "fetch-failed"
        console.log(`  ! ${label} ${slot.width}px — could not fetch ${candidate}`)
        continue
      }
      finding.candidateWidth = got.width

      if (!isUpgrade(slot.width, got.width)) {
        finding.outcome = "no-better-source"
        console.log(`  = ${label} ${slot.width}px — source is only ${got.width}px, leaving it`)
        continue
      }

      if (!APPLY) {
        finding.outcome = "replaceable"
        console.log(`  ✓ ${label} ${slot.width}px → ${got.width}px available`)
        continue
      }

      const filename = slot.filename ?? `${slug}-${slot.kind}-${slot.index}`
      const asset = await writeClient.assets.upload("image", got.bytes, {
        filename,
        contentType: got.mime,
      })
      patch[slot.path] = asset._id
      finding.outcome = "replaced"
      replaced++
      console.log(`  ✓ ${label} ${slot.width}px → ${got.width}px uploaded`)
    }

    if (APPLY && Object.keys(patch).length > 0) {
      await writeClient.patch(post._id).set(patch).commit()
      console.log(`  → patched ${post._id} (${Object.keys(patch).length} image(s))`)
    }
  }

  // ------------------------------------------------------------ summary

  const blog = findings.filter((f) => f.outcome !== "sharp")
  const byOutcome = (o: Finding["outcome"]) => blog.filter((f) => f.outcome === o).length
  const belowSlot = blog.filter((f) => f.width < SLOT_WIDTH).length

  console.log("\n─────────────────────────────────────────")
  console.log(`images checked          ${findings.length}`)
  console.log(`under ${TARGET}px target     ${blog.length}`)
  console.log(`  visibly blurry (<${SLOT_WIDTH}px) ${belowSlot}`)
  if (PLAN) {
    console.log(`recoverable             ${byOutcome("replaceable") + byOutcome("replaced")}`)
    console.log(`already the best source ${byOutcome("no-better-source")}`)
    console.log(`fetch failed            ${byOutcome("fetch-failed")}`)
    console.log(`no source found         ${byOutcome("unresolved")}`)
  }
  if (APPLY) console.log(`\nreplaced ${replaced} image(s)`)
  else console.log(`\nno writes made — re-run with --apply once the plan looks right`)

  if (REPORT) {
    const { writeFile } = await import("node:fs/promises")
    await writeFile(
      REPORT,
      JSON.stringify({ target: TARGET, mode, totals: { checked: findings.length, degraded: blog.length, belowSlot }, findings }, null, 2),
    )
    console.log(`report written to ${REPORT}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
