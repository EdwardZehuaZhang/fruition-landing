import { Fragment } from "react"

export interface WorkflowStep {
  /** Emoji or short glyph shown in the node chip. */
  glyph?: string
  label: string
  sublabel?: string
  /** "hub" renders the central, emphasized monday.com node. */
  tone?: "default" | "hub"
}

interface Props {
  eyebrow?: string
  heading?: string
  subheading?: string
  steps: WorkflowStep[]
  /** Dark surface for the section (recommended for the flow to glow). */
  theme?: "light" | "dark"
  footnote?: string
}

/**
 * Animated left-to-right (stacked on mobile) data-flow rail. Each connector
 * carries a moving pulse to read as data in flight. Pure CSS/SVG, no client
 * JS, reduced-motion safe (see globals: .wc-flow / .wc-node / .wc-hub-glow).
 *
 * Used for the Make.com "scenario" pipeline and the n8n tech-stack rail.
 */
export default function WorkflowConnector({
  eyebrow,
  heading,
  subheading,
  steps,
  theme = "dark",
  footnote,
}: Props) {
  if (!steps?.length) return null

  const dark = theme === "dark"
  const ink = dark ? "#ffffff" : "#10003a"
  const muted = dark ? "rgba(255,255,255,0.66)" : "#56516a"
  const nodeBg = dark ? "rgba(255,255,255,0.06)" : "#ffffff"
  const nodeBorder = dark ? "rgba(255,255,255,0.14)" : "#ece7fb"

  return (
    <section
      className="px-4"
      style={{
        paddingTop: 88,
        paddingBottom: 88,
        background: dark
          ? "linear-gradient(160deg, #2b074d 0%, #10003a 100%)"
          : "#ffffff",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        {(eyebrow || heading || subheading) && (
          <div className="text-center" style={{ marginBottom: 52, marginInline: "auto", maxWidth: 720 }}>
            {eyebrow && (
              <p className="font-semibold uppercase" style={{ color: "#ba83f0", fontSize: 12, letterSpacing: "0.18em", marginBottom: 12 }}>
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2
                className="font-bold"
                style={{ color: ink, fontSize: "clamp(26px, 4.5vw, 38px)", lineHeight: 1.2, letterSpacing: "-0.015em", textWrap: "balance" }}
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p style={{ color: muted, fontSize: 16, lineHeight: "26px", marginTop: 14 }}>{subheading}</p>
            )}
          </div>
        )}

        {/* Rail: row on desktop, column on mobile. Connectors switch axis to match. */}
        <ol
          className="flex flex-col md:flex-row md:items-stretch"
          style={{ gap: 0, listStyle: "none", margin: 0, padding: 0 }}
        >
          {steps.map((step, i) => {
            const isHub = step.tone === "hub"
            const last = i === steps.length - 1
            return (
              <Fragment key={`${step.label}-${i}`}>
                <li
                  className="wc-node relative flex flex-1 flex-col items-center text-center"
                  style={{ animationDelay: `${i * 110}ms`, minWidth: 0 }}
                >
                  {/* node chip */}
                  <div
                    className="relative flex flex-col items-center justify-center"
                    style={{
                      width: "100%",
                      maxWidth: isHub ? 220 : 184,
                      padding: isHub ? "26px 20px" : "22px 18px",
                      borderRadius: 20,
                      background: isHub
                        ? "linear-gradient(135deg, #8015e8 0%, #ba83f0 100%)"
                        : nodeBg,
                      border: isHub ? "none" : `1px solid ${nodeBorder}`,
                      boxShadow: isHub
                        ? "0 22px 48px -22px rgba(128,21,232,0.7)"
                        : dark
                          ? "none"
                          : "0 10px 30px -22px rgba(64,12,140,0.4)",
                    }}
                  >
                    {isHub && (
                      <span
                        aria-hidden
                        className="wc-hub-glow pointer-events-none absolute"
                        style={{
                          inset: -2,
                          borderRadius: 22,
                          background: "radial-gradient(circle at 50% 50%, rgba(186,131,240,0.55) 0%, rgba(186,131,240,0) 70%)",
                          zIndex: 0,
                        }}
                      />
                    )}
                    <span aria-hidden style={{ fontSize: isHub ? 30 : 26, lineHeight: 1, position: "relative", zIndex: 1 }}>
                      {step.glyph ?? "•"}
                    </span>
                    <span
                      className="font-bold"
                      style={{
                        position: "relative",
                        zIndex: 1,
                        marginTop: 10,
                        fontSize: isHub ? 16 : 14,
                        color: isHub ? "#ffffff" : ink,
                      }}
                    >
                      {step.label}
                    </span>
                    {step.sublabel && (
                      <span
                        style={{
                          position: "relative",
                          zIndex: 1,
                          marginTop: 4,
                          fontSize: 12,
                          lineHeight: "16px",
                          color: isHub ? "rgba(255,255,255,0.82)" : muted,
                        }}
                      >
                        {step.sublabel}
                      </span>
                    )}
                  </div>
                </li>

                {!last && (
                  <li
                    aria-hidden
                    className="flex flex-none items-center justify-center"
                    style={{ alignSelf: "center" }}
                  >
                    {/* horizontal connector (desktop) */}
                    <span
                      className="wc-flow hidden md:block"
                      style={{ width: 44, height: 3, borderRadius: 3 }}
                    />
                    {/* vertical connector (mobile) */}
                    <span
                      className="wc-flow-y md:hidden"
                      style={{ width: 3, height: 30, borderRadius: 3, marginBlock: 6 }}
                    />
                  </li>
                )}
              </Fragment>
            )
          })}
        </ol>

        {footnote && (
          <p className="text-center" style={{ color: muted, fontSize: 13, marginTop: 36 }}>
            {footnote}
          </p>
        )}
      </div>
    </section>
  )
}
