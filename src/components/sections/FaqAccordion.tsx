"use client"

import { useState, useRef, useEffect } from "react"
import type { FaqTab } from "./types"

interface FaqAccordionProps {
  heading?: string
  tabs?: FaqTab[]
}

export default function FaqAccordion({
  heading = "Frequently asked questions",
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

  return (
    <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 120 }}>
      <div className="mx-auto flex flex-col px-4 sm:px-6 lg:px-8" style={{ maxWidth: 959, gap: 24 }}>
        <h2 className="text-section-h2" style={{ color: "var(--purple-primary)" }}>
          {heading}
        </h2>

        {/* Tab navigation bar with icon-triggered horizontal scroll */}
        <div className="relative" style={{ height: 52 }}>
          <div
            ref={tabsRef}
            className="faq-tab-scroll flex items-start h-full"
            style={{ overflowX: "auto", overflowY: "hidden" }}
          >
            {tabs.map((tab, idx) => (
              <button
                key={tab._key || idx}
                onClick={() => { setActiveFaqTab(idx); setOpenFaqIndex(0) }}
                className="h-full shrink-0 relative cursor-pointer"
                style={{
                  paddingTop: 14, paddingBottom: 17, paddingLeft: 27.469, paddingRight: 27.469,
                  borderBottom: activeFaqTab === idx ? "3px solid #8e5cbf" : "3px solid transparent",
                }}
              >
                <span style={{ fontSize: 16, color: activeFaqTab === idx ? "#8e5cbf" : "black", textAlign: "center", whiteSpace: "nowrap" }}>
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
              className="absolute left-0 top-0 h-full w-8 flex items-center justify-start bg-gradient-to-r from-white via-white to-transparent"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M15 6l-6 6 6 6" stroke="#8e5cbf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          {canScrollRight && (
            <button
              type="button"
              aria-label="Scroll tabs right"
              onClick={() => scrollBy(1)}
              className="absolute right-0 top-0 h-full w-8 flex items-center justify-end bg-gradient-to-l from-white via-white to-transparent"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M9 6l6 6-6 6" stroke="#8e5cbf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        {/* FAQ items for active tab */}
        <div className="flex flex-col" style={{ gap: 12 }}>
          {currentItems.map((item, i) => (
            <div key={item._key || i} style={{ paddingTop: i === 0 ? 20 : 24 }}>
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
                style={{ height: 30 }}
              >
                <span style={{ fontSize: 20, lineHeight: "24px", color: "black" }}>{item.question}</span>
                <div className="shrink-0" style={{ width: 30, height: 30 }}>
                  <svg className={`transition-transform ${openFaqIndex === i ? "rotate-180" : ""}`} width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="M8 12L15 19L22 12" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
              {openFaqIndex === i && (
                <div style={{ paddingBottom: 16, paddingTop: 31, fontSize: 16, lineHeight: "24px", color: "black", whiteSpace: "pre-line" }}>
                  {item.answer}
                </div>
              )}
              <div style={{ borderBottom: "1px solid #2b074d", marginTop: openFaqIndex === i ? 0 : 36 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
