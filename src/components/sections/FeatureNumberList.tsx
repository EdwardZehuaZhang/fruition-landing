"use client"

import type { FeatureNumberItem, SectionTheme } from "./types"

interface FeatureNumberListProps {
  heading?: string
  headingAccent?: string
  subheading?: string
  items?: FeatureNumberItem[]
  theme?: SectionTheme
  columns?: 2 | 3
}

const DARK_BG = "#2b074d"
const LIGHT_BG = "#f7f5ff"
const NUMBER_COLOR_DARK = "#b990f5"
const NUMBER_COLOR_LIGHT = "#8015e8"

export default function FeatureNumberList({
  heading,
  headingAccent,
  subheading,
  items = [],
  theme = "dark",
  columns = 2,
}: FeatureNumberListProps) {
  if (items.length === 0) return null

  const isDark = theme === "dark"
  const bg = isDark ? DARK_BG : LIGHT_BG
  const headingColor = isDark ? "#ffffff" : "#000000"
  const subheadingColor = isDark ? "rgba(255,255,255,0.8)" : "#4a4a4a"
  const titleColor = isDark ? "#ffffff" : "#111"
  const descColor = isDark ? "rgba(255,255,255,0.8)" : "#333"
  const numberColor = isDark ? NUMBER_COLOR_DARK : NUMBER_COLOR_LIGHT

  const gridClass =
    columns === 3
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid grid-cols-1 md:grid-cols-2"

  return (
    <section style={{ backgroundColor: bg, paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto px-4" style={{ maxWidth: 1100 }}>
        {(heading || headingAccent) && (
          <h2
            className="text-section-h2 text-center"
            style={{
              color: headingColor,
              marginBottom: subheading ? 14 : 40,
            }}
          >
            {heading}
            {headingAccent && (
              <span style={{ color: NUMBER_COLOR_DARK }}>{headingAccent}</span>
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
        <div className={gridClass} style={{ gap: 36, rowGap: 44 }}>
          {items.map((item, i) => (
            <div key={item._key || i} style={{ maxWidth: 460 }}>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 600,
                  color: numberColor,
                  lineHeight: 1,
                  marginBottom: 10,
                }}
              >
                {item.number || String(i + 1).padStart(2, "0")}
              </div>
              {item.title && (
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: titleColor,
                    marginBottom: 6,
                    lineHeight: 1.35,
                  }}
                >
                  {item.title}
                </h3>
              )}
              {item.description && (
                <p
                  style={{
                    fontSize: 13.5,
                    lineHeight: 1.55,
                    color: descColor,
                    whiteSpace: "pre-line",
                  }}
                >
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
