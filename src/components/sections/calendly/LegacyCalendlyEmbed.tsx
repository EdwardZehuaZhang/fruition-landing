"use client"

import { useEffect, useRef } from "react"

/**
 * The original Calendly inline-widget embed, kept as a graceful fallback for
 * when the API-backed booking widget isn't configured (no CALENDLY_API_TOKEN /
 * event-type URI) or availability can't be loaded. Behaviour is unchanged from
 * the pre-rebuild CalendlySection.
 */

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string
        parentElement: HTMLElement
        prefill?: object
        utm?: object
      }) => void
    }
  }
}

export default function LegacyCalendlyEmbed({
  calendlyUrl,
  height,
}: {
  calendlyUrl: string
  height: number
}) {
  const widgetRef = useRef<HTMLDivElement>(null)

  const embedUrl = calendlyUrl.includes("?")
    ? `${calendlyUrl}&hide_gdpr_banner=1&embed_type=Inline`
    : `${calendlyUrl}?hide_gdpr_banner=1&embed_type=Inline`

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
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]',
    )
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

  return <div ref={widgetRef} className="w-full" style={{ marginTop: 8, height }} />
}
