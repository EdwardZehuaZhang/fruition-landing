import { NextResponse } from "next/server"
import { getPortalApiUser } from "@/lib/portalAuth"
import { platformSpec, unpublishZernioPost, type PlatformKey } from "@/lib/social/zernio"

export const runtime = "nodejs"

/**
 * Delete a live social post from its platform via Zernio's unpublish endpoint
 * (the Zernio record stays, status → "cancelled", so it can be edited and
 * republished from the blog's Social tab). Instagram is not supported —
 * platform limitation, the API refuses before calling Zernio.
 *
 * Body: { postId, platform } (Zernio platform string) or { postId, key }
 * (our PlatformKey — used by the blog panel).
 */
export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  let body: { postId?: string; platform?: string; key?: PlatformKey }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }
  const postId = (body.postId ?? "").trim()
  let platform = (body.platform ?? "").trim()
  if (!platform && body.key) {
    try {
      platform = platformSpec(body.key).platform
    } catch {
      return NextResponse.json({ error: "Unknown platform key." }, { status: 400 })
    }
  }
  if (!postId || !platform) {
    return NextResponse.json({ error: "Missing postId or platform." }, { status: 400 })
  }

  try {
    await unpublishZernioPost(postId, platform)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { error: `Unpublish failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    )
  }
}
