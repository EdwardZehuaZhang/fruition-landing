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
    <section className="bg-white px-4" style={{ paddingTop: 72, paddingBottom: 72 }}>
      <div className="mx-auto" style={{ maxWidth: 880 }}>
        {heading && (
          <h2 className="text-section-h2 text-center text-black" style={{ marginBottom: subheading ? 12 : 32 }}>
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="text-center" style={{ color: "#686b82", fontSize: 16, lineHeight: "24px", marginBottom: 32 }}>
            {subheading}
          </p>
        )}
        <ul className="flex flex-col" style={{ gap: 12 }}>
          {items.map((it, i) => (
            <li
              key={it._key || i}
              className="flex items-start gap-3 rounded-card"
              style={{ border: "1px solid #ece7fb", background: "#faf8ff", padding: "16px 20px" }}
            >
              <span
                aria-hidden
                className="shrink-0 flex items-center justify-center font-bold"
                style={{ width: 22, height: 22, borderRadius: 999, background: "#f3e8ff", color: "#8015e8", fontSize: 13, marginTop: 1 }}
              >
                <Check size={14} aria-hidden />
              </span>
              <span style={{ fontSize: 16, lineHeight: "24px", color: "#10003a" }}>{it.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
