"use client"

import { useState, useRef, useEffect } from "react"
import type { FaqTab } from "./types"

interface FaqAccordionProps {
  heading?: string
  tabs?: FaqTab[]
}

export default function FaqAccordion({
  heading,
  tabs = [],
}: FaqAccordionProps) {
  const [activeFaqTab, setActiveFaqTab] = useState(0)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = tabsRef.current
    if (!el) return
    const update = () => {
      setCanScrollLeft(el.scrollLeft > 4)
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }
    update()
    el.addEventListener("scroll", update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", update)
      ro.disconnect()
    }
  }, [tabs])

  const scrollBy = (dir: 1 | -1) => {
    const el = tabsRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.max(200, el.clientWidth * 0.6), behavior: "smooth" })
  }

  if (tabs.length === 0) return null
  const currentItems = tabs[activeFaqTab]?.items ?? []

  // FAQPage JSON-LD for rich snippets / "People Also Ask". Flatten every tab's
  // items, drop blanks, dedupe by question. Rendered server-side in the initial
  // HTML so crawlers index it.
  const seenQ = new Set<string>()
  const faqEntities = tabs
    .flatMap((tab) => tab.items ?? [])
    .filter((it) => {
      const q = it.question?.trim()
      const a = it.answer?.trim()
      if (!q || !a) return false
      if (seenQ.has(q)) return false
      seenQ.add(q)
      return true
    })
    .map((it) => ({
      "@type": "Question",
      name: it.question!.trim(),
      acceptedAnswer: { "@type": "Answer", text: it.answer!.trim() },
    }))

  const faqJsonLd =
    faqEntities.length > 0
      ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqEntities }
      : null

  return (
    <section id="faq" className="bg-surface pt-14 pb-20 md:pt-20 md:pb-[120px]">
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <div className="mx-auto flex flex-col px-4 md:px-6 lg:px-8 max-w-[1200px] gap-6">
        {heading && (
          <h2 className="text-section-h2 text-brand">
            {heading}
          </h2>
        )}

        {/* Tab navigation bar with icon-triggered horizontal scroll */}
        <div className="relative h-[52px]">
          <div
            ref={tabsRef}
            className="faq-tab-scroll flex items-start h-full overflow-x-auto overflow-y-hidden"
          >
            {tabs.map((tab, idx) => (
              <button
                key={tab._key || idx}
                onClick={() => { setActiveFaqTab(idx); setOpenFaqIndex(0) }}
                className={`h-full shrink-0 relative cursor-pointer pt-3.5 pb-[17px] px-5 md:px-7 border-b-[3px] ${
                  activeFaqTab === idx ? "border-brand" : "border-transparent"
                }`}
              >
                <span className={`text-sm md:text-base text-center whitespace-nowrap ${activeFaqTab === idx ? "text-brand" : "text-body"}`}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
          {canScrollLeft && (
            <button
              type="button"
              aria-label="Scroll tabs left"
              onClick={() => scrollBy(-1)}
              className="faq-tab-arrow absolute left-0 top-0 h-full w-10 flex items-center justify-start bg-gradient-to-r from-surface via-surface to-transparent text-brand hover:text-brand-dark transition-colors cursor-pointer"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          {canScrollRight && (
            <button
              type="button"
              aria-label="Scroll tabs right"
              onClick={() => scrollBy(1)}
              className="faq-tab-arrow absolute right-0 top-0 h-full w-10 flex items-center justify-end bg-gradient-to-l from-surface via-surface to-transparent text-brand hover:text-brand-dark transition-colors cursor-pointer"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        {/* FAQ items for active tab */}
        <div className="flex flex-col gap-3">
          {currentItems.map((item, i) => (
            <div key={item._key || i} className={i === 0 ? "pt-5" : "pt-6"}>
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                className="w-full flex items-start justify-between gap-3 text-left cursor-pointer min-h-[30px]"
              >
                <span className="min-w-0 text-lg md:text-xl leading-6 text-body">{item.question}</span>
                <div className="shrink-0 w-[30px] h-[30px]">
                  <svg className={`transition-transform ${openFaqIndex === i ? "rotate-180" : ""}`} width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="M8 12L15 19L22 12" stroke="var(--text-body)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
              {openFaqIndex === i && (
                <div className="pb-4 pt-[31px] text-base leading-6 text-body whitespace-pre-line">
                  {item.answer}
                </div>
              )}
              <div className={`border-b border-ui ${openFaqIndex === i ? "mt-0" : "mt-9"}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
