"use client"

import type { CapabilityCard, SectionTheme } from "./types"

interface CapabilitiesGridProps {
  heading?: string
  headingAccent?: string
  subheading?: string
  cards?: CapabilityCard[]
  theme?: SectionTheme
  columns?: 2 | 3
}

const DARK_BG = "#2b074d"
const LIGHT_BG = "#f7f5ff"
const ACCENT = "#8015e8"

export default function CapabilitiesGrid({
  heading,
  headingAccent,
  subheading,
  cards = [],
  theme = "light",
  columns,
}: CapabilitiesGridProps) {
  if (cards.length === 0) return null

  const isDark = theme === "dark"
  const bg = isDark ? DARK_BG : LIGHT_BG
  const headingColor = isDark ? "#ffffff" : "#000000"
  const subheadingColor = isDark ? "rgba(255,255,255,0.8)" : "#4a4a4a"

  const cols = columns ?? (cards.length <= 4 ? 2 : 3)
  const gridClass =
    cols === 2
      ? "grid grid-cols-1 sm:grid-cols-2"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"

  return (
    <section style={{ backgroundColor: bg, paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
        {(heading || headingAccent) && (
          <h2
            className="text-center font-medium"
            style={{
              fontSize: 35,
              color: headingColor,
              marginBottom: subheading ? 16 : 48,
              lineHeight: 1.25,
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
            className="text-center mx-auto"
            style={{
              fontSize: 17,
              lineHeight: 1.55,
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
                className="bg-white rounded-[20px] border border-[#ece7fb]"
                style={{
                  padding: 28,
                  textAlign: hasBullets ? "left" : "center",
                  boxShadow: "0 1px 2px rgba(43,7,77,0.04)",
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
                    {card.bullets!.map((b, bi) => (
                      <li
                        key={b._key || bi}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
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
                            width: 16,
                            height: 16,
                            flexShrink: 0,
                            marginTop: 3,
                            color: ACCENT,
                            fontWeight: 700,
                          }}
                        >
                          ✓
                        </span>
                        <span>{b.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
