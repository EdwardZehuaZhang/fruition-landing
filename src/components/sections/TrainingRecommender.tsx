"use client"

import { useId, useMemo, useState } from "react"

type Format = {
  name: string
  blurb: string
  fit: string
}

const FORMATS: Record<"selfPaced" | "bootcamp" | "enterprise", Format> = {
  selfPaced: {
    name: "Self-Paced Hybrid",
    blurb: "On-demand modules plus scheduled office hours.",
    fit: "Right for small teams who can learn alongside their work.",
  },
  bootcamp: {
    name: "Live Bootcamp",
    blurb: "Instructor-led sessions over one to two weeks.",
    fit: "Right for a single department onboarding together at pace.",
  },
  enterprise: {
    name: "Custom Enterprise Track",
    blurb: "Role-based curriculum across every layer of the org.",
    fit: "Right for large or multi-department rollouts needing tailored tracks.",
  },
}

const COMPLEXITY = ["One team, simple workflows", "A few connected teams", "Many departments, custom workflows"]

interface Props {
  eyebrow?: string
  heading?: string
  subheading?: string
  ctaLabel?: string
  ctaUrl?: string
}

/**
 * Self-select recommender: team size + workflow complexity drive a suggested
 * training format. Lets a prospect see the exact scope they need before
 * reaching out, and drives on-page interaction.
 */
export default function TrainingRecommender({
  eyebrow,
  heading,
  subheading,
  ctaLabel,
  ctaUrl,
}: Props) {
  const [teamSize, setTeamSize] = useState(15)
  const [complexity, setComplexity] = useState(1) // index into COMPLEXITY
  const uid = useId()

  const rec = useMemo(() => {
    // Complexity dominates; team size nudges. Enterprise for big or complex orgs.
    if (complexity === 2 || teamSize > 75) return FORMATS.enterprise
    if (complexity === 1 || teamSize > 20) return FORMATS.bootcamp
    return FORMATS.selfPaced
  }, [teamSize, complexity])

  return (
    <section className="px-4" style={{ paddingTop: 80, paddingBottom: 80, background: "#f0ecfe" }}>
      <style>{`
        .tr-range {
          -webkit-appearance: none; appearance: none; width: 100%;
          height: 8px; border-radius: 999px; background: #e2d8f7; outline: none; cursor: pointer;
        }
        .tr-range::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none; width: 24px; height: 24px; border-radius: 50%;
          background: #8015e8; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(128,21,232,0.45); cursor: pointer;
        }
        .tr-range::-moz-range-thumb {
          width: 24px; height: 24px; border-radius: 50%; background: #8015e8;
          border: 3px solid #fff; box-shadow: 0 2px 8px rgba(128,21,232,0.45); cursor: pointer;
        }
        .tr-range::-moz-range-track { height: 8px; border-radius: 999px; background: #e2d8f7; }
      `}</style>

      <div className="mx-auto" style={{ maxWidth: 920 }}>
        <div className="text-center" style={{ marginBottom: 36, marginInline: "auto", maxWidth: 680 }}>
          {eyebrow && (
            <p className="font-semibold uppercase" style={{ color: "#8015e8", fontSize: 12, letterSpacing: "0.16em", marginBottom: 12 }}>
              {eyebrow}
            </p>
          )}
          {heading && <h2 className="text-section-h2 text-body" style={{ textWrap: "balance" }}>{heading}</h2>}
          {subheading && (
            <p style={{ color: "var(--text-muted-fg)", fontSize: 17, lineHeight: "26px", marginTop: 12 }}>{subheading}</p>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:items-stretch">
          {/* Inputs */}
          <div
            className="rounded-card bg-surface-raised flex flex-col justify-center h-full dark:shadow-none dark:border dark:border-ui"
            style={{ padding: 36, border: "1px solid #ece7fb", boxShadow: "0 18px 36px -24px rgba(64,12,140,0.2)" }}
          >
            <label htmlFor={`${uid}-size`} className="flex items-baseline justify-between" style={{ marginBottom: 12 }}>
              <span className="font-semibold" style={{ color: "var(--text-body)", fontSize: 14 }}>Team size</span>
              <span className="font-bold" style={{ color: "#8015e8", fontSize: 15 }}>
                {teamSize} {teamSize === 1 ? "person" : "people"}
              </span>
            </label>
            <input
              id={`${uid}-size`}
              className="tr-range"
              type="range"
              min={1}
              max={150}
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
            />

            <div style={{ height: 32 }} />

            <span className="font-semibold" style={{ color: "var(--text-body)", fontSize: 14, marginBottom: 12, display: "block" }}>
              Workflow complexity
            </span>
            <div className="flex flex-col" style={{ gap: 8 }} role="radiogroup" aria-label="Workflow complexity">
              {COMPLEXITY.map((label, i) => {
                const isActive = complexity === i
                return (
                  <button
                    key={label}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setComplexity(i)}
                    className="cs-filter-pill flex items-center text-left"
                    style={{
                      gap: 10,
                      padding: "12px 14px",
                      borderRadius: 12,
                      cursor: "pointer",
                      border: isActive ? "1px solid #8015e8" : "1px solid var(--border-ui)",
                      background: isActive ? "#f3e9ff" : "var(--surface-raised)",
                    }}
                  >
                    <span
                      aria-hidden
                      className="flex-none inline-flex items-center justify-center"
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 999,
                        border: isActive ? "5px solid #8015e8" : "2px solid #cbbce6",
                        background: "var(--surface-raised)",
                      }}
                    />
                    <span style={{ color: isActive ? "#3b2963" : "var(--text-body)", fontSize: 14 }}>{label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Recommendation */}
          <div
            key={rec.name}
            className="cs-card rounded-card flex flex-col justify-center h-full"
            style={{ padding: 36, background: "linear-gradient(-38deg, rgb(128,21,232) 0%, rgb(16,0,58) 100%)", color: "#fff" }}
          >
            <p className="font-semibold uppercase" style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, letterSpacing: "0.16em" }}>
              Recommended track
            </p>
            <p className="font-bold" style={{ fontSize: 30, lineHeight: "36px", marginTop: 10, textWrap: "balance" }}>
              {rec.name}
            </p>
            <p style={{ color: "rgba(255,255,255,0.86)", fontSize: 15, lineHeight: "24px", marginTop: 12 }}>{rec.blurb}</p>
            <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 13, lineHeight: "20px", marginTop: 14 }}>{rec.fit}</p>
            {ctaLabel && ctaUrl && (
              <a
                href={ctaUrl}
                className="inline-flex items-center justify-center font-semibold self-start"
                style={{ marginTop: 26, height: 48, padding: "0 24px", borderRadius: 999, background: "#fff", color: "#8015e8", fontSize: 14 }}
              >
                {ctaLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
