import ClientLogoWall from "./ClientLogoWall"
import type { CarouselLogo } from "./types"

interface ClientLogoSectionProps {
  headingPart1?: string
  headingAccent?: string
  description?: string
  logos?: CarouselLogo[]
  /** 2×5 by default — a sample of the industry's clients, not the whole book. */
  maxTiles?: number
}

/**
 * Heading + client logo wall, used on every industry and partnership page.
 *
 * Replaced a scrolling marquee: the logos are proof, and proof should sit still
 * long enough to read. The homepage uses the same `ClientLogoWall` at 5×5.
 */
export default function ClientLogoSection({
  headingPart1 = "Clients who have used our ",
  headingAccent = "monday.com consulting services",
  description,
  logos = [],
  maxTiles = 10,
}: ClientLogoSectionProps) {
  if (!logos.length) return null

  return (
    <section className="bg-surface py-[80px]">
      <div className="mx-auto flex w-full max-w-[1348px] flex-col items-center gap-[35px] px-5 md:px-8">
        <p className="text-section-h3 text-center">
          <span className="text-body">{headingPart1}</span>
          <span className="text-brand">{headingAccent}</span>
        </p>
        {description && (
          <p className="max-w-[860px] text-center text-base leading-[1.6] whitespace-pre-line text-muted">
            {description}
          </p>
        )}
        <ClientLogoWall logos={logos} maxTiles={maxTiles} className="w-full" />
      </div>
    </section>
  )
}
