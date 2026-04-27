"use client"

import type { ReactNode } from "react"

interface CatalogHeroProps {
  advisorSlot?: ReactNode
}

const STATS = [
  "45 solutions",
  "289 client builds",
  "US, APAC & UK",
  "monday.com Platinum Partner",
]

export default function CatalogHero({ advisorSlot }: CatalogHeroProps) {
  return (
    <header className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px 460px at 85% -10%, rgba(128, 21, 232, 0.16), transparent 60%), radial-gradient(800px 500px at -10% 30%, rgba(186, 131, 240, 0.18), transparent 55%), linear-gradient(180deg, #f8f5ff 0%, #ffffff 75%)",
        }}
      />
      <div className="max-w-6xl mx-auto px-5 sm:px-7 pt-14 pb-20 lg:pt-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
          <div>
            <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-[var(--purple-dark)] bg-white border border-[var(--color-border)] px-3.5 py-2 rounded-full shadow-whisper">
              <span className="relative inline-block w-2 h-2 rounded-full bg-[#22ee8a]">
                <span className="absolute inset-0 rounded-full bg-[#22ee8a] opacity-60 animate-ping" />
              </span>
              2026 Solutions Atlas · Global · 2024 to 2026
            </span>

            <h1 className="text-section-h2 mt-4 max-w-[560px]">
              The full map of what Fruition builds on{" "}
              <span className="text-[var(--purple-primary)]">monday.com</span>.
            </h1>

            <p className="text-body-lead mt-4 max-w-[540px] text-[var(--color-text-secondary)]">
              Tell the advisor your industry and what you are trying to fix. It will match you to
              the right solution from our 2026 catalog.
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {STATS.map((s) => (
                <span
                  key={s}
                  className="text-caption text-[var(--purple-dark)] bg-white border border-[var(--color-border)] px-3 py-1.5 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {advisorSlot ? (
            <div className="lg:sticky lg:top-24">{advisorSlot}</div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
