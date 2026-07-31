import Image from "next/image"
import { urlFor } from "@/sanity/image"
import Reveal from "./Reveal"

export interface ClientLogo {
  _key?: string
  alt?: string
  image?: { asset?: { _ref?: string } }
}

interface Props {
  logos: ClientLogo[]
}

/**
 * Client logo wall — a dense 5×4 grid drawn from the first 19 usable entries in
 * `siteSettings.carouselLogos`, with the "800+ more" counter as the last cell.
 * Reorder them in Studio to change which clients lead.
 */
/** 5 columns × 4 rows, with the "800+ more" counter taking the last cell. */
const MAX_TILES = 19

/** Exports that reached the CMS without a usable name — hidden until renamed. */
const UNNAMED = /^(screenshot\b|logo(\s|$))/i

export default function ClientsGrid({ logos }: Props) {
  const usable = logos
    .filter((logo) => logo?.image?.asset?._ref)
    .filter((logo) => !UNNAMED.test(logo.alt ?? ""))
    .slice(0, MAX_TILES)

  return (
    <section id="clients" className="scroll-mt-24 bg-surface pt-12 pb-16 md:pb-20 lg:pt-18 lg:pb-24">
      <div className="mx-auto max-w-[1348px] px-5 md:px-8">
        <Reveal className="mx-auto max-w-[660px] text-center">
          <p className="text-micro font-bold tracking-[0.12em] uppercase text-brand">Our clients</p>
          <h2 className="text-section-h2 mt-3.5 text-foreground lg:text-[42px]" style={{ textWrap: "pretty" }}>
            Trusted by teams across 800+ implementations.
          </h2>
          <p className="text-body mx-auto mt-4 max-w-[560px] text-muted lg:text-[17px]" style={{ textWrap: "pretty" }}>
            From national services groups to public-sector agencies in six markets — we stay on
            after go-live.
          </p>
          <span className="mx-auto mt-10 block h-px w-[228px] bg-lilac-quiet" />
        </Reveal>

        {usable.length > 0 && (
          <Reveal className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:mt-12 lg:grid-cols-5 lg:gap-4">
            {usable.map((logo, i) => (
              <div
                key={logo._key ?? i}
                className="flex h-[92px] items-center justify-center rounded-xl bg-mist px-4 py-3.5 transition-colors duration-200 hover:bg-mist-hover lg:h-[104px] lg:px-6 lg:py-5"
              >
                <Image
                  src={urlFor(logo.image).width(260).fit("max").auto("format").url()}
                  alt={logo.alt || "Client logo"}
                  width={130}
                  height={64}
                  className="max-h-full w-auto object-contain"
                />
              </div>
            ))}
            <div className="flex h-[92px] items-center justify-center px-4 lg:h-[104px]">
              <span className="text-xl leading-none font-semibold tracking-[-0.02em] text-brand lg:text-[22px]">
                800+ more
              </span>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
