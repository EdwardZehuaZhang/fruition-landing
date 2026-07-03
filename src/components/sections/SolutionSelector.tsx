"use client"

import { useState } from "react"

export interface SolutionOption {
  key: string
  glyph?: string
  label: string
  /** The pain in one line. */
  problem: string
  /** What we configure in monday to solve it. */
  configures: string[]
  /** Headline outcome. */
  outcome: string
}

interface Props {
  eyebrow?: string
  heading?: string
  subheading?: string
  options: SolutionOption[]
  ctaLabel?: string
  ctaUrl?: string
}

/**
 * Clickable bottleneck selector. The visitor picks the pain they recognize and
 * the panel swaps to show exactly how we configure monday to solve it. Drives
 * dwell time and lets a prospect self-select scope before reaching out.
 */
export default function SolutionSelector({
  eyebrow,
  heading,
  subheading,
  options,
  ctaLabel,
  ctaUrl,
}: Props) {
  const [activeKey, setActiveKey] = useState(options[0]?.key)
  if (!options.length) return null
  const active = options.find((o) => o.key === activeKey) ?? options[0]

  return (
    <section className="px-4" style={{ paddingTop: 80, paddingBottom: 80, background: "var(--surface)" }}>
      <div className="mx-auto" style={{ maxWidth: 1040 }}>
        <div className="text-center" style={{ marginBottom: 36, marginInline: "auto", maxWidth: 680 }}>
          {eyebrow && (
            <p className="font-semibold uppercase" style={{ color: "var(--brand)", fontSize: 12, letterSpacing: "0.16em", marginBottom: 12 }}>
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 className="font-bold" style={{ color: "var(--ink-heading)", fontSize: "clamp(26px, 4.5vw, 36px)", lineHeight: 1.2, letterSpacing: "-0.015em", textWrap: "balance" }}>
              {heading}
            </h2>
          )}
          {subheading && (
            <p style={{ color: "var(--ink-soft)", fontSize: 16, lineHeight: "26px", marginTop: 12 }}>{subheading}</p>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-[320px_1fr] md:items-stretch">
          {/* Selector list */}
          <div
            role="tablist"
            aria-label="Choose your bottleneck"
            className="flex flex-col"
            style={{ gap: 10 }}
          >
            {options.map((opt) => {
              const isActive = opt.key === active.key
              return (
                <button
                  key={opt.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveKey(opt.key)}
                  className="cs-filter-pill flex items-center text-left"
                  style={{
                    gap: 14,
                    padding: "18px 20px",
                    borderRadius: 16,
                    cursor: "pointer",
                    border: isActive ? "1px solid var(--brand)" : "1px solid var(--line-tint)",
                    background: isActive ? "linear-gradient(135deg, var(--purple-primary) 0%, var(--purple-light) 100%)" : "var(--surface)",
                    boxShadow: isActive ? "0 18px 36px -24px rgba(128,21,232,0.7)" : "none",
                  }}
                >
                  <span aria-hidden style={{ fontSize: 24, lineHeight: 1 }}>
                    {opt.glyph ?? "•"}
                  </span>
                  <span className="flex flex-col">
                    <span className="font-bold" style={{ fontSize: 15, color: isActive ? "var(--white)" : "var(--ink-heading)" }}>
                      {opt.label}
                    </span>
                    <span style={{ fontSize: 12, lineHeight: "16px", marginTop: 2, color: isActive ? "rgba(255,255,255,0.82)" : "var(--ink-muted)" }}>
                      {opt.problem}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          {/* Solution panel — re-keyed so it re-enters on change */}
          <div
            key={active.key}
            role="tabpanel"
            className="cs-card relative overflow-hidden rounded-card flex flex-col"
            style={{
              padding: 36,
              background: "linear-gradient(135deg, var(--surface-tint) 0%, var(--surface) 55%, var(--surface-tint) 100%)",
              border: "1px solid var(--line-tint)",
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute"
              style={{ top: -120, right: -120, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(128,21,232,0.10) 0%, rgba(128,21,232,0) 70%)" }}
            />
            <div className="relative">
              <p className="font-semibold uppercase" style={{ color: "var(--brand)", fontSize: 11, letterSpacing: "0.16em" }}>
                How we solve it
              </p>
              <h3 className="font-bold" style={{ color: "var(--navy-800)", fontSize: 24, lineHeight: "30px", marginTop: 8, textWrap: "balance" }}>
                {active.label}
              </h3>
              <ul className="flex flex-col" style={{ gap: 12, marginTop: 22 }}>
                {active.configures.map((c, i) => (
                  <li key={i} className="flex items-start" style={{ gap: 12 }}>
                    <span
                      aria-hidden
                      className="flex-none inline-flex items-center justify-center"
                      style={{ width: 22, height: 22, borderRadius: 999, background: "var(--surface-tint-2)", color: "var(--brand)", marginTop: 1 }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    <span style={{ color: "var(--brand-contrast)", fontSize: 15, lineHeight: "22px" }}>{c}</span>
                  </li>
                ))}
              </ul>
              <div
                className="flex flex-wrap items-center justify-between"
                style={{ gap: 16, marginTop: 26, paddingTop: 22, borderTop: "1px solid var(--line-tint)" }}
              >
                <p className="font-semibold" style={{ color: "var(--ink-heading)", fontSize: 15, maxWidth: 360 }}>
                  {active.outcome}
                </p>
                {ctaLabel && ctaUrl && (
                  <a
                    href={ctaUrl}
                    className="inline-flex flex-none items-center justify-center font-semibold"
                    style={{ height: 46, padding: "0 22px", borderRadius: 999, background: "linear-gradient(to right, var(--purple-primary), var(--purple-light))", color: "var(--white)", fontSize: 14 }}
                  >
                    {ctaLabel}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
