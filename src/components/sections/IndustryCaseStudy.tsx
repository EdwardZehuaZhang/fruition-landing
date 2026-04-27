"use client"

import Link from "next/link"

interface StatItem {
  value: string
  label: string
}

export interface IndustryCaseStudyProps {
  /** Uppercase eyebrow label, e.g. "Retail Case Study" */
  eyebrow?: string
  /** Company / client name displayed as a heading */
  companyName?: string
  /** Description paragraph about the company or use-case */
  description?: string
  /** Blockquote testimonial text (rendered with curly quotes) */
  quote?: string
  /** Attribution line below the quote, e.g. "Name | Role, Company" */
  attribution?: string
  /** Stat figures shown at the bottom */
  stats?: StatItem[]
  /** Image shown on the right side of the card */
  imageSrc?: string
  /** Alt text for the image */
  imageAlt?: string
  /** Optional CTA button label */
  ctaLabel?: string
  /** Optional CTA button href */
  ctaHref?: string
}

export default function IndustryCaseStudy({
  eyebrow,
  companyName,
  description,
  quote,
  attribution,
  stats = [],
  imageSrc,
  imageAlt = "Case study",
  ctaLabel,
  ctaHref,
}: IndustryCaseStudyProps) {
  const hasImage = !!imageSrc

  return (
    <section style={{ backgroundColor: "#2b074d", paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
        <div
          className={`flex flex-col ${hasImage ? "lg:flex-row" : ""} items-stretch`}
          style={{ gap: 48 }}
        >
          {/* Text content */}
          <div className="flex flex-col justify-between" style={{ flex: 1 }}>
            <div>
              {eyebrow && (
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#ba83f0",
                    marginBottom: 12,
                  }}
                >
                  {eyebrow}
                </p>
              )}

              {companyName && (
                <h3
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "white",
                    marginBottom: 8,
                    letterSpacing: "0.04em",
                  }}
                >
                  {companyName}
                </h3>
              )}

              {description && (
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: "24px",
                    color: "rgba(255,255,255,0.85)",
                    marginBottom: 24,
                  }}
                >
                  {description}
                </p>
              )}

              {quote && (
                <blockquote
                  style={{
                    fontSize: 16,
                    lineHeight: "26px",
                    color: "#ba83f0",
                    fontStyle: "italic",
                    borderLeft: "3px solid #ba83f0",
                    paddingLeft: 16,
                    marginBottom: 16,
                  }}
                >
                  &ldquo;{quote}&rdquo;
                </blockquote>
              )}

              {attribution && (
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
                  {attribution}
                </p>
              )}
            </div>

            {/* Stats row */}
            {stats.length > 0 && (
              <div
                className="flex flex-wrap items-end"
                style={{ marginTop: 40, gap: 24 }}
              >
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <p
                      style={{
                        fontSize: 36,
                        fontWeight: 700,
                        color: i === 0 ? "#ba83f0" : "white",
                      }}
                    >
                      {stat.value}
                    </p>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* CTA button */}
            {ctaLabel && ctaHref && (
              <div style={{ marginTop: 32 }}>
                <Link
                  href={ctaHref}
                  className="inline-flex items-center justify-center font-bold text-white"
                  style={{
                    height: 53,
                    borderRadius: 100,
                    background: "linear-gradient(to right, #8015e8, #ba83f0)",
                    fontSize: 16,
                    paddingLeft: 40,
                    paddingRight: 40,
                  }}
                >
                  {ctaLabel}
                </Link>
              </div>
            )}
          </div>

          {/* Right: image */}
          {hasImage && (
            <div
              className="rounded-card overflow-hidden bg-white"
              style={{ flex: 1, minHeight: 340 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
