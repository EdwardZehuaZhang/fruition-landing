"use client"

import { urlFor } from "@/sanity/image"

export interface Partner {
  _key?: string
  name: string
  tier?: string
  description?: string
  /** Inline SVG content for wordmark — legacy, not CMS-driven. */
  wordmark?: React.ReactNode
  /** Sanity image reference for partner logo. */
  logo?: { asset?: { _ref: string } }
  /** Background accent used inside the logo plate. */
  tint?: string
}

interface PartnerEcosystemSectionProps {
  eyebrow?: string
  heading?: string
  headingAccent?: string
  subheading?: string
  partners?: Partner[]
}

const ACCENT = "#8015e8"

export default function PartnerEcosystemSection({
  eyebrow,
  heading,
  headingAccent,
  subheading,
  partners = [],
}: PartnerEcosystemSectionProps) {
  if (partners.length === 0) return null

  return (
    <section
      className="bg-white"
      style={{ paddingTop: 80, paddingBottom: 80 }}
    >
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
            {headingAccent && (
              <span style={{ color: ACCENT }}>{headingAccent}</span>
            )}
          </h2>
        )}
        {subheading && (
          <p
            className="text-body text-center mx-auto"
            style={{
              color: "#4a4a4a",
              maxWidth: 760,
              marginBottom: 48,
            }}
          >
            {subheading}
          </p>
        )}

        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          style={{ gap: 16 }}
        >
          {partners.map((p, i) => (
            <div
              key={p._key || i}
              className="rounded-card border border-[#ece7fb] bg-white flex flex-col"
              style={{
                padding: 20,
                boxShadow: "var(--shadow-whisper)",
                transition: "transform 200ms ease, box-shadow 200ms ease",
              }}
            >
              <div
                className="flex items-center justify-center rounded-[16px]"
                style={{
                  height: 72,
                  background: p.tint || "#f7f5ff",
                  marginBottom: 14,
                }}
              >
                {p.logo?.asset?._ref ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urlFor(p.logo).height(80).url()}
                    alt={p.name}
                    style={{ maxHeight: 40, width: "auto" }}
                  />
                ) : p.wordmark ? (
                  p.wordmark
                ) : (
                  <span style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>{p.name}</span>
                )}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111",
                  marginBottom: 2,
                }}
              >
                {p.name}
              </div>
              {p.tier && (
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: ACCENT,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    marginBottom: p.description ? 6 : 0,
                  }}
                >
                  {p.tier}
                </div>
              )}
              {p.description && (
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: "#4a4a4a",
                  }}
                >
                  {p.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
