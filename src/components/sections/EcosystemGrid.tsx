export interface EcosystemApp {
  glyph?: string
  label: string
}

interface Props {
  eyebrow?: string
  heading?: string
  subheading?: string
  apps: EcosystemApp[]
  hubLabel?: string
  /** Caption under the constellation, e.g. "2,000+ apps". */
  countLabel?: string
}

const R = 38 // ring radius as % of the square container

/**
 * Radial "ecosystem" constellation: app nodes orbit a central monday.com hub,
 * joined by faint connector lines with a slow travelling pulse. Desktop renders
 * the ring (trig-positioned); mobile falls back to a hub + chip cloud.
 * Pure CSS/SVG, no client JS. See globals: .eco-line / .wc-hub-glow.
 */
export default function EcosystemGrid({
  eyebrow,
  heading,
  subheading,
  apps,
  hubLabel = "monday.com",
  countLabel,
}: Props) {
  if (!apps?.length) return null
  const n = apps.length

  const positioned = apps.map((app, i) => {
    const angle = (-90 + i * (360 / n)) * (Math.PI / 180)
    return {
      ...app,
      x: 50 + R * Math.cos(angle),
      y: 50 + R * Math.sin(angle),
    }
  })

  return (
    <section
      className="px-4"
      style={{ paddingTop: 88, paddingBottom: 88, background: "linear-gradient(160deg, #2b074d 0%, #10003a 100%)" }}
    >
      <div className="mx-auto" style={{ maxWidth: 1040 }}>
        <div className="text-center" style={{ marginBottom: 44, marginInline: "auto", maxWidth: 680 }}>
          {eyebrow && (
            <p className="font-semibold uppercase" style={{ color: "#ba83f0", fontSize: 12, letterSpacing: "0.18em", marginBottom: 12 }}>
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 className="font-bold" style={{ color: "#fff", fontSize: "clamp(26px, 4.5vw, 38px)", lineHeight: 1.2, letterSpacing: "-0.015em", textWrap: "balance" }}>
              {heading}
            </h2>
          )}
          {subheading && (
            <p style={{ color: "rgba(255,255,255,0.66)", fontSize: 16, lineHeight: "26px", marginTop: 14 }}>{subheading}</p>
          )}
        </div>

        {/* Desktop: radial constellation */}
        <div className="relative mx-auto hidden md:block" style={{ width: "100%", maxWidth: 560, aspectRatio: "1 / 1" }}>
          {/* connector lines */}
          <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden style={{ width: "100%", height: "100%" }}>
            {positioned.map((p, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={p.x}
                y2={p.y}
                stroke="rgba(186,131,240,0.45)"
                strokeWidth="0.4"
                strokeDasharray="2 2"
                className="eco-line"
                style={{ animationDelay: `${i * 0.25}s` }}
              />
            ))}
          </svg>

          {/* app nodes */}
          {positioned.map((p, i) => (
            <div
              key={i}
              className="wc-node absolute flex flex-col items-center justify-center"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: "translate(-50%, -50%)",
                width: 96,
                height: 96,
                borderRadius: 18,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.14)",
                backdropFilter: "blur(4px)",
                animationDelay: `${i * 80}ms`,
              }}
            >
              <span aria-hidden style={{ fontSize: 24, lineHeight: 1 }}>{p.glyph ?? "•"}</span>
              <span className="font-semibold text-center" style={{ color: "#fff", fontSize: 11, lineHeight: "14px", marginTop: 6, padding: "0 6px" }}>
                {p.label}
              </span>
            </div>
          ))}

          {/* central hub */}
          <div
            className="absolute flex flex-col items-center justify-center"
            style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 152, height: 152 }}
          >
            <span
              aria-hidden
              className="wc-hub-glow absolute"
              style={{ inset: -6, borderRadius: "50%", background: "radial-gradient(circle, rgba(186,131,240,0.55) 0%, rgba(186,131,240,0) 70%)" }}
            />
            <div
              className="relative flex flex-col items-center justify-center"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #8015e8 0%, #ba83f0 100%)",
                boxShadow: "0 24px 56px -20px rgba(128,21,232,0.8)",
              }}
            >
              <span aria-hidden style={{ fontSize: 30 }}>📊</span>
              <span className="font-bold" style={{ color: "#fff", fontSize: 15, marginTop: 6 }}>{hubLabel}</span>
            </div>
          </div>
        </div>

        {/* Mobile: hub + chip cloud */}
        <div className="md:hidden flex flex-col items-center">
          <div
            className="flex flex-col items-center justify-center"
            style={{ width: 132, height: 132, borderRadius: "50%", background: "linear-gradient(135deg, #8015e8 0%, #ba83f0 100%)", boxShadow: "0 24px 48px -20px rgba(128,21,232,0.8)" }}
          >
            <span aria-hidden style={{ fontSize: 26 }}>📊</span>
            <span className="font-bold" style={{ color: "#fff", fontSize: 14, marginTop: 4 }}>{hubLabel}</span>
          </div>
          <div className="flex flex-wrap justify-center" style={{ gap: 8, marginTop: 28 }}>
            {apps.map((app, i) => (
              <span
                key={i}
                className="inline-flex items-center font-semibold"
                style={{ gap: 7, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", color: "#fff", fontSize: 13 }}
              >
                <span aria-hidden>{app.glyph ?? "•"}</span>
                {app.label}
              </span>
            ))}
          </div>
        </div>

        {countLabel && (
          <p className="text-center font-semibold" style={{ color: "#ba83f0", fontSize: 15, marginTop: 44 }}>
            {countLabel}
          </p>
        )}
      </div>
    </section>
  )
}
