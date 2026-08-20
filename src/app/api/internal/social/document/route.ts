import { NextResponse } from "next/server"
import { getPortalApiUser } from "@/lib/portalAuth"
import { uploadFileAsset } from "@/lib/sanityWriteClient"

export const runtime = "nodejs"
export const maxDuration = 120

/**
 * Upload a document for a LinkedIn carousel post.
 *
 * LinkedIn renders a PDF (or PPT/DOC, which it converts) as a swipeable
 * carousel — the format the marketing team actually wants for a one-pager or
 * a deck. Zernio attaches it by URL, so the file goes to Sanity's public file
 * assets, the same store the social images use.
 *
 * LinkedIn's own ceiling is 100 MB / 300 pages; this route stops well short of
 * it because the request has to survive the Worker in front of us, and a
 * carousel nobody will swipe through 90 MB of isn't the point.
 */
const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024

const ALLOWED: Record<string, string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/msword": "doc",
}

export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 })
  }

  const file = form.get("document")
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "A file is required." }, { status: 400 })
  }

  const ext = ALLOWED[file.type] ?? (file.name.toLowerCase().endsWith(".pdf") ? "pdf" : "")
  if (!ext) {
    return NextResponse.json(
      { error: "LinkedIn carousels take a PDF (or a PowerPoint / Word file it converts)." },
      { status: 415 },
    )
  }
  if (file.size > MAX_DOCUMENT_BYTES) {
    return NextResponse.json(
      { error: `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB — keep it under 25 MB.` },
      { status: 413 },
    )
  }

  const name = (file.name || `document.${ext}`).replace(/[\r\n"]/g, "").slice(0, 120)
  const stem =
    name
      .replace(/\.[a-z0-9]+$/i, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "document"

  try {
    const bytes = Buffer.from(await file.arrayBuffer())
    const { url } = await uploadFileAsset(bytes, file.type || "application/pdf", `social-${stem}.${ext}`)
    // The carousel title LinkedIn shows: the writer's filename, not our slug.
    return NextResponse.json({ ok: true, url, name: name.replace(/\.[a-z0-9]+$/i, "") })
  } catch (err) {
    return NextResponse.json(
      { error: `Upload failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    )
  }
}
