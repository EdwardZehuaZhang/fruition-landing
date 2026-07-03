import NumberedStepList from "@/components/common/NumberedStepList"
import type { MethodologyStep } from "./types"

interface MethodologySectionProps {
  heading?: string
  steps?: MethodologyStep[]
}

export default function MethodologySection({
  heading = "Our expert consultants empower you to adopt workflow automation & AI systems",
  steps = [],
}: MethodologySectionProps) {
  if (steps.length === 0) return null

  return (
    <section id="our-process" style={{ backgroundColor: "var(--surface-tint-2)" }} className="py-[80px] px-4">
      <div className="mx-auto max-w-[959px] flex flex-col items-center gap-10">
        {heading && (
          <h2 className="text-section-h3 text-center text-ink">
            {heading}
          </h2>
        )}
        <NumberedStepList items={steps} />
      </div>
    </section>
  )
}
