import type { TrustBadge } from "./types"

interface TrustBadgeRowProps {
  badges?: TrustBadge[]
  /** Render on a dark background (e.g. directly under a gradient hero) */
  theme?: "light" | "dark"
  compact?: boolean
}

/**
 * Text-based credential pills (Platinum Partner, SOC2, GDPR, Ex-monday Staff…).
 * Complements the image-based SecurityBadgeSection; used where the PDF asks for
 * legible, high-visibility trust strips below the hero.
 */
export default function TrustBadgeRow({
  badges = [],
  theme = "light",
  compact = false,
}: TrustBadgeRowProps) {
  if (!badges.length) return null
  const dark = theme === "dark"

  return (
    <section
      className="px-4"
      style={{
        paddingTop: compact ? 28 : 56,
        paddingBottom: compact ? 28 : 56,
        background: dark ? "transparent" : "var(--surface)",
      }}
    >
      <div className="mx-auto flex flex-wrap items-stretch justify-center" style={{ maxWidth: 1160, gap: 16 }}>
        {badges.map((b, i) => (
          <div
            key={b._key || i}
            className="flex items-center rounded-full"
            style={{
              gap: 12,
              padding: "12px 22px 12px 14px",
              border: `1px solid ${dark ? "rgba(255,255,255,0.18)" : "var(--line-tint)"}`,
              background: dark
                ? "rgba(255,255,255,0.07)"
                : "linear-gradient(180deg, var(--surface) 0%, var(--surface-tint) 100%)",
              boxShadow: dark ? "none" : "0 8px 22px -16px rgba(64,12,140,0.35)",
            }}
          >
            {/* Verified mark */}
            <span
              aria-hidden
              className="shrink-0 flex items-center justify-center rounded-full"
              style={{
                width: 30,
                height: 30,
                background: dark ? "rgba(255,255,255,0.14)" : "var(--surface-tint-2)",
                color: dark ? "var(--white)" : "var(--brand)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="flex flex-col" style={{ gap: 1 }}>
              <span
                className="font-semibold"
                style={{ fontSize: 15, lineHeight: "19px", letterSpacing: "-0.01em", color: dark ? "var(--white)" : "var(--ink-heading)" }}
              >
                {b.label}
              </span>
              {b.detail && (
                <span style={{ fontSize: 12.5, lineHeight: "16px", color: dark ? "rgba(255,255,255,0.65)" : "var(--ink-muted)" }}>
                  {b.detail}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
