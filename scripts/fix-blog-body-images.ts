/**
 * Repair published posts whose body images render as a stray `!` plus a link.
 *
 * Before sideloadBodyImages existed, bodyToPortableText only turned a lone
 * `![alt](url)` line into an `image` block when the URL was already a Sanity
 * asset. AI drafts reference images on other CDNs, so those lines published as
 * a literal `!` followed by a link — reported on monday item 2836162069.
 *
 * This walks every blogPost, finds blocks with that shape, pulls the image
 * into Sanity and swaps the block for a real `image` block.
 *
 *   npx tsx scripts/fix-blog-body-images.ts            # dry run
 *   npx tsx scripts/fix-blog-body-images.ts --apply    # write to Sanity
 *
 * Needs SANITY_WRITE_TOKEN (plus the NEXT_PUBLIC_SANITY_* vars) in the env.
 */

import { uploadImageAsset, patchDocument } from "@/lib/sanityWriteClient"
import { fetchRemoteImage, isSanityImageUrl } from "@/lib/remoteImage"

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"

const APPLY = process.argv.includes("--apply")

interface Span {
  _type?: string
  _key?: string
  text?: string
  marks?: string[]
}
interface MarkDef {
  _key: string
  _type: string
  href?: string
}
interface Block {
  _type: string
  _key: string
  style?: string
  children?: Span[]
  markDefs?: MarkDef[]
}
interface Post {
  _id: string
  slug: string | null
  title: string | null
  body: Block[] | null
}

async function query<T>(groq: string): Promise<T> {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(groq)}`
  const r = await fetch(url, { headers: { Authorization: `Bearer ${process.env.SANITY_WRITE_TOKEN}` } })
  if (!r.ok) throw new Error(`sanity query ${r.status} ${await r.text()}`)
  return ((await r.json()) as { result: T }).result
}

/**
 * A block that is really a broken image: its text is `!` followed by the alt,
 * and the alt carries a single link mark. That link's href is the image.
 */
function brokenImage(block: Block): { alt: string; href: string } | null {
  if (block._type !== "block") return null
  const children = block.children ?? []
  const text = children.map((c) => c.text ?? "").join("")
  if (!text.startsWith("!")) return null
  const linked = children.find((c) => (c.marks ?? []).length > 0)
  if (!linked) return null
  const def = (block.markDefs ?? []).find(
    (d) => d._type === "link" && (linked.marks ?? []).includes(d._key),
  )
  if (!def?.href) return null
  // The `!` plus the link text should be the whole block — otherwise it is a
  // sentence that happens to start with an exclamation mark.
  if (text.replace(/^!/, "").trim() !== (linked.text ?? "").trim()) return null
  return { alt: (linked.text ?? "").trim(), href: def.href }
}

async function main() {
  if (!PROJECT_ID || !DATASET) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID / _DATASET missing")
  if (!process.env.SANITY_WRITE_TOKEN) throw new Error("SANITY_WRITE_TOKEN missing")

  const posts = await query<Post[]>(
    `*[_type == "blogPost"]{ _id, "slug": slug.current, title, body }`,
  )
  console.log(`scanned ${posts.length} posts${APPLY ? "" : "  (dry run — pass --apply to write)"}`)

  // The same stock image shows up across posts; upload it once.
  const hosted = new Map<string, string | null>()
  let postsFixed = 0
  let imagesFixed = 0
  let failures = 0

  for (const post of posts) {
    if (!post.body) continue
    const hits = post.body.map(brokenImage)
    if (!hits.some(Boolean)) continue

    console.log(`\n${post.slug ?? post._id}`)
    const nextBody: Block[] = []
    let changed = false

    for (let i = 0; i < post.body.length; i++) {
      const hit = hits[i]
      if (!hit) {
        nextBody.push(post.body[i])
        continue
      }
      if (isSanityImageUrl(hit.href)) {
        // Already ours — nothing to fetch, but still needs to become a block.
        console.log(`  ~ already on our CDN: ${hit.href}`)
      }
      if (!hosted.has(hit.href)) {
        try {
          const remote = await fetchRemoteImage(hit.href)
          const assetId = APPLY
            ? await uploadImageAsset(remote.bytes, remote.mime, `blog-body-${remote.stem}`)
            : `image-DRYRUN-${remote.stem}`
          hosted.set(hit.href, assetId)
          console.log(`  + ${remote.mime} ${(remote.bytes.byteLength / 1024).toFixed(0)} KB  ${hit.href}`)
        } catch (err) {
          hosted.set(hit.href, null)
          failures++
          console.log(`  ! ${hit.href} — ${err instanceof Error ? err.message : String(err)}`)
        }
      }
      const assetId = hosted.get(hit.href)
      if (!assetId) {
        // Could not re-host: leave the block alone rather than lose the link.
        nextBody.push(post.body[i])
        continue
      }
      nextBody.push({
        _type: "image",
        _key: post.body[i]._key,
        ...({ asset: { _type: "reference", _ref: assetId } } as object),
        ...(hit.alt ? { alt: hit.alt } : {}),
      } as Block)
      imagesFixed++
      changed = true
    }

    if (!changed) continue
    postsFixed++
    if (APPLY) {
      await patchDocument(post._id, { body: nextBody })
      console.log(`  → patched ${post._id}`)
    }
  }

  console.log(
    `\n${APPLY ? "fixed" : "would fix"} ${imagesFixed} images across ${postsFixed} posts` +
      (failures ? `; ${failures} could not be fetched` : ""),
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
