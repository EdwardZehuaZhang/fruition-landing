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
 * Client logo wall. The design lays out eleven tiles plus a "300+ more" tile;
 * with a different number of logos the grid simply reflows and the counter
 * stays as the last cell.
 */
export default function ClientsGrid({ logos }: Props) {
  const usable = logos.filter((logo) => logo?.image?.asset?._ref)

  return (
    <section id="clients" className="scroll-mt-24 bg-surface pt-12 pb-16 md:pb-20 lg:pt-18 lg:pb-24">
      <div className="mx-auto max-w-[1348px] px-5 md:px-8">
        <Reveal className="mx-auto max-w-[660px] text-center">
          <p className="text-micro font-bold tracking-[0.12em] uppercase text-brand">Our clients</p>
          <h2 className="text-section-h2 mt-3.5 text-foreground lg:text-[42px]" style={{ textWrap: "pretty" }}>
            Trusted by teams across 300+ implementations.
          </h2>
          <p className="text-body mx-auto mt-4 max-w-[560px] text-muted lg:text-[17px]" style={{ textWrap: "pretty" }}>
            From national services groups to public-sector agencies in six markets — we stay on
            after go-live.
          </p>
          <span className="mx-auto mt-10 block h-px w-[228px] bg-lilac-quiet" />
        </Reveal>

        {usable.length > 0 && (
          <Reveal className="mt-10 grid grid-cols-2 gap-[18px] md:grid-cols-3 lg:mt-12 lg:grid-cols-4">
            {usable.map((logo, i) => (
              <div
                key={logo._key ?? i}
                className="flex h-[132px] items-center justify-center rounded-2xl bg-mist px-[30px] py-[26px] transition-colors duration-200 hover:bg-mist-hover"
              >
                <Image
                  src={urlFor(logo.image).width(320).fit("max").auto("format").url()}
                  alt={logo.alt || "Client logo"}
                  width={160}
                  height={80}
                  className="max-h-full w-auto object-contain"
                />
              </div>
            ))}
            <div className="flex h-[132px] items-center justify-center px-[30px] py-[26px]">
              <span className="text-[26px] leading-none font-semibold tracking-[-0.02em] text-brand">
                300+ more
              </span>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
