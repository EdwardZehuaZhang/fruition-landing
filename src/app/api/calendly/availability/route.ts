import { NextResponse } from "next/server"

import {
  MAX_AVAILABILITY_DAYS,
  firstLocation,
  getAvailableTimes,
  getCalendlyConfig,
  getEventType,
  getUser,
  locationLabel,
} from "@/lib/calendly"
import type { AvailabilityResponse, BookingQuestion } from "@/components/sections/calendly/types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Availability for the custom booking widget.
 *   GET /api/calendly/availability?start=<ISO>&end=<ISO>
 * Returns the event-type meta plus every bookable slot in the range. When
 * Calendly isn't configured, returns `{ configured: false }` so the widget can
 * fall back to the legacy embed.
 */
export async function GET(request: Request) {
  const config = getCalendlyConfig()
  if (!config) {
    return NextResponse.json<AvailabilityResponse>({ configured: false })
  }

  const { searchParams } = new URL(request.url)
  const now = Date.now()
  const startParam = Date.parse(searchParams.get("start") ?? "")
  const endParam = Date.parse(searchParams.get("end") ?? "")

  const startMs = Number.isNaN(startParam) ? now : Math.max(startParam, now)
  const endMs = Number.isNaN(endParam)
    ? startMs + 30 * DAY_MS
    : Math.min(endParam, startMs + MAX_AVAILABILITY_DAYS * DAY_MS)

  try {
    const eventType = await getEventType(config.token, config.eventTypeUri)
    const [host, slots] = await Promise.all([
      eventType.profile?.owner
        ? getUser(config.token, eventType.profile.owner).catch(() => null)
        : Promise.resolve(null),
      getAvailableTimes(config.token, config.eventTypeUri, startMs, endMs),
    ])

    const questions: BookingQuestion[] = (eventType.custom_questions ?? [])
      .filter((q) => q.enabled)
      .sort((a, b) => a.position - b.position)
      .map((q) => ({
        name: q.name,
        type: q.type,
        required: q.required,
        position: q.position,
        answerChoices: q.answer_choices ?? [],
        includeOther: q.include_other,
      }))

    const payload: AvailabilityResponse = {
      configured: true,
      event: {
        name: eventType.name,
        durationMinutes: eventType.duration,
        schedulingUrl: eventType.scheduling_url,
        location: locationLabel(firstLocation(eventType)),
        host: {
          name: host?.name ?? eventType.profile?.name ?? "Fruition",
          avatarUrl: host?.avatar_url ?? null,
        },
        timezone: host?.timezone ?? "UTC",
        questions,
      },
      slots: slots.map((s) => ({
        startTime: s.start_time,
        schedulingUrl: s.scheduling_url,
        inviteesRemaining: s.invitees_remaining,
      })),
      range: { start: new Date(startMs).toISOString(), end: new Date(endMs).toISOString() },
    }

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "private, max-age=30" },
    })
  } catch (err) {
    console.error("[calendly/availability]", err)
    return NextResponse.json(
      { configured: true, event: null, slots: [], error: "availability_failed" },
      { status: 502 },
    )
  }
}
