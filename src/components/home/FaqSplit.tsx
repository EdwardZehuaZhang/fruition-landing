import { ChevronDown } from "lucide-react"
import Reveal from "./Reveal"
import { FAQS } from "./data"

interface Props {
  contactEmail: string
}

/**
 * FAQ — sticky intro beside a plain `<details>` list.
 *
 * Answers are deliberately short and self-contained, and the same set is
 * emitted as FAQPage JSON-LD so answer engines can lift them directly.
 */
export default function FaqSplit({ contactEmail }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }

  return (
    <section className="bg-surface py-16 md:py-20 lg:py-26">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto grid max-w-[1348px] grid-cols-1 items-start gap-10 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-22">
        <Reveal className="lg:sticky lg:top-10">
          <p className="text-micro font-bold tracking-[0.12em] uppercase text-brand">FAQs</p>
          <h2 className="text-section-h2 mt-4 text-foreground lg:text-[42px]" style={{ textWrap: "pretty" }}>
            Ask us anything — we answer in plain language.
          </h2>
          <p className="text-body mt-5 max-w-[340px] text-muted lg:text-[17px]">
            Every answer is under 50 words and self-contained, mirrored in FAQPage schema for AEO.
          </p>
          <div className="mt-9 border-t border-lilac pt-7">
            <p className="text-body-sm mb-4.5 max-w-[300px] text-muted lg:text-[15px]">
              Prefer a person? A consultant will answer in one business day.
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="text-[15px] font-semibold text-brand hover:text-[color:var(--blue-press)]"
            >
              {contactEmail} →
            </a>
          </div>
        </Reveal>

        <Reveal>
          {FAQS.map((faq, i) => (
            <details key={faq.question} className="group border-b border-lilac">
              <summary className="flex cursor-pointer list-none items-start gap-5 py-6 text-foreground hover:text-brand [&::-webkit-details-marker]:hidden">
                <span className="flex-none pt-1 font-mono text-[13px] font-semibold text-brand-light">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[17px] leading-[1.45] font-medium tracking-[-0.01em] lg:text-[19px]" style={{ textWrap: "pretty" }}>
                  {faq.question}
                </span>
                <span className="flex-none pt-1.25">
                  <ChevronDown
                    size={18}
                    strokeWidth={2}
                    aria-hidden
                    className="text-brand transition-transform duration-200 group-open:rotate-180"
                  />
                </span>
              </summary>
              <p className="text-body pt-0 pr-0 pb-7 pl-9 text-muted lg:pr-11 lg:pl-11.25" style={{ textWrap: "pretty" }}>
                {faq.answer}
              </p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
