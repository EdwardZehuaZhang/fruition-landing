"use client"

import { useState } from "react"
import type { ComparisonTab } from "./types"

interface ComparisonTabsSectionProps {
  heading?: string
  subheading?: string
  tabs?: ComparisonTab[]
}

export default function ComparisonTabsSection({
  heading,
  subheading,
  tabs = [],
}: ComparisonTabsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  if (tabs.length === 0) return null
  const active = tabs[activeIndex]

  return (
    <section className="bg-white py-[80px] px-4">
      <div className="mx-auto max-w-[959px] flex flex-col items-center gap-[40px]">
        {/* Heading + subheading */}
        <div className="flex flex-col gap-[12px] items-center text-center w-full">
          {heading && (
            <h2 className="text-[35px] font-medium text-black leading-[49px]">{heading}</h2>
          )}
          {subheading && (
            <p className="text-[20px] text-black text-center">{subheading}</p>
          )}
        </div>

        {/* Tab pills + content card */}
        <div className="flex flex-col gap-[24px] items-center w-full max-w-[816px]">
          {/* Tab buttons */}
          <div className="flex justify-center gap-[12px] flex-wrap w-full">
            {tabs.map((tab, i) => (
              <button
                key={tab._key || tab.label || i}
                onClick={() => setActiveIndex(i)}
                className={`relative rounded-[99px] px-[31px] py-[7px] text-[16px] transition-all cursor-pointer ${
                  i === activeIndex
                    ? "bg-gradient-to-r from-[#8015e8] to-[#ba83f0] text-white shadow-[2.83px_2.83px_15px_3px_rgba(0,0,0,0.24)]"
                    : "bg-white text-[#2b074d] border border-[#e8e6e6] hover:border-[#8015e8]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content card */}
          <div className="w-full rounded-[24px] border border-[#e8e6e6] py-[12px]">
            {(active?.items ?? []).map((item, i) => (
              <div key={item._key || `item-${i}`} className="flex gap-[27px] items-start py-[20px] pl-[8px] pr-[30px] max-w-[740px]">
                <span className="text-[48px] font-extralight text-[#8015e8] leading-[normal] text-center w-[75px] shrink-0">
                  {item.number || String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 pt-[6px]">
                  {item.description ? (
                    <p className="text-[14px] text-black leading-[22.4px]">
                      <span className="font-bold">{item.title}</span>
                      <span className="font-normal"> {item.description}</span>
                    </p>
                  ) : item.bullets && item.bullets.length > 0 ? (
                    <>
                      <p className="font-bold text-[16px] text-[#2b074d] leading-[22.4px] mb-3">{item.title}</p>
                      <div className="flex flex-col gap-2">
                        {item.bullets.map((b, bi) => (
                          <div key={b._key || `bullet-${bi}`} className="flex items-start gap-2">
                            {b.emoji && <span className="text-[18px] shrink-0">{b.emoji}</span>}
                            <span className="text-[14px] text-black leading-[22.4px]">{b.text}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-[14px] text-black leading-[22.4px]">
                      <span className="font-bold">{item.title}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
