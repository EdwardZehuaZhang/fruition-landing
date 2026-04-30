import { INDUSTRY_ENTRIES, type IndustryIconKey } from "../data/industry-map"

const ICON_PATHS: Record<IndustryIconKey, React.ReactNode> = {
  // Hard hat — construction & trades
  construction: (
    <>
      <path d="M3 18h18" />
      <path d="M5 18a7 7 0 0 1 14 0" />
      <path d="M12 5v6" />
      <path d="M9 11V7a3 3 0 0 1 6 0v4" />
    </>
  ),
  // Factory — manufacturing & operations
  manufacturing: (
    <>
      <path d="M3 21V11l5 3V11l5 3V8l8 6v7Z" />
      <path d="M7 17h2" />
      <path d="M12 17h2" />
      <path d="M17 17h2" />
    </>
  ),
  // Trending up arrow — sales & CRM
  sales: (
    <>
      <path d="M3 17 9 11l4 4 8-8" />
      <path d="M14 4h7v7" />
    </>
  ),
  // Users — professional & people ops
  "people-ops": (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  // Wrench — field service & property
  "field-service": (
    <>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-7 7a1.5 1.5 0 0 0 2.1 2.1l7-7a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.1-2.1Z" />
    </>
  ),
  // Network nodes — integrations & platform
  platform: (
    <>
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="M12 7v4" />
      <path d="m6.5 17.5 5-6" />
      <path d="m17.5 17.5-5-6" />
    </>
  ),
}

function IndustryIcon({ name }: { name: IndustryIconKey }) {
  return (
    <svg
      aria-hidden
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICON_PATHS[name]}
    </svg>
  )
}

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
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[rgba(128,21,232,0.08)] text-[var(--purple-primary)]">
                  <IndustryIcon name={ind.icon} />
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
