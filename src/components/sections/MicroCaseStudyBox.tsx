import type { MicroCaseStudy } from "./types"

interface MicroCaseStudyBoxProps {
  heading?: string
  cases?: MicroCaseStudy[]
}

/**
 * Challenge → Solution → Impact result boxes. Social proof at the decision
 * point; anchors Fruition as a partner that drives measurable ROI (per PDF).
 */
export default function MicroCaseStudyBox({
  heading,
  cases = [],
}: MicroCaseStudyBoxProps) {
  if (!cases.length) return null

  return (
    <section className="bg-surface px-4" style={{ paddingTop: 72, paddingBottom: 72 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        {heading && (
          <h2 className="text-section-h2 text-center text-ink" style={{ marginBottom: 40 }}>
            {heading}
          </h2>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {cases.map((c, i) => (
            <div
              key={c._key || i}
              className="rounded-card flex flex-col"
              style={{ border: "1px solid var(--line-tint)", background: "var(--surface-tint)", padding: 28, gap: 14 }}
            >
              {c.challenge && (
                <Row label="The Challenge" value={c.challenge} color="var(--danger)" />
              )}
              {c.solution && (
                <Row label="The Solution" value={c.solution} color="var(--brand)" />
              )}
              {c.impact && (
                <Row label="The Impact" value={c.impact} color="var(--success-strong)" />
              )}
              {(c.metric || c.metricLabel) && (
                <div className="mt-2 flex items-baseline gap-3" style={{ borderTop: "1px solid var(--line-tint)", paddingTop: 16 }}>
                  <span className="font-bold" style={{ fontSize: 34, lineHeight: "38px", color: "var(--brand)" }}>
                    {c.metric}
                  </span>
                  <span style={{ fontSize: 13, lineHeight: "18px", color: "var(--ink-muted)" }}>{c.metricLabel}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Row({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div className="font-bold" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color, marginBottom: 4 }}>
        {label}
      </div>
      <p style={{ fontSize: 15, lineHeight: "22px", color: "var(--ink-soft)" }}>{value}</p>
    </div>
  )
}
