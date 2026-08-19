/**
 * Pure date / timezone helpers for the booking widget. No React, no I/O — all
 * grouping is done by comparing "YYYY-MM-DD" keys computed in the invitee's
 * chosen timezone, which sidesteps hand-rolled DST math.
 */

export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  } catch {
    return "UTC"
  }
}

/** "YYYY-MM-DD" for an instant, rendered in `tz`. */
export function tzDayKey(instant: Date | string, tz: string): string {
  const d = typeof instant === "string" ? new Date(instant) : instant
  // en-CA yields ISO-ordered parts: 2026-07-17
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d)
}

/** "9:00 AM" for an instant in `tz`. */
export function formatTime(instant: Date | string, tz: string): string {
  const d = typeof instant === "string" ? new Date(instant) : instant
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d)
}

/** "Friday, July 17, 2026" for a civil YYYY-MM-DD key. */
export function formatDayLabel(key: string): string {
  const [y, m, d] = key.split("-").map(Number)
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(y, m - 1, d, 12))
}

export function monthLabel(year: number, month0: number): string {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
    new Date(year, month0, 1),
  )
}

/** Short GMT-offset label for a timezone, e.g. "GMT-4". */
export function tzOffsetLabel(tz: string, at: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    }).formatToParts(at)
    return parts.find((p) => p.type === "timeZoneName")?.value ?? ""
  } catch {
    return ""
  }
}

export interface CalendarCell {
  key: string // YYYY-MM-DD
  day: number
  inMonth: boolean
  isPast: boolean
  isToday: boolean
}

export function ymd(year: number, month0: number, day: number): string {
  return `${year}-${String(month0 + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

/**
 * A 6-row (42-cell) Sunday-first grid for the given month, with leading/trailing
 * days from adjacent months so the grid is always rectangular.
 */
export function buildMonthGrid(year: number, month0: number, todayKey: string): CalendarCell[] {
  const first = new Date(year, month0, 1)
  const startWeekday = first.getDay() // 0 = Sun
  const gridStart = new Date(year, month0, 1 - startWeekday)

  const cells: CalendarCell[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i)
    const key = ymd(d.getFullYear(), d.getMonth(), d.getDate())
    cells.push({
      key,
      day: d.getDate(),
      inMonth: d.getMonth() === month0,
      isPast: key < todayKey,
      isToday: key === todayKey,
    })
  }
  return cells
}

export function addMonth(year: number, month0: number, delta: number): { year: number; month0: number } {
  const d = new Date(year, month0 + delta, 1)
  return { year: d.getFullYear(), month0: d.getMonth() }
}

/** UTC instants spanning a civil month (with a day of slack each side for tz edges). */
export function monthRange(year: number, month0: number): { start: number; end: number } {
  const start = Date.UTC(year, month0, 1) - 24 * 60 * 60 * 1000
  const end = Date.UTC(year, month0 + 1, 1) + 24 * 60 * 60 * 1000
  return { start, end }
}

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

/** A small, curated list of common business timezones; the detected zone is
 * prepended by the widget so the invitee's own zone is always first. */
export const COMMON_TIMEZONES: string[] = [
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Athens",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Australia/Sydney",
]

export function tzDisplayName(tz: string): string {
  const city = tz.split("/").pop()?.replace(/_/g, " ") ?? tz
  const offset = tzOffsetLabel(tz)
  return offset ? `${city} (${offset})` : city
}
