import { poolFor, schedulerTestMode } from "@/lib/consultants"
import type { LeadRegion } from "@/lib/leadNotify"

/**
 * Live availability for a region's consultant, read from the endpoint
 * Calendly's own booking page uses.
 *
 * Why not the v2 API: it only serves event types the token owns, and these are
 * five separate personal accounts — a token that doesn't own one gets
 * "Permission Denied" (verified 2026-07-31). This endpoint needs no auth and
 * returns the same conflict-checked availability the visitor would see on
 * calendly.com, so the picker reflects the consultant's real calendar rather
 * than the shared account's imaginary one.
 *
 * The trade-off is that it's undocumented. Everything here is therefore
 * defensive: failures return an empty list, the caller degrades to sending the
 * visitor to Calendly's own page, and results are cached so a busy page
 * doesn't hammer it.
 */

const BOOKING_API = "https://calendly.com/api/booking"

/** Calendly answers the default fetch/urllib User-Agent with 403. */
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"

/**
 * The endpoint rejects a span much over a month with "this calendar is
 * currently unavailable", so the horizon is fetched as two windows. 28 days
 * each covers ~8 weeks, comfortably past every consultant's booking window
 * (Zach's is the shortest at 21 days).
 */
const WINDOW_DAYS = 28
const HORIZON_WINDOWS = 2

/** Availability moves slowly; a short cache keeps a popular page off Calendly. */
const CACHE_TTL_MS = 5 * 60 * 1000
// Keyed by region *and* test mode, so toggling the flag never serves the
// other mode's cached slots.
const cache = new Map<string, { at: number; slots: ConsultantSlot[] }>()

/** A bookable time, and which consultant in the region's pool owns it. */
export interface ConsultantSlot {
  /** UTC ISO start */
  start: string
  /** Consultant.key */
  host: string
}

interface RangeResponse {
  days?: { date?: string; status?: string; spots?: { status?: string; start_time?: string }[] }[]
  failure?: { error?: string }
}

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10)
}

async function fetchWindow(uuid: string, tz: string, start: Date, end: Date): Promise<string[]> {
  const url =
    `${BOOKING_API}/event_types/${uuid}/calendar/range` +
    `?timezone=${encodeURIComponent(tz)}&diagnostics=false` +
    `&range_start=${ymd(start)}&range_end=${ymd(end)}`
  const r = await fetch(url, { headers: { Accept: "application/json", "User-Agent": UA } })
  if (!r.ok) throw new Error(`calendly range HTTP ${r.status}`)
  const body = (await r.json()) as RangeResponse
  if (body.failure) throw new Error(`calendly range: ${body.failure.error ?? "unknown"}`)
  const out: string[] = []
  for (const day of body.days ?? []) {
    for (const spot of day.spots ?? []) {
      // start_time carries the consultant's UTC offset — normalise so the
      // client can render it in whatever timezone the visitor picks.
      if (spot.status === "available" && spot.start_time) {
        const t = Date.parse(spot.start_time)
        if (!Number.isNaN(t)) out.push(new Date(t).toISOString())
      }
    }
  }
  return out
}

/**
 * Bookable slots for the region, soonest first, pooled across everyone who
 * covers it.
 *
 * A time free on more than one calendar is credited to whoever comes first in
 * REGION_CONSULTANTS, so the preferred consultant fills up before the next is
 * offered — but a time only the second person has free is still shown, which is
 * the point: the region stops looking fully booked whenever anyone is free.
 *
 * Returns [] rather than throwing — an empty list is the caller's cue to fall
 * back to Calendly's own page.
 */
export async function getConsultantSlots(region: LeadRegion): Promise<ConsultantSlot[]> {
  const cacheKey = `${region}:${schedulerTestMode() ? "test" : "live"}`
  const hit = cache.get(cacheKey)
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.slots

  // Start a day back so "today" is never clipped by timezone skew; past slots
  // are filtered below anyway.
  const from = new Date(Date.now() - 86400_000)
  const windows: [Date, Date][] = Array.from({ length: HORIZON_WINDOWS }, (_, i) => [
    new Date(from.getTime() + i * WINDOW_DAYS * 86400_000),
    new Date(from.getTime() + (i + 1) * WINDOW_DAYS * 86400_000),
  ])

  const pool = poolFor(region)
  const perConsultant = await Promise.all(
    pool.map(async (c) => {
      const results = await Promise.all(
        windows.map(async ([s, e]) => {
          try {
            return await fetchWindow(c.eventTypeUuid, c.availabilityTimezone, s, e)
          } catch (err) {
            console.warn(
              `[scheduling] availability window failed (${region}/${c.key}):`,
              err instanceof Error ? err.message : String(err),
            )
            return [] as string[]
          }
        }),
      )
      return { key: c.key, starts: results.flat() }
    }),
  )

  // An hour's lead time so we never offer a slot that expires mid-booking.
  const floor = Date.now() + 60 * 60 * 1000
  // First writer wins, and the pool is walked in preference order — so a shared
  // time lands on the preferred consultant and later ones only fill the gaps.
  const owner = new Map<string, string>()
  for (const { key, starts } of perConsultant) {
    for (const start of starts) {
      if (Date.parse(start) > floor && !owner.has(start)) owner.set(start, key)
    }
  }

  const slots = [...owner.entries()]
    .map(([start, host]) => ({ start, host }))
    .sort((a, b) => a.start.localeCompare(b.start))

  // Only cache a real answer — caching an outage would extend it by 5 minutes.
  if (slots.length > 0) cache.set(cacheKey, { at: Date.now(), slots })
  return slots
}
