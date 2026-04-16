"use client"

import { useState } from "react"
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

  if (tabs.length === 0) return null
  const currentItems = tabs[activeFaqTab]?.items ?? []

  return (
    <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 120 }}>
      <div className="mx-auto flex flex-col" style={{ width: 959, gap: 24 }}>
        <h2 className="text-section-h2" style={{ color: "var(--purple-primary)" }}>
          {heading}
        </h2>

        {/* Tab navigation bar */}
        <div className="flex items-start overflow-auto" style={{ width: 916, height: 52 }}>
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
              <span style={{ fontSize: 16, color: activeFaqTab === idx ? "#8e5cbf" : "black", textAlign: "center" }}>
                {tab.label}
              </span>
            </button>
          ))}
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
