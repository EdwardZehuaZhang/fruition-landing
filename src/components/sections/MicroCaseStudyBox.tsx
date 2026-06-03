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
    <section className="bg-white px-4" style={{ paddingTop: 72, paddingBottom: 72 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        {heading && (
          <h2 className="text-section-h2 text-center text-black" style={{ marginBottom: 40 }}>
            {heading}
          </h2>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {cases.map((c, i) => (
            <div
              key={c._key || i}
              className="rounded-card flex flex-col"
              style={{ border: "1px solid #ece7fb", background: "#faf8ff", padding: 28, gap: 14 }}
            >
              {c.challenge && (
                <Row label="The Challenge" value={c.challenge} color="#c0392b" />
              )}
              {c.solution && (
                <Row label="The Solution" value={c.solution} color="#8015e8" />
              )}
              {c.impact && (
                <Row label="The Impact" value={c.impact} color="#1e8449" />
              )}
              {(c.metric || c.metricLabel) && (
                <div className="mt-2 flex items-baseline gap-3" style={{ borderTop: "1px solid #ece7fb", paddingTop: 16 }}>
                  <span className="font-bold" style={{ fontSize: 34, lineHeight: "38px", color: "var(--purple-primary)" }}>
                    {c.metric}
                  </span>
                  <span style={{ fontSize: 13, lineHeight: "18px", color: "#686b82" }}>{c.metricLabel}</span>
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
      <p style={{ fontSize: 15, lineHeight: "22px", color: "#333" }}>{value}</p>
    </div>
  )
}
