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
    <section className="bg-surface px-4 py-20">
      <div className="mx-auto max-w-[1000px]">
        {heading && (
          <h2 className="text-section-h2 text-center text-body mb-10">
            {heading}
          </h2>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Before */}
          <div className="rounded-card border border-[#f0d6d6] bg-[#fdf6f6] p-7">
            <div className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#c0392b] mb-[18px]">
              {beforeLabel}
            </div>
            <ul className="flex flex-col gap-3.5">
              {rows.map((r, i) => (
                <li key={`b-${r._key || i}`} className="flex gap-3 text-[15px] leading-[22px] text-[#5b4040]">
                  <span aria-hidden className="text-[#c0392b] shrink-0 mt-0.5"><X size={16} /></span>
                  <span>{r.before}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* After */}
          <div className="rounded-card border border-[#d6ecd9] bg-[#f5fbf6] p-7">
            <div className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#1e8449] mb-[18px]">
              {afterLabel}
            </div>
            <ul className="flex flex-col gap-3.5">
              {rows.map((r, i) => (
                <li key={`a-${r._key || i}`} className="flex gap-3 text-[15px] leading-[22px] text-[#274d33]">
                  <span aria-hidden className="text-[#1e8449] shrink-0 mt-0.5"><Check size={16} /></span>
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
