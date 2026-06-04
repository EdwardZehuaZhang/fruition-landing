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
 * managers (per PDF) — hard numbers in high-contrast type.
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
      className="px-4"
      style={{
        paddingTop: 64,
        paddingBottom: 64,
        background: dark
          ? "linear-gradient(-38deg, rgb(128,21,232) 0%, rgb(16,0,58) 100%)"
          : "#f0ecfe",
      }}
    >
      <div className="mx-auto text-center" style={{ maxWidth: 980 }}>
        {statement && (
          <p
            className="font-bold"
            style={{
              fontSize: 24,
              lineHeight: "34px",
              letterSpacing: "-0.01em",
              color: dark ? "#fff" : "#10003a",
            }}
          >
            {statement}
          </p>
        )}
        {metrics.length > 0 && (
          <div className="mt-8 flex flex-wrap items-start justify-center gap-x-8 gap-y-6 md:gap-12">
            {metrics.map((m, i) => (
              <div key={m._key || i} className="flex flex-col items-center" style={{ minWidth: 140 }}>
                <span className="font-bold" style={{ fontSize: 40, lineHeight: "44px", color: dark ? "#fff" : "var(--purple-primary)" }}>
                  {m.value}
                </span>
                <span style={{ fontSize: 14, lineHeight: "20px", color: dark ? "rgba(255,255,255,0.72)" : "#686b82", marginTop: 6 }}>
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
