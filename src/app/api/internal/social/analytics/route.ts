import { NextResponse } from "next/server"
import { getPortalApiUser } from "@/lib/portalAuth"
import { fetchAnalytics } from "@/lib/social/zernio"

export const runtime = "nodejs"
export const maxDuration = 60

/**
 * Engagement for everything Zernio can see — impressions, reach, likes,
 * comments, shares, clicks, engagement rate — per published post.
 *
 * Worth knowing: this feed includes posts published straight to the platforms,
 * not just the ones we sent. Rows carry `external: true` in that case, and
 * `postId` (Zernio's `latePostId`) is set only for posts we own, which is what
 * the dashboard joins on.
 */
export async function GET() {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  if (!process.env.ZERNIO_API_KEY) {
    return NextResponse.json({ error: "Zernio is not configured (ZERNIO_API_KEY missing)." }, { status: 501 })
  }
  try {
    return NextResponse.json(await fetchAnalytics(100))
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to load analytics: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    )
  }
}
