"use client"

import { useState } from "react"

export interface ServicesWorkflowBenefit {
  emoji: string
  label: string
}

export interface ServicesWorkflowTab {
  key: string
  label: string
  heading: string
  description: string
  benefits: ServicesWorkflowBenefit[]
}

interface ServicesWorkflowTabsProps {
  heading?: string
  tabs: ServicesWorkflowTab[]
}

export default function ServicesWorkflowTabs({ heading, tabs }: ServicesWorkflowTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  if (!tabs || tabs.length === 0) return null
  const active = tabs[activeIndex]

  return (
    <section className="bg-surface" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
        {heading && (
          <h2
            className="text-section-h2 text-center"
            style={{ color: "var(--text-body)", marginBottom: 32 }}
          >
            {heading}
          </h2>
        )}

        {/* Tab pills */}
        <div
          className="flex justify-center gap-3 flex-wrap"
          style={{ marginBottom: 40 }}
        >
          {tabs.map((tab, i) => {
            const isActive = i === activeIndex
            return (
              <button
                key={tab.key}
                onClick={() => setActiveIndex(i)}
                className={`relative inline-flex items-center justify-center rounded-[99px] px-[24px] py-[8px] text-[15px] leading-[1.2] transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-[#8015e8] to-[#ba83f0] text-white shadow-[2.83px_2.83px_15px_3px_rgba(0,0,0,0.24)]"
                    : "bg-surface-raised text-body border border-ui hover:border-[#8015e8]"
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Active panel */}
        <div
          className="rounded-card border border-ui bg-surface-raised"
          style={{ padding: 40 }}
        >
          <h3
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "var(--text-body)",
              marginBottom: 16,
              lineHeight: 1.2,
            }}
          >
            {active.heading}
          </h3>
          <p
            style={{
              fontSize: 16,
              lineHeight: "26px",
              color: "var(--text-muted-fg)",
              marginBottom: 32,
            }}
          >
            {active.description}
          </p>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#8015e8",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Benefits
          </div>
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7"
            style={{ gap: 16 }}
          >
            {active.benefits.map((b, i) => (
              <div
                key={`${active.key}-b-${i}`}
                className="flex flex-col items-center text-center"
                style={{
                  padding: 16,
                  borderRadius: 12,
                  backgroundColor: "var(--surface-subtle)",
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 28, lineHeight: 1 }}>{b.emoji}</div>
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: "18px",
                    color: "var(--text-body)",
                    fontWeight: 500,
                  }}
                >
                  {b.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
