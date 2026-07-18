import { NextResponse } from "next/server"
import { getPortalApiUser } from "@/lib/portalAuth"
import { uploadImageAsset } from "@/lib/sanityWriteClient"
import { imageRefToUrl } from "@/lib/portableTextToMarkdown"

export const runtime = "nodejs"
export const maxDuration = 60

const MAX_IMAGE_BYTES = 8 * 1024 * 1024

/**
 * Upload a body image for the internal blog editor.
 *
 * The asset goes straight to Sanity (same SANITY_WRITE_TOKEN as covers) and
 * the response returns its public CDN URL. The editor inserts it as a lone
 * `![alt](url)` markdown line, which bodyToPortableText converts into a
 * Sanity `image` block on publish.
 */
export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 })
  }

  const image = form.get("image")
  if (!(image instanceof File) || image.size === 0) {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 })
  }
  if (!image.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image." }, { status: 400 })
  }
  if (image.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Image exceeds 8 MB limit." }, { status: 413 })
  }

  const stem =
    (image.name || "image")
      .replace(/\.[a-z0-9]+$/i, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image"

  try {
    const bytes = Buffer.from(await image.arrayBuffer())
    const assetId = await uploadImageAsset(bytes, image.type, `blog-body-${stem}`)
    const url = imageRefToUrl(assetId)
    if (!url) throw new Error(`unexpected asset id from Sanity: ${assetId}`)
    return NextResponse.json({ ok: true, url })
  } catch (err) {
    return NextResponse.json(
      { error: `Image upload failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    )
  }
}
