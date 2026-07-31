"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { Mail, Phone } from "lucide-react"
import Reveal from "./Reveal"

// `Window.Calendly` is declared once, in components/sections/CalendlySection.

const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js"

interface Props {
  /** The account page, e.g. https://calendly.com/global-calendar-fruitionservices */
  calendlyUrl: string
  contactEmail: string
  phone?: string
  phoneTel?: string
  phoneLabel?: string
}

/**
 * Closing CTA — the design's dark gradient band with Calendly's own inline
 * widget in the white card.
 *
 * This deliberately embeds the account page rather than the custom day/slot
 * picker (BookingSection): the picker's regional event-type routing is still
 * being sorted out in Calendly, and the homepage is the site's main lead
 * source, so it books through the same widget prod has always used. Swap the
 * card back to <BookingSection /> once the round-robin hosts are assigned.
 */
export default function BookingCta({
  calendlyUrl,
  contactEmail,
  phone,
  phoneTel,
  phoneLabel,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const embedUrl = `${calendlyUrl}${calendlyUrl.includes("?") ? "&" : "?"}hide_gdpr_banner=1&embed_type=Inline`
    const init = () => {
      if (!window.Calendly || !hostRef.current) return
      hostRef.current.innerHTML = ""
      window.Calendly.initInlineWidget({ url: embedUrl, parentElement: hostRef.current })
    }
    if (window.Calendly) {
      init()
      return
    }
    // The script is shared across mounts rather than appended per instance.
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
    if (existing) {
      existing.addEventListener("load", init)
      return () => existing.removeEventListener("load", init)
    }
    const script = document.createElement("script")
    script.src = SCRIPT_SRC
    script.async = true
    script.addEventListener("load", init)
    document.body.appendChild(script)
    return () => script.removeEventListener("load", init)
  }, [calendlyUrl])

  return (
    <section
      id="book"
      className="relative scroll-mt-24 overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(-38deg, var(--purple-primary) -20%, var(--dark-bg-secondary) 48%, var(--dark-bg) 100%)",
      }}
    >
      <Image
        src="/images/bg-purple-circle.avif"
        alt=""
        width={700}
        height={700}
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-45 w-[700px] max-w-none opacity-60 mix-blend-screen"
      />
      <div className="relative mx-auto grid max-w-[1348px] grid-cols-1 items-center gap-10 px-5 py-16 md:px-8 md:py-20 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:py-24">
        <Reveal>
          <p className="text-micro font-bold tracking-[0.12em] uppercase text-brand-light">
            Book a discovery call
          </p>
          <h2 className="text-section-h2 mt-4.5 text-white lg:text-[46px]" style={{ textWrap: "pretty" }}>
            Let&apos;s design the way your business should run.
          </h2>
          <p className="text-body-lead mt-5 max-w-[520px] text-white/78">
            30 minutes. No obligation. Speak to a consultant, not a salesperson.
          </p>
          <div className="mt-9 flex flex-col gap-3.5">
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-3 text-base font-medium text-white hover:text-brand-light"
            >
              <Mail size={18} strokeWidth={2} className="flex-none text-brand-light" aria-hidden />
              {contactEmail}
            </a>
            {phone && phoneTel && (
              <a
                href={`tel:${phoneTel}`}
                className="inline-flex items-center gap-3 text-base font-medium text-white hover:text-brand-light"
              >
                <Phone size={18} strokeWidth={2} className="flex-none text-brand-light" aria-hidden />
                {phone}
                {phoneLabel && <span className="text-white/70">· {phoneLabel}</span>}
              </a>
            )}
          </div>
        </Reveal>

        <Reveal className="w-full">
          <div className="overflow-hidden rounded-card bg-surface-raised p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] md:p-3">
            <div ref={hostRef} className="w-full" style={{ height: 700 }} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
