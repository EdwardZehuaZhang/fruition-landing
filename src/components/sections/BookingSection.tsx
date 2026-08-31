"use client"

/**
 * The one booking surface on the site. Every page renders this — pages never
 * reach past it to a specific implementation.
 *
 * Two modes, switched site-wide by BOOKING_MODE:
 *
 *   "global"      Calendly's inline widget on one shared calendar
 *                 (calendly.com/global-calendar-fruitionservices, or the
 *                 `calendlyUrl` a Sanity page overrides it with)
 *
 *   "consultant"  the custom picker in ConsultantBooking — live availability
 *                 from the real calendar of whoever covers the visitor's
 *                 region, details captured before the booking is confirmed
 *
 * Both modes stay built and working. Currently "global" while regional routing
 * is settled in Calendly; flipping the constant restores the picker, so no part
 * of that flow may be deleted while this says "consultant" is a mode.
 */

import { useEffect, useRef, useState } from "react"
import ConsultantBooking from "./ConsultantBooking"

export type BookingMode = "global" | "consultant"

/** Site-wide default. Flip to "consultant" to bring the custom picker back. */
export const BOOKING_MODE: BookingMode = "global"

/** The shared calendar, and the fallback for every other path. */
export const GLOBAL_CALENDAR = "https://calendly.com/global-calendar-fruitionservices"

const CALENDLY_SCRIPT = "https://assets.calendly.com/assets/external/widget.js"
const BASE_WIDGET_HEIGHT = 880

// The single Window augmentation for both modes.
declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void
    }
  }
}

export interface BookingSectionProps {
  eyebrow?: string
  heading?: string
  sub?: string
  /** Shown under the widget as an alternative to booking. */
  email?: string
  /** Overrides the CMS-driven office strap. Leave unset on real pages. */
  offices?: string
  proof?: string
  duration?: number
  askTeamSize?: boolean
  /** Explicit calendar for this placement — wins over the global default. */
  calendlyUrl?: string
  /** Defaults to BOOKING_MODE; pass it to override a single placement. */
  mode?: BookingMode
}

export default function BookingSection({ mode = BOOKING_MODE, ...props }: BookingSectionProps) {
  if (mode === "consultant") return <ConsultantBooking {...props} />
  return <GlobalCalendlyBooking {...props} />
}

/** Calendly needs its own query params merged into whatever the URL already has. */
function embedUrlFor(url: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}hide_gdpr_banner=1&embed_type=Inline`
}

function GlobalCalendlyBooking({
  eyebrow,
  heading = "Schedule A 30-Min Consultation With One of Our monday.com Consultants",
  sub,
  email,
  calendlyUrl,
}: Omit<BookingSectionProps, "mode">) {
  const widgetRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const [measuredSub, setMeasuredSub] = useState(0)
  // Derived rather than reset from the effect below, so dropping the subheading
  // doesn't need a synchronous setState during that effect.
  const subExtra = sub ? measuredSub : 0

  const embedUrl = embedUrlFor(calendlyUrl ?? GLOBAL_CALENDAR)

  useEffect(() => {
    if (!sub || !subRef.current) return
    const el = subRef.current
    const update = () => setMeasuredSub(el.offsetHeight)
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [sub])

  useEffect(() => {
    const init = () => {
      if (window.Calendly && widgetRef.current) {
        widgetRef.current.innerHTML = ""
        window.Calendly.initInlineWidget({ url: embedUrl, parentElement: widgetRef.current })
      }
    }
    if (window.Calendly) {
      init()
      return
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CALENDLY_SCRIPT}"]`)
    if (existing) {
      existing.addEventListener("load", init)
      return () => existing.removeEventListener("load", init)
    }
    const script = document.createElement("script")
    script.src = CALENDLY_SCRIPT
    script.async = true
    script.onload = init
    document.body.appendChild(script)
  }, [embedUrl])

  return (
    <section id="book" className="bg-surface-subtle" style={{ paddingTop: 0, paddingBottom: 0 }}>
      <div className="mx-auto flex flex-col items-center px-4" style={{ maxWidth: 1200, paddingTop: 80 }}>
        {eyebrow && (
          <p
            className="text-center"
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--purple-primary)",
              marginBottom: 12,
            }}
          >
            {eyebrow}
          </p>
        )}
        <h2 className="text-section-h2 text-center text-body" style={{ maxWidth: 900 }}>
          {heading}
        </h2>
        {sub && (
          <p
            ref={subRef}
            className="text-center"
            style={{
              fontSize: 16,
              lineHeight: "24px",
              color: "var(--text-body)",
              marginTop: 16,
              maxWidth: 900,
              whiteSpace: "pre-line",
            }}
          >
            {sub}
          </p>
        )}
        <div ref={widgetRef} className="w-full" style={{ marginTop: 8, height: BASE_WIDGET_HEIGHT + subExtra }} />
        {email && (
          <p className="text-center" style={{ fontSize: 15, color: "var(--text-body)", paddingBottom: 48 }}>
            Prefer email?{" "}
            <a href={`mailto:${email}`} style={{ color: "var(--purple-primary)", fontWeight: 600 }}>
              {email}
            </a>
          </p>
        )}
      </div>
    </section>
  )
}
