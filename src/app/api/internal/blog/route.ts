import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { INTERNAL_COOKIE, verifyToken } from "@/lib/internalAuth"
import { upsertBlogPost, uploadImageAsset } from "@/lib/sanityWriteClient"

export const runtime = "nodejs"
export const maxDuration = 60

const MAX_IMAGE_BYTES = 8 * 1024 * 1024

// Mirror of the `industry` enum in src/sanity/schemas/blogPost.ts.
const ALLOWED_INDUSTRIES = new Set([
  "construction",
  "hr",
  "real-estate",
  "marketing",
  "saas",
  "professional-services",
  "manufacturing",
  "product",
])

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 90) || "post"
  )
}

/**
 * Publish/update a blog post from the internal portal.
 *
 * Auth: the same shared-session cookie that gates the rest of /internal
 * (see src/lib/internalAuth.ts). This is defence-in-depth — the portal pages
 * also gate server-side. When the portal moves to Supabase/Google SSO, only
 * this check changes; the write path below is unaffected.
 *
 * All Sanity writes go through the single SANITY_WRITE_TOKEN (inside
 * upsertBlogPost), so no writer needs a paid Sanity seat.
 */
export async function POST(req: Request) {
  const token = (await cookies()).get(INTERNAL_COOKIE)?.value
  if (!verifyToken(token)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 })
  }

  const title = String(form.get("title") ?? "").trim()
  const body = String(form.get("body") ?? "").trim()
  const slugInput = String(form.get("slug") ?? "").trim()
  const excerpt = String(form.get("excerpt") ?? "").trim()
  const industry = String(form.get("industry") ?? "").trim()
  const author = String(form.get("author") ?? "").trim()
  const seoTitle = String(form.get("seoTitle") ?? "").trim()
  const seoDescription = String(form.get("seoDescription") ?? "").trim()
  const publishedAt = String(form.get("publishedAt") ?? "").trim()
  // Editing an existing post: pass its docId so the write updates in place.
  const docIdInput = String(form.get("docId") ?? "").trim()
  // categoryIds may arrive as repeated fields or a comma-separated string.
  const categoryIds = [
    ...form.getAll("categoryIds").map((v) => String(v)),
    ...String(form.get("categoryIds") ?? "").split(","),
  ]
    .map((s) => s.trim())
    .filter(Boolean)
  const cover = form.get("coverImage")

  if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 })
  if (!body) return NextResponse.json({ error: "Body is required." }, { status: 400 })
  if (industry && !ALLOWED_INDUSTRIES.has(industry)) {
    return NextResponse.json({ error: "Invalid industry." }, { status: 400 })
  }
  if (publishedAt && Number.isNaN(Date.parse(publishedAt))) {
    return NextResponse.json({ error: "Invalid publish date." }, { status: 400 })
  }

  const slug = slugInput ? slugify(slugInput) : slugify(title)

  // Optional cover image.
  let coverImageAssetId: string | undefined
  if (cover instanceof File && cover.size > 0) {
    if (!cover.type.startsWith("image/")) {
      return NextResponse.json({ error: "Cover image must be an image." }, { status: 400 })
    }
    if (cover.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Cover image exceeds 8 MB limit." }, { status: 413 })
    }
    try {
      const bytes = Buffer.from(await cover.arrayBuffer())
      coverImageAssetId = await uploadImageAsset(bytes, cover.type, `blog-${slug}`)
    } catch (err) {
      return NextResponse.json(
        { error: `Cover image upload failed: ${err instanceof Error ? err.message : String(err)}` },
        { status: 502 },
      )
    }
  }

  // Stable, slug-derived id so re-publishing the same post updates in place.
  const docId = docIdInput || `blog-portal-${slug}`

  try {
    const result = await upsertBlogPost({
      docId,
      title,
      body,
      slug,
      excerpt: excerpt || undefined,
      industry: industry || undefined,
      author: author || undefined,
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
      categoryIds: categoryIds.length ? categoryIds : undefined,
      coverImageAssetId,
      publishedAt: publishedAt || undefined,
    })
    return NextResponse.json({ ok: true, id: result.id, slug: result.slug })
  } catch (err) {
    return NextResponse.json(
      { error: `Publish failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    )
  }
}
