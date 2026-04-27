import { INDUSTRY_ENTRIES } from "../data/industry-map"

export default function IndustryMap() {
  return (
    <section id="industries" className="bg-[var(--light-section-bg)]">
      <div className="max-w-6xl mx-auto px-5 sm:px-7 py-16 lg:py-20">
        <div className="max-w-[820px] mb-10">
          <div className="text-micro font-semibold tracking-[0.16em] uppercase text-[var(--purple-primary)]">
            Industry Map
          </div>
          <h2 className="text-section-h2 mt-2 mb-3">Where the work is actually landing.</h2>
          <p className="text-body-lead text-[var(--color-text-secondary)]">
            The catalog is organized by product category, but clients hire us by industry. This is
            the real map of where our implementations are concentrated over the last twelve months.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {INDUSTRY_ENTRIES.map((ind) => (
            <div
              key={ind.title}
              className="ui-surface-panel-strong p-6 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <h3 className="flex items-center gap-3 text-card-title text-[var(--text-dark)] mb-4">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[rgba(128,21,232,0.08)] text-[var(--purple-primary)] font-bold">
                  {ind.icon}
                </span>
                {ind.title}
              </h3>
              <ul className="space-y-1.5">
                {ind.solutions.map((s) => (
                  <li
                    key={s}
                    className="text-body-sm text-[var(--color-text-secondary)] before:content-['—'] before:mr-2 before:text-[var(--purple-light)]"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
