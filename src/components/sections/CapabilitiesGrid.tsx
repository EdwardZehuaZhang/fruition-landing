"use client"

import Link from "next/link"
import type { CapabilityCard, SectionTheme } from "./types"

interface CapabilitiesGridProps {
  eyebrow?: string
  heading?: string
  headingAccent?: string
  subheading?: string
  cards?: CapabilityCard[]
  theme?: SectionTheme
  columns?: 2 | 3
  ctaLabel?: string
  ctaUrl?: string
}

const DARK_BG = "#2b074d"
const LIGHT_BG = "#f7f5ff"
const ACCENT = "#8015e8"

export default function CapabilitiesGrid({
  eyebrow,
  heading,
  headingAccent,
  subheading,
  cards = [],
  theme = "light",
  columns,
  ctaLabel,
  ctaUrl,
}: CapabilitiesGridProps) {
  if (cards.length === 0) return null

  const isDark = theme === "dark"
  const bg = isDark ? DARK_BG : LIGHT_BG
  const headingColor = isDark ? "#ffffff" : "#000000"
  const subheadingColor = isDark ? "rgba(255,255,255,0.8)" : "#4a4a4a"
  const eyebrowColor = isDark ? "rgba(255,255,255,0.75)" : ACCENT

  const cols = columns ?? (cards.length <= 4 ? 2 : 3)
  const gridClass =
    cols === 2
      ? "grid grid-cols-1 sm:grid-cols-2"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"

  return (
    <section style={{ backgroundColor: bg, paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
        {eyebrow && (
          <div
            className="text-center"
            style={{
              color: eyebrowColor,
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
            style={{
              color: headingColor,
              marginBottom: subheading ? 16 : 48,
            }}
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
              color: subheadingColor,
              maxWidth: 820,
              marginBottom: 48,
              whiteSpace: "pre-line",
            }}
          >
            {subheading}
          </p>
        )}
        <div className={gridClass} style={{ gap: 24 }}>
          {cards.map((card, i) => {
            const hasBullets = (card.bullets?.length ?? 0) > 0
            return (
              <div
                key={card._key || i}
                className="bg-white rounded-card border border-[#ece7fb]"
                style={{
                  padding: 28,
                  textAlign: hasBullets ? "left" : "center",
                  boxShadow: "var(--shadow-whisper)",
                }}
              >
                {card.emoji && (
                  <div
                    style={{
                      fontSize: 32,
                      lineHeight: 1,
                      marginBottom: 12,
                      textAlign: hasBullets ? "left" : "center",
                    }}
                  >
                    {card.emoji}
                  </div>
                )}
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: ACCENT,
                    marginBottom: 10,
                  }}
                >
                  {card.title}
                </h3>
                {card.description && (
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: "#111",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {card.description}
                  </p>
                )}
                {hasBullets && (
                  <ul
                    style={{
                      marginTop: 16,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {card.bullets!.map((b, bi) => {
                      const bulletEmoji = (b as { emoji?: string }).emoji
                      return (
                        <li
                          key={b._key || bi}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            fontSize: 14,
                            lineHeight: 1.5,
                            color: "#111",
                          }}
                        >
                          <span
                            aria-hidden
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: bulletEmoji ? 20 : 16,
                              height: 20,
                              flexShrink: 0,
                              marginTop: 1,
                              color: bulletEmoji ? "inherit" : ACCENT,
                              fontSize: bulletEmoji ? 16 : 14,
                              fontWeight: 700,
                            }}
                          >
                            {bulletEmoji || "✓"}
                          </span>
                          <span>{b.text}</span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
        {ctaLabel && ctaUrl && (
          <div className="flex justify-center" style={{ marginTop: 40 }}>
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
