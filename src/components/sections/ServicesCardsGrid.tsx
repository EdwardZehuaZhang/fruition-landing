"use client"

import type { Bullet, SectionTheme } from "./types"

export interface ServiceCard {
  _key?: string
  emoji?: string
  title?: string
  description?: string
  bullets?: Bullet[]
}

interface ServicesCardsGridProps {
  heading?: string
  headingAccent?: string
  subheading?: string
  cards?: ServiceCard[]
  theme?: SectionTheme
}

const DARK_BG = "#2b074d"
const LIGHT_BG = "#f7f5ff"
const ACCENT = "#8015e8"

export default function ServicesCardsGrid({
  heading,
  headingAccent,
  subheading,
  cards = [],
  theme = "dark",
}: ServicesCardsGridProps) {
  if (cards.length === 0) return null

  const isDark = theme === "dark"
  const bg = isDark ? DARK_BG : LIGHT_BG
  const headingColor = isDark ? "#ffffff" : "#000000"
  const subheadingColor = isDark ? "rgba(255,255,255,0.8)" : "#4a4a4a"

  return (
    <section style={{ backgroundColor: bg, paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
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
              <span style={{ color: "#b990f5" }}>{headingAccent}</span>
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
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: 24 }}
        >
          {cards.map((card, i) => (
            <div
              key={card._key || i}
              className="bg-white rounded-card"
              style={{
                padding: 28,
                boxShadow: "var(--shadow-whisper)",
              }}
            >
              {card.emoji && (
                <div
                  style={{
                    fontSize: 32,
                    lineHeight: 1,
                    marginBottom: 12,
                  }}
                >
                  {card.emoji}
                </div>
              )}
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#2b074d",
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
                    color: "#333",
                    whiteSpace: "pre-line",
                    marginBottom: card.bullets?.length ? 16 : 0,
                  }}
                >
                  {card.description}
                </p>
              )}
              {card.bullets && card.bullets.length > 0 && (
                <ul
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {card.bullets.map((b, bi) => (
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
          ))}
        </div>
      </div>
    </section>
  )
}
