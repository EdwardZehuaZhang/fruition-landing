"use client"

import Link from "next/link"

export interface OfficeLocation {
  _key?: string
  flag?: string
  city?: string
  region?: string
  address?: string
}

export interface RemoteFeature {
  _key?: string
  emoji?: string
  label?: string
}

interface RemoteTeamSectionProps {
  eyebrow?: string
  heading?: string
  headingAccent?: string
  subheading?: string
  offices?: OfficeLocation[]
  features?: RemoteFeature[]
  ctaLabel?: string
  ctaUrl?: string
}

const ACCENT = "#8015e8"

export default function RemoteTeamSection({
  eyebrow,
  heading,
  headingAccent,
  subheading,
  offices = [],
  features = [],
  ctaLabel,
  ctaUrl,
}: RemoteTeamSectionProps) {
  if (!heading && !headingAccent && offices.length === 0) return null

  return (
    <section style={{ backgroundColor: "#f7f5ff", paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
        {eyebrow && (
          <div
            className="text-center"
            style={{
              color: ACCENT,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            {eyebrow}
          </div>
        )}
        {(heading || headingAccent) && (
          <h2
            className="text-section-h2 text-center"
            style={{ color: "#000", marginBottom: subheading ? 16 : 48 }}
          >
            {heading}
            {headingAccent && <span style={{ color: ACCENT }}>{headingAccent}</span>}
          </h2>
        )}
        {subheading && (
          <p
            className="text-body text-center mx-auto"
            style={{
              color: "#4a4a4a",
              maxWidth: 820,
              marginBottom: 48,
              whiteSpace: "pre-line",
            }}
          >
            {subheading}
          </p>
        )}

        {offices.length > 0 && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
            style={{ gap: 20, marginBottom: 48 }}
          >
            {offices.map((o, i) => (
              <div
                key={o._key || i}
                className="bg-white rounded-card border border-[#ece7fb]"
                style={{
                  padding: 20,
                  textAlign: "center",
                  boxShadow: "var(--shadow-whisper)",
                }}
              >
                {o.flag && (
                  <div style={{ fontSize: 32, lineHeight: 1, marginBottom: 8 }}>
                    {o.flag}
                  </div>
                )}
                {o.city && (
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 2 }}>
                    {o.city}
                  </h3>
                )}
                {o.region && (
                  <div style={{ fontSize: 13, color: ACCENT, fontWeight: 600, marginBottom: 10 }}>
                    {o.region}
                  </div>
                )}
                {o.address && (
                  <p
                    style={{
                      fontSize: 13,
                      lineHeight: 1.5,
                      color: "#4a4a4a",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {o.address}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {features.length > 0 && (
          <div
            className="flex flex-wrap items-center justify-center"
            style={{ gap: 12, marginBottom: ctaLabel ? 40 : 0 }}
          >
            {features.map((f, i) => (
              <div
                key={f._key || i}
                className="bg-white rounded-full border border-[#ece7fb]"
                style={{
                  padding: "10px 18px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#111",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "var(--shadow-whisper)",
                }}
              >
                {f.emoji && <span style={{ fontSize: 16 }}>{f.emoji}</span>}
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        )}

        {ctaLabel && ctaUrl && (
          <div className="flex justify-center">
            <Link
              href={ctaUrl}
              className="flex items-center justify-center font-bold"
              style={{
                height: 53,
                padding: "0 40px",
                borderRadius: 100,
                background: "linear-gradient(to right, #8015e8, #ba83f0)",
                color: "white",
                fontSize: 16,
              }}
            >
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
