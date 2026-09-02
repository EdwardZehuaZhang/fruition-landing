import { generateFaqJsonLdFromPairs, type FaqTextPair } from "@/lib/faqSchema"

interface Props {
  heading: string
  contactLead: string
  items: FaqTextPair[]
  contactEmail?: string
}

/**
 * Two-column FAQ: a sticky heading + contact aside on the left, the questions
 * on the right. Native <details>, so it works without JS and stays a server
 * component.
 *
 * Like FaqAccordion, the FAQPage JSON-LD is generated from exactly the pairs
 * this component renders — never from a separate source — so the markup can't
 * advertise questions the page doesn't show. (The old root-layout FaqHeadJsonLd
 * stamped 124 generic questions onto pages with no FAQ at all.)
 */
export default function RegionFaqSection({
  heading,
  contactLead,
  items,
  contactEmail = "hello@fruitionservices.io",
}: Props) {
  // Dedupe by question so a Sanity edit that repeats a built-in question
  // renders once, matching what the JSON-LD will contain.
  const seen = new Set<string>()
  const rows = items.filter((it) => {
    const q = it.question?.trim()
    if (!q || !it.answer?.trim() || seen.has(q)) return false
    seen.add(q)
    return true
  })
  if (rows.length === 0) return null

  const faqJsonLd = generateFaqJsonLdFromPairs(rows)

  return (
    <section id="faq" className="bg-surface px-4 py-14 md:py-26">
      {faqJsonLd.mainEntity.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-22">
        <div className="lg:sticky lg:top-28">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-[18px]">
            FAQ
          </p>
          <h2 className="text-[28px] font-semibold leading-[1.22] tracking-[-0.02em] text-balance text-foreground md:text-[40px]">
            {heading}
          </h2>
          <div className="mt-9 border-t border-lilac pt-7">
            <p className="mb-4 max-w-[300px] text-body-sm text-muted">{contactLead}</p>
            <a
              href={`mailto:${contactEmail}`}
              className="text-[15px] font-semibold text-brand hover:text-brand-dark"
            >
              {contactEmail} →
            </a>
          </div>
        </div>

        <div>
          {rows.map((item, i) => (
            <details key={item.question} className="group border-b border-lilac">
              <summary className="flex cursor-pointer list-none items-start gap-5 py-6 text-body hover:text-brand [&::-webkit-details-marker]:hidden">
                <span className="flex-none pt-1 font-mono text-[13px] font-semibold text-brand-light">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[17px] font-medium leading-[1.45] tracking-[-0.01em] text-pretty md:text-[19px]">
                  {item.question}
                </span>
                <svg
                  aria-hidden
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mt-1.5 flex-none text-brand transition-transform duration-200 group-open:rotate-180"
                >
                  <path
                    d="m6 9 6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>
              <p className="whitespace-pre-line pb-7 pl-0 pr-0 text-base leading-[1.7] text-pretty text-muted sm:pl-11">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
