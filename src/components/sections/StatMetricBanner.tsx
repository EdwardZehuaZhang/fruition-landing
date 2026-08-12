import type { StatMetric } from "./types"

interface StatMetricBannerProps {
  /** Single high-contrast statement, e.g. "Our clients save 500+ hours yearly…" */
  statement?: string
  /** Optional discrete figures rendered as a bold strip */
  metrics?: StatMetric[]
  theme?: "light" | "dark"
}

/**
 * Full-width metric pull-out. Speaks directly to the bottom line of operations
 * managers (per PDF) - hard numbers in high-contrast type.
 */
export default function StatMetricBanner({
  statement,
  metrics = [],
  theme = "dark",
}: StatMetricBannerProps) {
  if (!statement && metrics.length === 0) return null
  const dark = theme === "dark"

  return (
    <section
      className={`px-4 py-16 ${
        dark
          ? "bg-[linear-gradient(-38deg,var(--purple-primary)_0%,var(--dark-bg)_100%)]"
          : "bg-surface-subtle"
      }`}
    >
      <div className="mx-auto text-center max-w-[980px]">
        {statement && (
          <p
            className={`font-bold text-[clamp(19px,4.5vw,24px)] leading-[1.4] tracking-[-0.01em] ${
              dark ? "text-white" : ""
            }`}
          >
            {statement}
          </p>
        )}
        {metrics.length > 0 && (
          <div className="mt-8 flex flex-wrap items-start justify-center gap-x-8 gap-y-6 md:gap-12">
            {metrics.map((m, i) => (
              <div key={m._key || i} className="flex flex-col items-center min-w-[140px]">
                <span className={`font-bold text-[clamp(30px,8vw,40px)] leading-[1.1] ${dark ? "text-white" : "text-brand"}`}>
                  {m.value}
                </span>
                <span className={`font-mono text-xs font-semibold mt-1.5 ${dark ? "text-white/72" : "text-muted"}`}>
                  {m.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
