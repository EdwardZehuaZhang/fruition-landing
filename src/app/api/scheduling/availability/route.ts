import { NextResponse } from "next/server"
import { poolFor } from "@/lib/consultants"
import { getConsultantSlots } from "@/lib/consultantAvailability"
import { detectRegion } from "@/lib/leadNotify"
import { getTeamMemberByName } from "@/sanity/queries"

export const runtime = "nodejs"
export const maxDuration = 30

/**
 * Live consultation slots for the visitor's region, read from the real
 * calendars of everyone who covers it (see consultantAvailability). Region
 * comes from Cloudflare's cf-ipcountry; slots are UTC and the client renders
 * them in the visitor's timezone.
 *
 * Each slot names its host, and every host in the pool is returned with photo
 * and role, so the card can show whoever owns the slot the visitor picks
 * without a second round trip.
 *
 * The region is echoed back so the booking step targets the same people the
 * slots came from — deriving it twice from different inputs is how the old flow
 * ended up offering APAC slots and then booking against SEA.
 */
export async function GET(req: Request) {
  const country = req.headers.get("cf-ipcountry") ?? undefined
  // The browser's own timezone, as a fallback for when cf-ipcountry is absent:
  // local dev, VPNs, and the "XX"/"T1" placeholders Cloudflare sends for some
  // networks. Without it a Singapore visitor with no geo header falls all the
  // way through to the APAC default and is shown the wrong consultant.
  // detectRegion still prefers the country header when it has one, so a real
  // geo signal always beats a client-supplied string.
  const tz = (new URL(req.url).searchParams.get("tz") ?? "").slice(0, 64)
  const region = detectRegion({ country, timezone: tz || undefined })
  const pool = poolFor(region)

  // Photos and roles come from the same Sanity records as /fruition-team, so
  // the face on the booking card is the one the visitor sees elsewhere on the
  // site. Best-effort per person: a missing photo falls back to initials in the
  // UI, and never costs the visitor their slots.
  const consultants = await Promise.all(
    pool.map(async (c) => {
      let photoUrl: string | null = null
      let role: string | null = null
      try {
        const member = (await getTeamMemberByName(c.name)) as
          | { photoUrl?: string | null; role?: string | null }
          | null
        photoUrl = member?.photoUrl ?? null
        role = member?.role ?? null
      } catch (err) {
        console.warn(
          `[scheduling] consultant profile failed (${c.key}):`,
          err instanceof Error ? err.message : String(err),
        )
      }
      return { key: c.key, name: c.name, firstName: c.firstName, calendlyUrl: c.calendlyUrl, photoUrl, role }
    }),
  )

  const payload = { region, consultants }
  // The booking embed only needs to know whose calendar to show. Computing
  // slots as well would mean five live Calendly round trips per page view for
  // data nothing renders.
  if (new URL(req.url).searchParams.get("host") === "1") {
    return NextResponse.json(payload, { headers: { "Cache-Control": "private, max-age=300" } })
  }
  try {
    const slots = await getConsultantSlots(region)
    return NextResponse.json(
      { ...payload, slots },
      { headers: { "Cache-Control": "private, max-age=120" } },
    )
  } catch (err) {
    console.error("[scheduling] availability failed:", err instanceof Error ? err.message : String(err))
    return NextResponse.json({ ...payload, slots: [], error: "unavailable" }, { status: 502 })
  }
}
