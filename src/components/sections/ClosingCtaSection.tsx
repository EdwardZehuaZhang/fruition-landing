/**
 * ClosingCtaSection — the canonical end-of-page conversion banner (DESIGN.md).
 *
 * One dark immersive surface site-wide: Voltage→Midnight gradient, centered
 * mono eyebrow, white section heading with an optional accent span, muted
 * lead, and the on-dark CTA pair. Replaces the previous ~5 divergent closing
 * banners (PracticePageTemplate "Ready to talk?", AiPartnerTemplate final-cta,
 * assorted bespoke gradient banners).
 *
 * Copy resolution: pass `cta` (a Sanity `closingCta` doc via
 * getClosingCtaForPage) and `fallback` (the page's previous hardcoded copy,
 * verbatim). Sanity wins when present, so editors can override any page
 * without a deploy; content is never lost when no doc exists.
 */

export interface ClosingCtaCopy {
  eyebrow?: string
  heading?: string
  /** Substring of `heading` rendered in the accent colour */
  headingAccent?: string
  lead?: string
  primaryLabel?: string
  primaryUrl?: string
  secondaryLabel?: string
  secondaryUrl?: string
}

export interface ClosingCtaStat {
  value?: string
  label?: string
}

function AccentedHeading({ text, accent }: { text: string; accent?: string }) {
  if (!accent) return <>{text}</>
  const idx = text.indexOf(accent)
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-brand-light">{accent}</span>
      {text.slice(idx + accent.length)}
    </>
  )
}

export default function ClosingCtaSection({
  cta,
  fallback,
  stats,
  statsCaption,
}: {
  cta?: ClosingCtaCopy | null
  fallback?: ClosingCtaCopy
  /** Optional proof-stats row (e.g. page.roiStats) rendered between the lead and the buttons. */
  stats?: ClosingCtaStat[]
  /** Small mono caption above the stats row (e.g. "The economic impact of"). */
  statsCaption?: string
}) {
  const copy = cta?.heading ? cta : fallback
  if (!copy?.heading || !copy.primaryLabel || !copy.primaryUrl) return null
  const external = /^https?:/.test(copy.primaryUrl)

  return (
    <section className="bg-[linear-gradient(-38deg,var(--purple-primary)_0%,var(--dark-bg)_100%)] px-4 py-16 text-center md:py-24">
      <div className="mx-auto max-w-[820px]">
        {copy.eyebrow && (
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-light">
            {copy.eyebrow}
          </p>
        )}
        <h2 className="text-section-h2 text-white text-balance">
          <AccentedHeading text={copy.heading} accent={copy.headingAccent} />
        </h2>
        {copy.lead && (
          <p className="mx-auto mt-4 max-w-[56ch] text-body-lead text-white/70">{copy.lead}</p>
        )}
        {(stats?.length ?? 0) > 0 && (
          <div className="mt-8">
            {statsCaption && (
              <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                {statsCaption}
              </p>
            )}
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats!.map((s, i) => (
                <div key={i}>
                  <div className="text-3xl font-semibold text-white md:text-4xl">{s.value}</div>
                  <div className="mt-1 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-4">
          <a
            href={copy.primaryUrl}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="cta-btn cta-btn-on-dark-primary"
          >
            {copy.primaryLabel}
          </a>
          {copy.secondaryLabel && copy.secondaryUrl && (
            <a href={copy.secondaryUrl} className="cta-btn cta-btn-on-dark-outline">
              {copy.secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
