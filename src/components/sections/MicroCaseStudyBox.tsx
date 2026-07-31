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
    <section className="bg-surface px-4 py-[72px]">
      <div className="mx-auto max-w-[1100px]">
        {heading && (
          <h2 className="text-section-h2 text-center text-body mb-10">
            {heading}
          </h2>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {cases.map((c, i) => (
            <div
              key={c._key || i}
              className="rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised flex flex-col p-7 gap-3.5"
            >
              {c.challenge && (
                <Row label="The Challenge" value={c.challenge} colorClass="text-[#c0392b]" />
              )}
              {c.solution && (
                <Row label="The Solution" value={c.solution} colorClass="text-brand" />
              )}
              {c.impact && (
                <Row label="The Impact" value={c.impact} colorClass="text-[#1e8449]" />
              )}
              {(c.metric || c.metricLabel) && (
                <div className="mt-2 flex items-baseline gap-3 border-t border-ui pt-4">
                  <span className="font-bold text-[34px] leading-[38px] text-brand">
                    {c.metric}
                  </span>
                  <span className="font-mono text-xs font-semibold text-muted">{c.metricLabel}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Row({ label, value, colorClass }: { label: string; value: string; colorClass: string }) {
  return (
    <div>
      <div className={`font-mono text-xs font-semibold uppercase tracking-[0.14em] mb-1 ${colorClass}`}>
        {label}
      </div>
      <p className="text-[15px] leading-[22px] text-body">{value}</p>
    </div>
  )
}
