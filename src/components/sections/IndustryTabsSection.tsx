"use client"

import { useState } from "react"

interface Benefit {
  _key?: string
  emoji?: string
  text?: string
}

interface IndustryTab {
  _key?: string
  label?: string
  title?: string
  description?: string
  benefits?: Benefit[]
}

interface IndustryTabsSectionProps {
  heading?: string
  tabs?: IndustryTab[]
}

export default function IndustryTabsSection({
  heading,
  tabs = [],
}: IndustryTabsSectionProps) {
  const [activeTab, setActiveTab] = useState(0)
  if (tabs.length === 0) return null

  const current = tabs[activeTab]

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #1c024c 0%, #7d14e3 100%)",
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
        {heading && (
          <h2
            className="text-center font-bold text-white"
            style={{ fontSize: 35, lineHeight: "48px", marginBottom: 40 }}
          >
            {heading}
          </h2>
        )}

        {/* Tab pills */}
        <div
          className="flex items-center justify-center flex-wrap"
          style={{ gap: 12, marginBottom: 40 }}
        >
          {tabs.map((tab, idx) => {
            const isActive = idx === activeTab
            return (
              <button
                key={tab._key || idx}
                onClick={() => setActiveTab(idx)}
                className="flex items-center justify-center font-bold"
                style={{
                  height: 39,
                  paddingLeft: 24,
                  paddingRight: 24,
                  borderRadius: 99,
                  fontSize: 14,
                  cursor: "pointer",
                  ...(isActive
                    ? {
                        backgroundColor: "white",
                        color: "#8015e8",
                        boxShadow: "0px 2px 8px rgba(128,21,232,0.35)",
                      }
                    : {
                        backgroundColor: "rgba(255,255,255,0.15)",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.3)",
                      }),
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Active tab content card */}
        <div
          className="mx-auto"
          style={{
            maxWidth: 900,
            backgroundColor: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 24,
            padding: 40,
          }}
        >
          {current?.title && (
            <h3
              className="font-semibold text-white"
              style={{ fontSize: 24, marginBottom: 16 }}
            >
              {current.title}
            </h3>
          )}

          {current?.description && (
            <p
              style={{
                fontSize: 16,
                lineHeight: "25.6px",
                color: "#e8dcfb",
                whiteSpace: "pre-line",
                marginBottom: 28,
              }}
            >
              {current.description}
            </p>
          )}

          {current?.benefits && current.benefits.length > 0 && (
            <>
              <p
                className="font-semibold"
                style={{ fontSize: 16, color: "#ba83f0", marginBottom: 16 }}
              >
                Benefits
              </p>
              <div
                className="grid grid-cols-1 sm:grid-cols-2"
                style={{ gap: 12 }}
              >
                {current.benefits.map((b, i) => (
                  <div
                    key={b._key || i}
                    className="flex items-start"
                    style={{ gap: 10 }}
                  >
                    <span style={{ fontSize: 20, lineHeight: 1 }}>
                      {b.emoji}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        lineHeight: "20px",
                        color: "white",
                      }}
                    >
                      {b.text}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
