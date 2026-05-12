"use client"

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
  const [subheadingExtra, setSubheadingExtra] = useState(0)

  useEffect(() => {
    if (!subheading || !subheadingRef.current) {
      setSubheadingExtra(0)
      return
    }
    const el = subheadingRef.current
    const update = () => setSubheadingExtra(el.offsetHeight)
    update()
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
    <section className="bg-[#f7f7f7]" style={{ paddingTop: 0, paddingBottom: 0 }}>
      <div className="mx-auto flex flex-col items-center px-4" style={{ maxWidth: 1200, paddingTop: 80 }}>
        <h2 className="text-section-h2 text-center text-black" style={{ maxWidth: 900 }}>
          {heading}
        </h2>
        {subheading && (
          <p ref={subheadingRef} className="text-center" style={{ fontSize: 16, lineHeight: "24px", color: "black", marginTop: 16, maxWidth: 900, whiteSpace: "pre-line" }}>
            {subheading}
          </p>
        )}
        <div
          ref={widgetRef}
          className="w-full"
          style={{ marginTop: 8, minWidth: 320, height: BASE_WIDGET_HEIGHT + subheadingExtra }}
        />
      </div>
    </section>
  )
}
