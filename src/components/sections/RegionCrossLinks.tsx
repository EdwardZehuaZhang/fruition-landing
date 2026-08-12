import Link from "next/link"
import { otherRegions } from "@/data/regions"

interface Props {
  /** Path of the page rendering this strip; it is excluded from the list. */
  currentHref: string
  heading?: string
}

/**
 * Peer navigation between the six regional partner pages.
 *
 * Uses the dashed-ledger row pattern DESIGN.md calls out for region data:
 * label left in 500 weight, mono delivery note right in Ink Soft, rows
 * separated by dashed hairlines. Hover moves the row to the accent, the one
 * sanctioned response.
 */
export default function RegionCrossLinks({
  currentHref,
  heading = "Fruition in other regions",
}: Props) {
  const regions = otherRegions(currentHref)
  if (regions.length === 0) return null

  return (
    <section className="bg-surface-subtle px-4 py-14 md:py-20">
      <div className="mx-auto w-full max-w-[900px]">
        <p className="text-micro font-bold tracking-[0.12em] text-brand uppercase">
          Global delivery
        </p>
        <h2 className="text-section-h3 mt-3 text-foreground">{heading}</h2>

        <ul className="mt-8 border-t border-dashed border-ui">
          {regions.map((region) => (
            <li key={region.href} className="border-b border-dashed border-ui">
              <Link
                href={region.href}
                className="group flex flex-wrap items-center gap-x-4 gap-y-1 py-4 transition-colors"
              >
                <span aria-hidden className="text-xl leading-none">
                  {region.flag}
                </span>
                <span className="text-caption font-medium text-foreground group-hover:text-brand">
                  monday.com partner in {region.label}
                </span>
                <span className="text-micro ml-auto font-mono text-muted">
                  {region.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
