import { getPageBySlug } from "@/sanity/queries"
import { GOVERNING_DOCS } from "../documents"

interface SanityDoc {
  _key?: string
  fileUrl?: string
}

/**
 * Serve each governing PDF at /terms-and-conditions/<slug>, streaming the bytes
 * from the file attached to the matching Sanity item. Keeps the public URL clean
 * and on-domain while the PDF itself stays managed in the Sanity CMS.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params

  const doc = GOVERNING_DOCS.find((d) => d.slug === file)
  if (!doc) {
    return new Response("Not found", { status: 404 })
  }

  const page = await getPageBySlug("terms-and-conditions")
  const match = (page?.documents as SanityDoc[] | undefined)?.find(
    (d) => d._key === doc.key
  )
  if (!match?.fileUrl) {
    return new Response("Not found", { status: 404 })
  }

  const upstream = await fetch(match.fileUrl)
  if (!upstream.ok || !upstream.body) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${doc.slug}"`,
      // Cache at the edge for an hour; swapping the PDF in Sanity goes live within that window.
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
