import { NextResponse } from "next/server"
import { getAvailableSlots } from "@/lib/calendlyClient"
import { detectRegion } from "@/lib/leadNotify"

export const runtime = "nodejs"
export const maxDuration = 30

/**
 * Available consultation slots for the visitor's region (via Cloudflare's
 * cf-ipcountry header). Slots are UTC; the client renders them in the
 * visitor's timezone.
 */
export async function GET(req: Request) {
  const country = req.headers.get("cf-ipcountry") ?? undefined
  const region = detectRegion({ country })
  try {
    const slots = await getAvailableSlots(region)
    return NextResponse.json(
      { region, slots },
      { headers: { "Cache-Control": "private, max-age=120" } },
    )
  } catch (err) {
    console.error("[scheduling] availability failed:", err instanceof Error ? err.message : String(err))
    return NextResponse.json({ region, slots: [], error: "unavailable" }, { status: 502 })
  }
}
