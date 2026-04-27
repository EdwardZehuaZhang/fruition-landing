interface CatalogCtaProps {
  calendlyUrl: string
}

export default function CatalogCta({ calendlyUrl }: CatalogCtaProps) {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-5 sm:px-7 py-16 lg:py-20">
        <div
          className="rounded-[var(--radius-card)] p-10 lg:p-14 text-center text-white shadow-card"
          style={{
            background:
              "linear-gradient(135deg, #550e9b 0%, #8015e8 60%, #ba83f0 100%)",
          }}
        >
          <h2 className="text-section-h2 text-white">
            The 2026 catalog keeps growing every quarter.
          </h2>
          <p className="text-body-lead mt-4 max-w-[640px] mx-auto text-white/85">
            If a client need does not match a template above, it usually becomes next quarter&rsquo;s
            solution. Ask about the ones we are pressure-testing right now.
          </p>
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ui-cta-btn ui-cta-btn-primary mt-8 inline-flex"
          >
            Talk to Zach <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
