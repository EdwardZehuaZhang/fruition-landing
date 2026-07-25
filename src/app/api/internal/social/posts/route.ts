import { NextResponse } from "next/server"
import { getPortalApiUser } from "@/lib/portalAuth"
import { deleteZernioPost, listZernioPosts, type ZernioPost } from "@/lib/social/zernio"

export const runtime = "nodejs"
export const maxDuration = 60

/**
 * All Zernio posts for the /internal/social dashboard, flattened into rows
 * the client can search/filter. Legacy posts (pre per-platform era) can span
 * several platforms — their entries are listed together on one row.
 */

export interface SocialRowPlatform {
  platform: string
  account: string
  status?: string
  url?: string
}

export interface SocialRow {
  id: string
  createdAt?: string
  scheduledFor?: string
  status: string
  title?: string
  content: string
  mediaUrl?: string
  platforms: SocialRowPlatform[]
  /** Link back to the blog it was generated from, when known. */
  source?: { slug?: string; draftId?: string; docId?: string }
}

function toRow(post: ZernioPost): SocialRow {
  const meta = (post.metadata ?? {}) as Record<string, unknown>
  const str = (v: unknown) => (typeof v === "string" && v ? v : undefined)
  const source = {
    slug: str(meta.marketaSlug),
    draftId: str(meta.marketaDraftId),
    docId: str(meta.marketaDocId),
  }
  return {
    id: post._id,
    createdAt: post.createdAt,
    scheduledFor: post.scheduledFor,
    status: post.status,
    title: post.title,
    content: post.content ?? "",
    mediaUrl: post.mediaItems?.find((m) => m.type === "image")?.url,
    platforms: (post.platforms ?? []).map((p) => {
      const account = typeof p.accountId === "object" && p.accountId ? p.accountId : undefined
      const accountObj = account as { displayName?: string; username?: string } | undefined
      return {
        platform: p.platform,
        account: accountObj?.username || accountObj?.displayName || p.platform,
        status: p.status,
        url: p.platformPostUrl,
      }
    }),
    source: source.slug || source.draftId || source.docId ? source : undefined,
  }
}

export async function GET() {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  if (!process.env.ZERNIO_API_KEY) {
    return NextResponse.json({ error: "Zernio is not configured (ZERNIO_API_KEY missing)." }, { status: 501 })
  }
  try {
    const posts = await listZernioPosts(200)
    return NextResponse.json({ rows: posts.map(toRow) })
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to load posts: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    )
  }
}

/**
 * Delete a Zernio RECORD (drafts, failed, cancelled — cleanup). This never
 * touches live platform posts; published rows must be unpublished instead,
 * and the API refuses them so a live post can't be orphaned by accident.
 */
export async function DELETE(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 })

  try {
    const posts = await listZernioPosts(200)
    const post = posts.find((p) => p._id === id)
    if (post?.status === "published") {
      return NextResponse.json(
        { error: "This post is live — use Unpublish to remove it from the platform first." },
        { status: 409 },
      )
    }
    await deleteZernioPost(id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { error: `Delete failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    )
  }
}
