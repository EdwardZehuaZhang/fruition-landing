import Link from "next/link"
import { urlFor } from "@/sanity/image"
import type { SanityImageRef } from "./types"

interface DiscoverCtaSectionProps {
  badge?: SanityImageRef
  heading?: string
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
}

export default function DiscoverCtaSection({
  badge,
  heading = "Discover how much monday.com can do for your team.",
  primaryCtaLabel = "🚀 Schedule a Consultation",
  primaryCtaUrl = "https://calendly.com/global-calendar-fruitionservices",
  secondaryCtaLabel = "▶️ Get Started with monday.com",
  secondaryCtaUrl = "https://calendly.com/global-calendar-fruitionservices",
}: DiscoverCtaSectionProps) {
  const badgeSrc = badge?.asset?._ref ? (() => { try { return urlFor(badge).width(325).height(73).url() } catch { return null } })() : null

  return (
    <section style={{ backgroundColor: "#ece6fc", paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto flex flex-col items-center">
        {badgeSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={badgeSrc} alt="Certifications" width={325} height={73} className="h-[73px] w-[325px] object-contain" />
        )}
        <h2
          className="text-center font-medium"
          style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", fontSize: 35, color: "black", width: 694, marginTop: 28 }}
        >
          {heading}
        </h2>
        <div className="flex items-center justify-center" style={{ gap: 24, marginTop: 32, width: 694 }}>
          <Link
            href={primaryCtaUrl}
            className="flex flex-1 items-center justify-center font-bold"
            style={{ height: 63, borderRadius: 100, backgroundColor: "white", color: "#8015e8", fontSize: 16 }}
          >
            {primaryCtaLabel}
          </Link>
          <Link
            href={secondaryCtaUrl}
            className="flex flex-1 items-center justify-center font-bold text-white"
            style={{ height: 63, borderRadius: 100, background: "linear-gradient(to right, #8015e8, #ba83f0)", fontSize: 16 }}
          >
            {secondaryCtaLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
