"use client"

import { useMemo, useState } from "react"

export interface CaseStudyCard {
  _key?: string
  title?: string
  /** Pre-resolved on the server (RSC can't pass a resolver function across the boundary). */
  imageUrl?: string | null
  product?: string
  industry?: string
  services?: string
  timeline?: string
  verifiedSource?: string
}

interface Props {
  heading?: string
  subheading?: string
  cards: CaseStudyCard[]
}

const ALL = "All"

/** Distinct, order-preserving non-empty values for one facet. */
function facetValues(cards: CaseStudyCard[], key: "industry" | "product"): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const c of cards) {
    const v = c[key]?.trim()
    if (v && !seen.has(v)) {
      seen.add(v)
      out.push(v)
    }
  }
  return out
}

function FilterRow({
  label,
  options,
  active,
  onPick,
}: {
  label: string
  options: string[]
  active: string
  onPick: (v: string) => void
}) {
  return (
    <div className="flex flex-col" style={{ gap: 10 }}>
      <span
        className="font-semibold uppercase"
        style={{ color: "var(--brand)", fontSize: 11, letterSpacing: "0.16em" }}
      >
        {label}
      </span>
      <div className="flex flex-wrap" style={{ gap: 8 }}>
        {[ALL, ...options].map((opt) => {
          const isActive = active === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onPick(opt)}
              aria-pressed={isActive}
              className="cs-filter-pill inline-flex items-center font-semibold"
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                fontSize: 14,
                cursor: "pointer",
                border: isActive ? "1px solid var(--brand)" : "1px solid var(--line-tint)",
                backgroundColor: isActive ? "var(--brand)" : "var(--surface)",
                color: isActive ? "var(--white)" : "var(--brand-contrast)",
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function TestimonialFilterGrid({ heading, subheading, cards }: Props) {
  const industries = useMemo(() => facetValues(cards, "industry"), [cards])
  const solutions = useMemo(() => facetValues(cards, "product"), [cards])

  const [industry, setIndustry] = useState(ALL)
  const [solution, setSolution] = useState(ALL)

  const filtered = useMemo(
    () =>
      cards.filter(
        (c) =>
          (industry === ALL || c.industry === industry) &&
          (solution === ALL || c.product === solution),
      ),
    [cards, industry, solution],
  )

  if (cards.length === 0) return null

  const showIndustry = industries.length >= 2
  const showSolution = solutions.length >= 2
  // A stable key per filter combination so the entrance animation replays on change.
  const gridKey = `${industry}|${solution}`

  return (
    <section id="case-studies" className="bg-surface" style={{ paddingTop: 96, paddingBottom: 96 }}>
      <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
        {(heading || subheading) && (
          <div style={{ marginBottom: 40, maxWidth: 760 }}>
            {heading && (
              <h2
                className="font-bold"
                style={{
                  fontSize: "clamp(28px, 5vw, 40px)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.015em",
                  color: "var(--navy-800)",
                  textWrap: "balance",
                }}
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p style={{ color: "var(--ink-soft)", fontSize: 17, lineHeight: "26px", marginTop: 14 }}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {(showIndustry || showSolution) && (
          <div
            className="flex flex-col"
            style={{
              gap: 22,
              marginBottom: 40,
              padding: 24,
              borderRadius: 20,
              border: "1px solid var(--line-tint)",
              background: "linear-gradient(180deg, var(--surface) 0%, var(--surface-tint) 100%)",
            }}
          >
            {showIndustry && (
              <FilterRow label="Filter by industry" options={industries} active={industry} onPick={setIndustry} />
            )}
            {showSolution && (
              <FilterRow label="Filter by solution" options={solutions} active={solution} onPick={setSolution} />
            )}
            <div className="flex items-center justify-between" style={{ gap: 12 }}>
              <span style={{ color: "var(--ink-muted)", fontSize: 13 }} aria-live="polite">
                Showing {filtered.length} of {cards.length} success {cards.length === 1 ? "story" : "stories"}
              </span>
              {(industry !== ALL || solution !== ALL) && (
                <button
                  type="button"
                  onClick={() => {
                    setIndustry(ALL)
                    setSolution(ALL)
                  }}
                  className="font-semibold"
                  style={{ color: "var(--brand)", fontSize: 13, cursor: "pointer", background: "none" }}
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div
            className="text-center"
            style={{ padding: "64px 24px", borderRadius: 24, border: "1px dashed var(--line-tint)", color: "var(--ink-muted)" }}
          >
            <p style={{ fontSize: 17, color: "var(--brand-contrast)", fontWeight: 600 }}>
              No success stories match those filters yet.
            </p>
            <p style={{ fontSize: 14, marginTop: 6 }}>Try a broader combination, or reset.</p>
          </div>
        ) : (
          <div key={gridKey} className="flex flex-col" style={{ gap: 40 }}>
            {filtered.map((study, i) => {
              const imgSrc = study.imageUrl
              return (
                <article
                  key={study._key || study.title || i}
                  className="cs-card relative overflow-hidden"
                  style={{
                    borderRadius: 32,
                    background: "linear-gradient(135deg, var(--surface-tint) 0%, var(--surface) 55%, var(--surface-tint) 100%)",
                    padding: 56,
                    animationDelay: `${Math.min(i, 6) * 70}ms`,
                  }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute"
                    style={{
                      top: -120,
                      right: -120,
                      width: 320,
                      height: 320,
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(128,21,232,0.10) 0%, rgba(128,21,232,0) 70%)",
                    }}
                  />

                  <div className="relative">
                    <div className="flex flex-wrap items-center" style={{ gap: 12 }}>
                      <span className="font-bold" style={{ color: "var(--brand)", fontSize: 14, letterSpacing: "0.08em" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span aria-hidden style={{ display: "inline-block", width: 28, height: 1, backgroundColor: "var(--line-tint)" }} />
                      <span className="font-semibold uppercase" style={{ color: "var(--brand)", fontSize: 12, letterSpacing: "0.18em" }}>
                        Case Study
                      </span>
                      {study.verifiedSource && (
                        <span
                          className="inline-flex items-center font-semibold"
                          style={{
                            gap: 6,
                            padding: "5px 12px",
                            borderRadius: 999,
                            backgroundColor: "var(--success-surface)",
                            color: "var(--success-strong)",
                            fontSize: 12,
                          }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          Verified · {study.verifiedSource}
                        </span>
                      )}
                    </div>

                    <h3
                      className="font-bold"
                      style={{
                        fontSize: "clamp(28px, 6vw, 44px)",
                        lineHeight: 1.2,
                        letterSpacing: "-0.015em",
                        color: "var(--navy-800)",
                        marginTop: 18,
                        maxWidth: 880,
                        textWrap: "balance",
                      }}
                    >
                      {study.title}
                    </h3>

                    {study.services && (
                      <p style={{ fontSize: 18, lineHeight: "28px", color: "var(--ink-soft)", marginTop: 18, maxWidth: 820 }}>
                        {study.services}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center" style={{ gap: 12, marginTop: 28 }}>
                      {study.industry && (
                        <span
                          className="inline-flex items-center font-semibold"
                          style={{ gap: 8, padding: "8px 16px", borderRadius: 999, backgroundColor: "var(--surface-tint-2)", color: "var(--brand-dark)", fontSize: 14 }}
                        >
                          {study.industry}
                        </span>
                      )}
                      {study.product && (
                        <span
                          className="inline-flex items-center font-semibold"
                          style={{ gap: 8, padding: "8px 16px", borderRadius: 999, backgroundColor: "var(--surface-tint-2)", color: "var(--brand-dark)", fontSize: 14 }}
                        >
                          <span aria-hidden style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--brand)" }} />
                          {study.product}
                        </span>
                      )}
                      {study.timeline && (
                        <span
                          className="inline-flex items-center font-medium"
                          style={{ gap: 8, padding: "8px 16px", borderRadius: 999, border: "1px solid var(--line-tint)", backgroundColor: "var(--surface)", color: "var(--brand-contrast)", fontSize: 14 }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <circle cx="12" cy="12" r="9" />
                            <polyline points="12 7 12 12 15 14" />
                          </svg>
                          {study.timeline}
                        </span>
                      )}
                    </div>

                    {imgSrc && (
                      <div style={{ marginTop: 40 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imgSrc} alt={study.title || "Case study"} className="w-full h-auto block" style={{ borderRadius: 20 }} />
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
