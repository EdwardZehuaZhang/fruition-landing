"use client"

import { useEffect, useRef, useState } from "react"
import { RICH_MERMAID } from "../data/mermaid-rich"
import type { Solution } from "../data/solutions"

interface SolutionModalProps {
  solution: Solution | null
  onClose: () => void
}

type Tab = 0 | 1 | 2

const TAB_LABELS = ["Overview", "Workflow", "Similar Builds"] as const

export default function SolutionModal({ solution, onClose }: SolutionModalProps) {
  if (!solution) return null
  return <ModalShell key={solution.key} solution={solution} onClose={onClose} />
}

function ModalShell({
  solution,
  onClose,
}: {
  solution: Solution
  onClose: () => void
}) {
  const [tab, setTab] = useState<Tab>(0)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="solution-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      <div
        className="absolute inset-0 bg-[rgba(16,0,58,0.6)] backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-[var(--radius-card)] shadow-card flex flex-col overflow-hidden">
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-3 border-b border-[var(--color-border)]">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--purple-primary)]">
              {solution.tag}
            </div>
            <h2
              id="solution-modal-title"
              className="text-section-h3 text-[var(--text-dark)] mt-1"
            >
              {solution.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 -mt-2 -mr-2 w-9 h-9 rounded-full inline-flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--text-dark)] hover:bg-[#f7f4fe]"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        <div role="tablist" className="flex gap-1 px-6 py-3 border-b border-[var(--color-border)]">
          {TAB_LABELS.map((label, i) => {
            const isActive = i === tab
            return (
              <button
                key={label}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setTab(i as Tab)}
                className={`text-caption px-3 py-1.5 rounded-full transition-colors ${
                  isActive
                    ? "bg-[var(--purple-primary)] text-white"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--purple-primary)]"
                }`}
              >
                <span className="text-[10px] font-bold mr-1.5 opacity-70">{i + 1}</span>
                {label}
              </button>
            )
          })}
        </div>

        <div className="overflow-y-auto px-6 py-6 flex-1">
          {tab === 0 && <OverviewTab solution={solution} />}
          {tab === 1 && <WorkflowTab solution={solution} />}
          {tab === 2 && <SimilarTab solution={solution} />}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] px-6 py-3 bg-[#fafaff]">
          <button
            type="button"
            onClick={() => setTab((Math.max(0, tab - 1)) as Tab)}
            disabled={tab === 0}
            className="text-caption px-3 py-1.5 rounded-full border border-[var(--color-border)] disabled:opacity-40 hover:border-[var(--purple-light)]"
          >
            ← Back
          </button>
          <div className="text-caption text-[var(--color-text-secondary)]">
            Slide {tab + 1} of 3
          </div>
          <button
            type="button"
            onClick={() => setTab((Math.min(2, tab + 1)) as Tab)}
            disabled={tab === 2}
            className="text-caption px-4 py-1.5 rounded-full bg-[var(--purple-primary)] text-white disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

function OverviewTab({ solution }: { solution: Solution }) {
  const description =
    solution.enriched && solution.longDesc ? solution.longDesc : solution.desc

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-card-title text-[var(--text-dark)] mb-3">What this solution does</h3>
        <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
          {description}
        </p>
      </div>

      {solution.highlights?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {solution.highlights.map((h, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--color-border)] bg-white p-4"
            >
              <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--purple-primary)]">
                {h[0]}
              </div>
              <div className="text-body text-[var(--text-dark)] mt-1 leading-snug">{h[1]}</div>
            </div>
          ))}
        </div>
      )}

      {solution.outcomes && solution.outcomes.length > 0 && (
        <RichSection title="Business outcomes">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {solution.outcomes.map((o, i) => (
              <li
                key={i}
                className="text-body-sm text-[var(--color-text-secondary)] before:content-['—'] before:mr-2 before:text-[var(--purple-light)]"
              >
                {o}
              </li>
            ))}
          </ul>
        </RichSection>
      )}

      {solution.modules && solution.modules.length > 0 && (
        <RichSection title="Modules">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {solution.modules.map((m, i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--color-border)] bg-white p-4"
              >
                <div className="text-card-title text-[15px] text-[var(--text-dark)] mb-2">
                  {m.name}
                </div>
                <ul className="space-y-1">
                  {m.items.map((it, j) => (
                    <li key={j} className="text-body-sm text-[var(--color-text-secondary)]">
                      • {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </RichSection>
      )}

      {solution.personas && solution.personas.length > 0 && (
        <RichSection title="Personas">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {solution.personas.map((p, i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--color-border)] bg-white p-3"
              >
                <div className="text-body font-semibold text-[var(--text-dark)]">{p[0]}</div>
                <div className="text-body-sm text-[var(--color-text-secondary)]">{p[1]}</div>
              </div>
            ))}
          </div>
        </RichSection>
      )}

      {solution.phases && solution.phases.length > 0 && (
        <RichSection title="Phasing">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {solution.phases.map((p, i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--color-border)] bg-white p-4"
              >
                <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--purple-primary)]">
                  {p.pn}
                </div>
                <div className="text-body font-semibold text-[var(--text-dark)] mt-1">
                  {p.name}
                </div>
                <p className="text-body-sm text-[var(--color-text-secondary)] mt-1">{p.focus}</p>
              </div>
            ))}
          </div>
        </RichSection>
      )}

      {(solution.kpis?.length ||
        solution.integrations?.length ||
        solution.team) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {solution.kpis && solution.kpis.length > 0 && (
            <MetaPanel title="KPIs">
              <ul className="space-y-1">
                {solution.kpis.map((k, i) => (
                  <li key={i} className="text-body-sm text-[var(--color-text-secondary)]">
                    • {k}
                  </li>
                ))}
              </ul>
            </MetaPanel>
          )}
          {solution.integrations && solution.integrations.length > 0 && (
            <MetaPanel title="Integrations">
              <div className="flex flex-wrap gap-1.5">
                {solution.integrations.map((it, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium px-2 py-0.5 rounded bg-[rgba(128,21,232,0.08)] text-[var(--purple-primary)]"
                  >
                    {it}
                  </span>
                ))}
              </div>
            </MetaPanel>
          )}
          {solution.team && (
            <MetaPanel title="Team">
              <p className="text-body-sm text-[var(--color-text-secondary)]">{solution.team}</p>
            </MetaPanel>
          )}
        </div>
      )}
    </div>
  )
}

function RichSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[var(--purple-primary)] mb-3">
        {title}
      </div>
      {children}
    </div>
  )
}

function MetaPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
      <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--purple-primary)] mb-2">
        {title}
      </div>
      {children}
    </div>
  )
}

function WorkflowTab({ solution }: { solution: Solution }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const diagram = RICH_MERMAID[solution.key] || solution.mermaid

  useEffect(() => {
    let cancelled = false
    setError(null)
    setLoading(true)

    async function render() {
      if (!diagram || !containerRef.current) {
        setLoading(false)
        return
      }
      try {
        const mermaid = (await import("mermaid")).default
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          themeVariables: {
            primaryColor: "#ede9fe",
            primaryTextColor: "#1a0b3d",
            primaryBorderColor: "#7c3aed",
            lineColor: "#7c3aed",
            tertiaryColor: "#fdf4ff",
            fontFamily: "Poppins, system-ui, sans-serif",
          },
          flowchart: { curve: "basis", padding: 12 },
        })
        const id = `mermaid-${solution.key}-${Date.now()}`
        const { svg } = await mermaid.render(id, diagram)
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch (e) {
        if (!cancelled) {
          setError("Could not render diagram. Please try another tab.")
          // Mermaid renders inject orphan SVGs into <body> on errors; clean up.
          document.querySelectorAll('[id^="mermaid-"]').forEach((n) => {
            if (n.parentElement === document.body) n.remove()
          })
          console.error(e)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    render()
    return () => {
      cancelled = true
    }
  }, [diagram, solution.key])

  return (
    <div>
      <h3 className="text-card-title text-[var(--text-dark)] mb-2">Workflow diagram</h3>
      <p className="text-body-sm text-[var(--color-text-secondary)] mb-5">{solution.cap}</p>
      {!diagram ? (
        <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[#faf7ff] p-10 text-center text-[var(--color-text-secondary)]">
          Workflow diagram for this solution is being prepared. Talk to a solutions engineer for a
          live walk-through.
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-3 sm:p-5 overflow-auto min-h-[240px]">
          {loading && (
            <div className="text-body-sm text-[var(--color-text-secondary)] py-10 text-center">
              Rendering diagram…
            </div>
          )}
          {error && <div className="text-body-sm text-[#dc2626] py-4">{error}</div>}
          <div ref={containerRef} className="mermaid-host text-center" />
        </div>
      )}
    </div>
  )
}

function SimilarTab({ solution }: { solution: Solution }) {
  return (
    <div>
      <h3 className="text-card-title text-[var(--text-dark)] mb-2">
        {solution.useCases.length} recent builds in this shape
      </h3>
      <p className="text-body-sm text-[var(--color-text-secondary)] mb-5">
        Each of these is a live or recently-delivered Fruition implementation that runs the same
        operating model.
      </p>
      <div className="space-y-2.5">
        {solution.useCases.map(([name, desc], i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--color-border)] bg-white p-4"
          >
            <div className="text-body font-semibold text-[var(--text-dark)]">{name}</div>
            <div className="text-body-sm text-[var(--color-text-secondary)] mt-1">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
