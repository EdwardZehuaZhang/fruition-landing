import { Check } from "lucide-react"
import type { ChecklistItem } from "./types"

interface SymptomsChecklistProps {
  heading?: string
  subheading?: string
  items?: ChecklistItem[]
}

/**
 * "Symptoms of an unoptimized workspace" checklist. Mapping common pain points
 * forces prospects to self-identify a need for workflow optimization (per PDF).
 */
export default function SymptomsChecklist({
  heading,
  subheading,
  items = [],
}: SymptomsChecklistProps) {
  if (!items.length) return null

  return (
    <section className="bg-surface px-4 py-18">
      <div className="mx-auto max-w-[880px]">
        {heading && (
          <h2 className={`text-section-h2 text-center text-body ${subheading ? "mb-3" : "mb-8"}`}>
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="text-center text-muted text-base leading-6 mb-8">
            {subheading}
          </p>
        )}
        <ul className="flex flex-col gap-3">
          {items.map((it, i) => (
            <li
              key={it._key || i}
              className="flex items-start gap-3 rounded-card shadow-whisper ring-1 ring-ui bg-surface-raised px-5 py-4"
            >
              <span
                aria-hidden
                className="shrink-0 flex items-center justify-center font-bold w-[22px] h-[22px] rounded-full bg-brand-soft text-brand text-[13px] mt-[1px]"
              >
                <Check size={14} aria-hidden />
              </span>
              <span className="text-base leading-6">{it.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
