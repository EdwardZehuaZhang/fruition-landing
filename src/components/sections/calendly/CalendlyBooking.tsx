"use client"

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  MapPin,
  Phone,
  Plus,
  Video,
  X,
} from "lucide-react"

import {
  addMonth,
  buildMonthGrid,
  COMMON_TIMEZONES,
  detectTimezone,
  formatDayLabel,
  formatTime,
  monthLabel,
  monthRange,
  tzDayKey,
  tzDisplayName,
  WEEKDAY_LABELS,
} from "./calendar"
import type {
  AvailabilityResponse,
  BookRequest,
  BookResponse,
  EventMeta,
  Slot,
} from "./types"

type Step = "pick" | "details" | "confirmed"
type Status = "loading" | "ready" | "fallback"

interface MonthState {
  slots: Slot[]
  loading: boolean
  error: boolean
}

interface Confirmation {
  name: string
  email: string
  startTime: string
  rescheduleUrl?: string
  cancelUrl?: string
}

const monthKey = (year: number, month0: number) => `${year}-${month0}`

function LocationIcon({ kind }: { kind: string }) {
  if (kind.includes("call")) return <Phone size={18} />
  if (kind === "physical") return <MapPin size={18} />
  if (kind.includes("conference")) return <Video size={18} />
  return <Globe size={18} />
}

export default function CalendlyBooking({ fallback }: { fallback: ReactNode }) {
  const [status, setStatus] = useState<Status>("loading")
  const [event, setEvent] = useState<EventMeta | null>(null)
  const [tz, setTz] = useState<string>("UTC")
  const [now] = useState(() => new Date())
  const [view, setView] = useState(() => ({ year: now.getFullYear(), month0: now.getMonth() }))
  const [months, setMonths] = useState<Record<string, MonthState>>({})

  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [step, setStep] = useState<Step>("pick")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [guests, setGuests] = useState<string[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)

  // Detect the visitor's timezone on the client only (avoids hydration drift).
  useEffect(() => setTz(detectTimezone()), [])

  const fetchMonth = useCallback(async (year: number, month0: number) => {
    const key = monthKey(year, month0)
    setMonths((prev) => {
      if (prev[key]?.loading || prev[key]?.slots.length) return prev
      return { ...prev, [key]: { slots: [], loading: true, error: false } }
    })
    const { start, end } = monthRange(year, month0)
    try {
      const params = new URLSearchParams({
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
      })
      const res = await fetch(`/api/calendly/availability?${params.toString()}`)
      const data = (await res.json()) as AvailabilityResponse & { event?: EventMeta | null }
      if (!res.ok || !("configured" in data) || data.configured === false) {
        // Unconfigured or a server error: clear this month's loading state and,
        // on the very first load, drop to the legacy embed.
        setMonths((prev) => ({ ...prev, [key]: { slots: [], loading: false, error: !("configured" in data) || data.configured !== false } }))
        setStatus((s) => (s === "loading" ? "fallback" : s))
        return
      }
      if (!data.event) throw new Error("no-event")
      setEvent((prev) => prev ?? data.event)
      setMonths((prev) => ({ ...prev, [key]: { slots: data.slots, loading: false, error: false } }))
      setStatus("ready")
    } catch {
      setMonths((prev) => ({ ...prev, [key]: { slots: [], loading: false, error: true } }))
      setStatus((s) => (s === "loading" ? "fallback" : s))
    }
  }, [])

  useEffect(() => {
    fetchMonth(view.year, view.month0)
  }, [view.year, view.month0, fetchMonth])

  // All loaded slots across months, so leading/trailing grid days resolve too.
  const allSlots = useMemo(
    () => Object.values(months).flatMap((m) => m.slots),
    [months],
  )
  const availableDayKeys = useMemo(
    () => new Set(allSlots.map((s) => tzDayKey(s.startTime, tz))),
    [allSlots, tz],
  )
  const todayKey = useMemo(() => tzDayKey(now, tz), [now, tz])

  // Auto-select the earliest available day in the current month once loaded.
  useEffect(() => {
    if (status !== "ready" || selectedDayKey) return
    const md = months[monthKey(view.year, view.month0)]
    if (!md || md.loading) return
    const keys = md.slots.map((s) => tzDayKey(s.startTime, tz)).sort()
    if (keys.length) setSelectedDayKey(keys[0])
  }, [status, months, view, tz, selectedDayKey])

  const daySlots = useMemo(() => {
    if (!selectedDayKey) return [] as Slot[]
    const seen = new Set<string>()
    return allSlots
      .filter((s) => tzDayKey(s.startTime, tz) === selectedDayKey)
      .filter((s) => (seen.has(s.startTime) ? false : (seen.add(s.startTime), true)))
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }, [allSlots, selectedDayKey, tz])

  const grid = useMemo(
    () => buildMonthGrid(view.year, view.month0, todayKey),
    [view, todayKey],
  )
  const currentMonth = months[monthKey(view.year, view.month0)]
  const canGoPrev =
    view.year > now.getFullYear() ||
    (view.year === now.getFullYear() && view.month0 > now.getMonth())

  function goMonth(delta: number) {
    setView((v) => addMonth(v.year, v.month0, delta))
  }

  function pickDay(key: string) {
    setSelectedDayKey(key)
    setSelectedSlot(null)
  }

  function pickSlot(slot: Slot) {
    setSelectedSlot(slot)
    setSubmitError("")
    setStep("details")
  }

  if (status === "fallback") return <>{fallback}</>
  if (status === "loading" || !event) return <BookingSkeleton />

  const durationEnd = selectedSlot
    ? new Date(new Date(selectedSlot.startTime).getTime() + event.durationMinutes * 60000)
    : null

  const tzOptions = Array.from(new Set([tz, ...COMMON_TIMEZONES]))

  async function submitBooking() {
    if (!selectedSlot || !event) return
    const missing = event.questions.find(
      (q) => q.required && !(answers[q.position] ?? "").trim(),
    )
    if (!name.trim()) return setSubmitError("Please enter your name.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return setSubmitError("Please enter a valid email address.")
    if (missing) return setSubmitError(`Please answer: ${missing.name}`)

    setSubmitting(true)
    setSubmitError("")
    const payload: BookRequest = {
      startTime: selectedSlot.startTime,
      name: name.trim(),
      email: email.trim(),
      timezone: tz,
      answers: event.questions
        .map((q) => ({ question: q.name, answer: (answers[q.position] ?? "").trim(), position: q.position }))
        .filter((a) => a.answer),
      guests: guests.map((g) => g.trim()).filter(Boolean),
    }
    try {
      const res = await fetch("/api/calendly/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = (await res.json()) as BookResponse
      if (data.ok) {
        setConfirmation(data.invitee)
        setStep("confirmed")
      } else if (data.code === "taken") {
        // Someone booked it first — refresh this month and return to the calendar.
        setStep("pick")
        setSelectedSlot(null)
        setMonths((prev) => {
          const next = { ...prev }
          delete next[monthKey(view.year, view.month0)]
          return next
        })
        fetchMonth(view.year, view.month0)
        setSubmitError(data.error)
      } else {
        setSubmitError(data.error)
      }
    } catch {
      setSubmitError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fxc">
      <div className="fxc-card">
        <aside className="fxc-aside">
          <div className="fxc-host">
            {event.host.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="fxc-avatar" src={event.host.avatarUrl} alt="" />
            ) : (
              <span className="fxc-avatar fxc-avatar-fallback" aria-hidden>
                {event.host.name.charAt(0)}
              </span>
            )}
            <span className="fxc-host-name">{event.host.name}</span>
          </div>
          <h3 className="fxc-title">{event.name}</h3>
          <div className="fxc-meta">
            <div className="fxc-meta-row">
              <Clock size={18} />
              <span>{event.durationMinutes} min</span>
            </div>
            {event.location && (
              <div className="fxc-meta-row">
                <LocationIcon kind={event.location.kind} />
                <span>{event.location.label}</span>
              </div>
            )}
          </div>
          {selectedSlot && durationEnd && (
            <div className="fxc-selected">
              {formatDayLabel(tzDayKey(selectedSlot.startTime, tz))}
              <br />
              {formatTime(selectedSlot.startTime, tz)} – {formatTime(durationEnd, tz)}
            </div>
          )}
          <div className="fxc-tz">
            <span className="fxc-tz-label">
              <Globe size={13} /> Timezone
            </span>
            <select
              aria-label="Timezone"
              value={tz}
              onChange={(e) => {
                setTz(e.target.value)
                setSelectedSlot(null)
              }}
            >
              {tzOptions.map((z) => (
                <option key={z} value={z}>
                  {tzDisplayName(z)}
                </option>
              ))}
            </select>
          </div>
        </aside>

        <div className="fxc-body">
          {step === "pick" && (
            <div className="fxc-step fxc-pick">
              <div>
                <div className="fxc-cal-head">
                  <span className="fxc-month">{monthLabel(view.year, view.month0)}</span>
                  <div className="fxc-nav">
                    <button
                      type="button"
                      className="fxc-nav-btn"
                      onClick={() => goMonth(-1)}
                      disabled={!canGoPrev}
                      aria-label="Previous month"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      className="fxc-nav-btn"
                      onClick={() => goMonth(1)}
                      aria-label="Next month"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
                <div className="fxc-weekdays">
                  {WEEKDAY_LABELS.map((d) => (
                    <span key={d} className="fxc-weekday">
                      {d}
                    </span>
                  ))}
                </div>
                <div className="fxc-days" role="grid">
                  {grid.map((cell) => {
                    const available = cell.inMonth && !cell.isPast && availableDayKeys.has(cell.key)
                    const cls = [
                      "fxc-day",
                      !cell.inMonth ? "is-out" : "",
                      cell.isToday ? "is-today" : "",
                      available ? "is-available" : "",
                      cell.inMonth && !available ? "is-muted" : "",
                      selectedDayKey === cell.key ? "is-selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")
                    return (
                      <button
                        key={cell.key}
                        type="button"
                        className={cls}
                        disabled={!available && selectedDayKey !== cell.key}
                        aria-label={available ? `${formatDayLabel(cell.key)}, times available` : undefined}
                        aria-pressed={selectedDayKey === cell.key}
                        onClick={() => available && pickDay(cell.key)}
                      >
                        {cell.inMonth ? cell.day : ""}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="fxc-times-wrap">
                <div className="fxc-times-head">
                  {selectedDayKey ? formatDayLabel(selectedDayKey) : "Select a day"}
                </div>
                {currentMonth?.loading && !allSlots.length ? (
                  <div className="fxc-times">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="fxc-skeleton" style={{ height: 44 }} />
                    ))}
                  </div>
                ) : daySlots.length ? (
                  <div className="fxc-times">
                    {daySlots.map((slot, i) => (
                      <button
                        key={slot.startTime}
                        type="button"
                        className={`fxc-time${selectedSlot?.startTime === slot.startTime ? " is-selected" : ""}`}
                        style={{ animationDelay: `${Math.min(i, 10) * 28}ms` }}
                        onClick={() => pickSlot(slot)}
                      >
                        {formatTime(slot.startTime, tz)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="fxc-empty">
                    {selectedDayKey
                      ? "No times left on this day. Try another."
                      : currentMonth?.error
                        ? "Couldn’t load times. Please try again."
                        : "No availability this month. Try the next one."}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === "details" && selectedSlot && (
            <div className="fxc-step">
              <form
                className="fxc-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  submitBooking()
                }}
              >
                <div className="fxc-form-head">Enter your details</div>

                <div className="fxc-field">
                  <label htmlFor="fxc-name">
                    Name<span className="req">*</span>
                  </label>
                  <input
                    id="fxc-name"
                    className="fxc-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="fxc-field">
                  <label htmlFor="fxc-email">
                    Email<span className="req">*</span>
                  </label>
                  <input
                    id="fxc-email"
                    className="fxc-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                {event.questions.map((q) => (
                  <div className="fxc-field" key={q.position}>
                    <label htmlFor={`fxc-q-${q.position}`}>
                      {q.name}
                      {q.required && <span className="req">*</span>}
                    </label>
                    {q.answerChoices.length > 0 ? (
                      <select
                        id={`fxc-q-${q.position}`}
                        className="fxc-input"
                        value={answers[q.position] ?? ""}
                        onChange={(e) => setAnswers((a) => ({ ...a, [q.position]: e.target.value }))}
                        required={q.required}
                      >
                        <option value="" disabled>
                          Select…
                        </option>
                        {q.answerChoices.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <textarea
                        id={`fxc-q-${q.position}`}
                        className="fxc-input"
                        rows={3}
                        value={answers[q.position] ?? ""}
                        onChange={(e) => setAnswers((a) => ({ ...a, [q.position]: e.target.value }))}
                        required={q.required}
                      />
                    )}
                  </div>
                ))}

                {guests.map((g, i) => (
                  <div className="fxc-field" key={`guest-${i}`}>
                    <label htmlFor={`fxc-guest-${i}`}>Guest email</label>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input
                        id={`fxc-guest-${i}`}
                        className="fxc-input"
                        type="email"
                        value={g}
                        onChange={(e) =>
                          setGuests((gs) => gs.map((v, j) => (j === i ? e.target.value : v)))
                        }
                        placeholder="name@company.com"
                      />
                      <button
                        type="button"
                        className="fxc-nav-btn"
                        aria-label="Remove guest"
                        onClick={() => setGuests((gs) => gs.filter((_, j) => j !== i))}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {guests.length < 10 && (
                  <button
                    type="button"
                    className="fxc-guest-add"
                    onClick={() => setGuests((gs) => [...gs, ""])}
                  >
                    <Plus size={13} style={{ verticalAlign: "-2px", marginRight: 4 }} />
                    Add guests
                  </button>
                )}

                {submitError && (
                  <p className="fxc-error" role="alert">
                    {submitError}
                  </p>
                )}

                <div className="fxc-actions">
                  <button
                    type="button"
                    className="cta-btn cta-btn-outline"
                    onClick={() => {
                      setStep("pick")
                      setSubmitError("")
                    }}
                  >
                    <ArrowLeft size={16} />
                    <span className="cta-btn-label">Back</span>
                  </button>
                  <button
                    type="submit"
                    className="cta-btn cta-btn-primary"
                    disabled={submitting}
                    style={{ opacity: submitting ? 0.7 : 1 }}
                  >
                    <span className="cta-btn-label">
                      {submitting ? "Booking…" : "Confirm booking"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === "confirmed" && confirmation && (
            <div className="fxc-step fxc-confirm">
              <span className="fxc-check">
                <Check size={30} strokeWidth={2.5} />
              </span>
              <h3>You’re booked</h3>
              <div className="fxc-confirm-when">
                {formatDayLabel(tzDayKey(confirmation.startTime, tz))}
                <br />
                {formatTime(confirmation.startTime, tz)}
                {durationEnd ? ` – ${formatTime(durationEnd, tz)}` : ""} · {tzDisplayName(tz)}
              </div>
              <p className="fxc-confirm-note">
                A calendar invitation is on its way to <strong>{confirmation.email}</strong>.
              </p>
              {(confirmation.rescheduleUrl || confirmation.cancelUrl) && (
                <div className="fxc-confirm-links">
                  {confirmation.rescheduleUrl && (
                    <a href={confirmation.rescheduleUrl} target="_blank" rel="noreferrer">
                      Reschedule
                    </a>
                  )}
                  {confirmation.cancelUrl && (
                    <a href={confirmation.cancelUrl} target="_blank" rel="noreferrer">
                      Cancel
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BookingSkeleton() {
  return (
    <div className="fxc">
      <div className="fxc-card">
        <aside className="fxc-aside">
          <div className="fxc-skeleton" style={{ height: 40, width: 40, borderRadius: 999 }} />
          <div className="fxc-skeleton" style={{ height: 22, width: "80%" }} />
          <div className="fxc-skeleton" style={{ height: 16, width: "50%" }} />
          <div className="fxc-skeleton" style={{ height: 16, width: "60%" }} />
        </aside>
        <div className="fxc-body">
          <div className="fxc-pick">
            <div className="fxc-skeleton" style={{ height: 300 }} />
            <div className="fxc-times">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="fxc-skeleton" style={{ height: 44 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
