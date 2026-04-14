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
    <section style={{ backgroundColor: "#f0ecfe" }} className="py-[80px] px-4">
      <div className="mx-auto max-w-[959px] flex flex-col items-center gap-[40px]">
        {heading && (
          <h2 className="text-center text-[28px] font-medium leading-[39.2px] text-black">
            {heading}
          </h2>
        )}
        <div className="w-full rounded-[24px] border border-[#e8e6e6] bg-white py-[12px]">
          {steps.map((step, i) => (
            <div key={step._key || `step-${i}`} className="flex gap-[27px] items-start py-[20px] pl-[8px] pr-[30px] max-w-[740px]">
              <span className="text-[48px] font-extralight text-[#8015e8] leading-[normal] text-center w-[75px] shrink-0">
                {step.number || String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[14px] text-black leading-[22.4px] flex-1 pt-[6px]">
                <span className="font-bold">{step.title}</span>
                {step.description && <span className="font-normal"> {step.description}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
