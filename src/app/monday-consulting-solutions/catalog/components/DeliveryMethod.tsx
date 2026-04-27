import { METHOD_PHASES } from "../data/method-phases"

export default function DeliveryMethod() {
  return (
    <section id="method">
      <div className="max-w-6xl mx-auto px-5 sm:px-7 py-16 lg:py-20">
        <div className="max-w-[820px] mb-10">
          <div className="text-micro font-semibold tracking-[0.16em] uppercase text-[var(--purple-primary)]">
            Delivery Method
          </div>
          <h2 className="text-section-h2 mt-2 mb-3">How a Fruition build actually ships.</h2>
          <p className="text-body-lead text-[var(--color-text-secondary)]">
            Every solution above runs on the same five-phase delivery method. We treat monday.com
            as a product platform, not a template library, so each phase is about fit and adoption
            as much as configuration.
          </p>
        </div>

        <div
          className="rounded-[var(--radius-card)] p-8 lg:p-10 text-white shadow-card"
          style={{
            background:
              "radial-gradient(700px 280px at 85% -10%, rgba(186,131,240,0.35), transparent 60%), linear-gradient(135deg, #10003a 0%, #2b074d 60%, #550e9b 100%)",
          }}
        >
          <div className="text-[12px] tracking-[0.18em] uppercase font-bold text-white/70">
            The Fruition Delivery Method
          </div>
          <h3 className="text-section-h3 mt-2 mb-8 text-white">
            Discovery to adoption in five phases.
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {METHOD_PHASES.map((p) => (
              <div
                key={p.number}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <div className="text-[11px] tracking-[0.14em] uppercase font-semibold text-[var(--purple-light)]">
                  {p.number}
                </div>
                <h4 className="text-white text-lg font-semibold mt-1.5 mb-2">{p.title}</h4>
                <p className="text-sm leading-relaxed text-white/75">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
