import { NextResponse } from "next/server"
import { getPortalApiUser } from "@/lib/portalAuth"
import { uploadImageAsset } from "@/lib/sanityWriteClient"
import { imageRefToUrl } from "@/lib/portableTextToMarkdown"
import { fetchRemoteImage, isSanityImageUrl } from "@/lib/remoteImage"

export const runtime = "nodejs"
export const maxDuration = 60

const MAX_IMAGE_BYTES = 8 * 1024 * 1024

/** Turn image bytes into a Sanity CDN URL the editor can insert. */
async function store(bytes: Buffer, mime: string, stem: string) {
  const assetId = await uploadImageAsset(bytes, mime, `blog-body-${stem}`)
  const url = imageRefToUrl(assetId)
  if (!url) throw new Error(`unexpected asset id from Sanity: ${assetId}`)
  return url
}

/**
 * Upload a body image for the internal blog editor.
 *
 * Two ways in, because there are three ways to add an image: the toolbar
 * button and a drag-and-drop both hand over a file (multipart), while a paste
 * or a drag from another browser tab often carries only a URL (JSON
 * `{ url }`), which the server fetches and re-hosts.
 *
 * Either way the asset goes to Sanity (same SANITY_WRITE_TOKEN as covers) and
 * the response returns its public CDN URL. The editor inserts it as a lone
 * `![alt](url)` markdown line, which bodyToPortableText converts into a
 * Sanity `image` block on publish.
 */
export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  // URL mode: re-host an image that lives somewhere else.
  if (req.headers.get("content-type")?.includes("application/json")) {
    const body = (await req.json().catch(() => null)) as { url?: string } | null
    const src = body?.url?.trim()
    if (!src) return NextResponse.json({ error: "Image URL is required." }, { status: 400 })
    // Already ours — hand it straight back rather than duplicating the asset.
    if (isSanityImageUrl(src)) return NextResponse.json({ ok: true, url: src })
    try {
      const remote = await fetchRemoteImage(src)
      return NextResponse.json({ ok: true, url: await store(remote.bytes, remote.mime, remote.stem) })
    } catch (err) {
      return NextResponse.json(
        { error: `Could not copy that image: ${err instanceof Error ? err.message : String(err)}` },
        { status: 502 },
      )
    }
  }

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
    return NextResponse.json({ ok: true, url: await store(bytes, image.type, stem) })
  } catch (err) {
    return NextResponse.json(
      { error: `Image upload failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    )
  }
}
