"use client"

/**
 * Booking section used across ~34 marketing pages.
 *
 * Renders Calendly's own inline widget rather than the custom day/slot picker
 * (BookingSection), so every page books through the same proven embed while the
 * regional event-type routing is sorted out in Calendly. BookingSection and its
 * /api/scheduling routes stay in the codebase — point this back at it once
 * round-robin hosts are assigned.
 */

import { useEffect, useRef, useState } from "react"

const BASE_WIDGET_HEIGHT = 880

interface CalendlySectionProps {
  heading?: string
  subheading?: string
  calendlyUrl?: string
}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: { url: string; parentElement: HTMLElement; prefill?: object; utm?: object }) => void
    }
  }
}

export default function CalendlySection({
  heading = "Schedule A 30-Min Consultation With One of Our monday.com Consultants",
  subheading,
  calendlyUrl = "https://calendly.com/global-calendar-fruitionservices",
}: CalendlySectionProps) {
  const embedUrl = calendlyUrl.includes("?")
    ? `${calendlyUrl}&hide_gdpr_banner=1&embed_type=Inline`
    : `${calendlyUrl}?hide_gdpr_banner=1&embed_type=Inline`
  const widgetRef = useRef<HTMLDivElement>(null)
  const subheadingRef = useRef<HTMLParagraphElement>(null)
  const [measuredSubheading, setMeasuredSubheading] = useState(0)
  // Derived rather than reset from the effect below, so dropping the subheading
  // doesn't need a synchronous setState during that effect.
  const subheadingExtra = subheading ? measuredSubheading : 0

  useEffect(() => {
    if (!subheading || !subheadingRef.current) return
    const el = subheadingRef.current
    const update = () => setMeasuredSubheading(el.offsetHeight)
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [subheading])

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
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://assets.calendly.com/assets/external/widget.js"]')
    if (existing) {
      existing.addEventListener("load", init)
      return () => existing.removeEventListener("load", init)
    }
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    script.onload = init
    document.body.appendChild(script)
  }, [embedUrl])

  return (
    <section className="bg-surface-subtle" style={{ paddingTop: 0, paddingBottom: 0 }}>
      <div className="mx-auto flex flex-col items-center px-4" style={{ maxWidth: 1200, paddingTop: 80 }}>
        <h2 className="text-section-h2 text-center text-body" style={{ maxWidth: 900 }}>
          {heading}
        </h2>
        {subheading && (
          <p ref={subheadingRef} className="text-center" style={{ fontSize: 16, lineHeight: "24px", color: "var(--text-body)", marginTop: 16, maxWidth: 900, whiteSpace: "pre-line" }}>
            {subheading}
          </p>
        )}
        <div
          ref={widgetRef}
          className="w-full"
          style={{ marginTop: 8, height: BASE_WIDGET_HEIGHT + subheadingExtra }}
        />
      </div>
    </section>
  )
}
