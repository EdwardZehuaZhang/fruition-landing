import type { RankedSection } from "@/lib/insights/types"

const nf = new Intl.NumberFormat()

/**
 * A ranked breakdown with an in-row proportional bar — the pattern every
 * open-source analytics dashboard uses for "top pages" and "top sources",
 * because the bar makes the shape of the distribution readable at a glance in a
 * way a column of numbers never is.
 */
export default function RankedList({ section }: { section: RankedSection }) {
  const max = section.items.reduce((m, i) => Math.max(m, i.value), 0)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-sm font-semibold text-ink-heading">{section.title}</h3>
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{section.unit}</span>
      </div>

      {section.items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {section.emptyLabel ?? "Nothing recorded in this window."}
        </p>
      ) : (
        <ol className="flex flex-col gap-1">
          {section.items.map((item, i) => (
            <li key={`${item.label}-${i}`} className="relative">
              {/* The bar sits behind the row rather than beside it, so long
                  labels keep the full width instead of being squeezed. */}
              <div
                aria-hidden
                className="absolute inset-y-0 left-0 rounded-sm bg-primary/10"
                style={{ width: max > 0 ? `${Math.max((item.value / max) * 100, 1.5)}%` : "0%" }}
              />
              <div className="relative flex items-center justify-between gap-4 px-2 py-1.5">
                <div className="min-w-0">
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="block truncate text-sm text-ink-heading hover:underline"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="block truncate text-sm text-ink-heading">{item.label}</span>
                  )}
                  {item.sublabel ? (
                    <span className="block truncate text-xs text-muted-foreground">{item.sublabel}</span>
                  ) : null}
                </div>
                <div className="shrink-0 text-right">
                  <span className="block text-sm font-medium tabular-nums text-ink-heading">
                    {nf.format(Math.round(item.value))}
                  </span>
                  {item.secondary ? (
                    <span className="block text-xs text-muted-foreground">{item.secondary}</span>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
