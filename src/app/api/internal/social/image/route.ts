import { NextResponse } from "next/server"
import { getPortalApiUser } from "@/lib/portalAuth"
import { uploadImageAsset } from "@/lib/sanityWriteClient"
import { imageRefToUrl } from "@/lib/portableTextToMarkdown"

export const runtime = "nodejs"
export const maxDuration = 60

/** Google Business is the tightest of the channels we post to. */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

/**
 * Upload an image for a standalone social post.
 *
 * Assets go to Sanity — not just for somewhere to put them, but because
 * instagramSafeImageUrl() can only crop `cdn.sanity.io` URLs into Instagram's
 * accepted aspect range. An image hosted anywhere else fails IG publishing with
 * no useful error, so this route is the only supported way in.
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
    return NextResponse.json(
      { error: "Image is over 5 MB — Google Business rejects anything larger." },
      { status: 413 },
    )
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
    const assetId = await uploadImageAsset(bytes, image.type, `social-${stem}`)
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
