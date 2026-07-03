import { Check, X } from "lucide-react"
import type { BeforeAfterRow } from "./types"

interface BeforeAfterSectionProps {
  heading?: string
  beforeLabel?: string
  afterLabel?: string
  rows?: BeforeAfterRow[]
}

/**
 * Two-column Before/After process-transformation grid. Enterprise buyers seek
 * clarity on how consulting shifts them away from messy spreadsheets (per PDF).
 */
export default function BeforeAfterSection({
  heading,
  beforeLabel = "Before",
  afterLabel = "After",
  rows = [],
}: BeforeAfterSectionProps) {
  if (!rows.length) return null

  return (
    <section className="bg-surface px-4" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 1000 }}>
        {heading && (
          <h2 className="text-section-h2 text-center text-ink" style={{ marginBottom: 40 }}>
            {heading}
          </h2>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Before */}
          <div className="rounded-card" style={{ border: "1px solid var(--danger)", background: "var(--danger-surface)", padding: 28 }}>
            <div className="font-bold" style={{ color: "var(--danger)", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 18 }}>
              {beforeLabel}
            </div>
            <ul className="flex flex-col" style={{ gap: 14 }}>
              {rows.map((r, i) => (
                <li key={`b-${r._key || i}`} className="flex gap-3" style={{ color: "#5b4040", fontSize: 15, lineHeight: "22px" }}>
                  <span aria-hidden style={{ color: "var(--danger)", flexShrink: 0, marginTop: 2 }}><X size={16} /></span>
                  <span>{r.before}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* After */}
          <div className="rounded-card" style={{ border: "1px solid var(--success)", background: "var(--success-surface)", padding: 28 }}>
            <div className="font-bold" style={{ color: "var(--success-strong)", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 18 }}>
              {afterLabel}
            </div>
            <ul className="flex flex-col" style={{ gap: 14 }}>
              {rows.map((r, i) => (
                <li key={`a-${r._key || i}`} className="flex gap-3" style={{ color: "#274d33", fontSize: 15, lineHeight: "22px" }}>
                  <span aria-hidden style={{ color: "var(--success-strong)", flexShrink: 0, marginTop: 2 }}><Check size={16} /></span>
                  <span>{r.after}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
