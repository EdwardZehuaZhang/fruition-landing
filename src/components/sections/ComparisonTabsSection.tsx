"use client"

import { useState } from "react"
import type { ComparisonTab, SectionTheme } from "./types"

interface ComparisonTabsSectionProps {
  heading?: string
  subheading?: string
  tabs?: ComparisonTab[]
  theme?: SectionTheme
}

const DARK_BG = "#2b074d"

export default function ComparisonTabsSection({
  heading,
  subheading,
  tabs = [],
  theme = "light",
}: ComparisonTabsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  if (tabs.length === 0) return null
  const active = tabs[activeIndex]
  const isDark = theme === "dark"

  const sectionBg = isDark ? DARK_BG : "#ffffff"
  const headingColor = isDark ? "#ffffff" : "#000000"
  const subheadingColor = isDark ? "rgba(255,255,255,0.8)" : "#000000"
  const cardBg = "#ffffff"

  return (
    <section
      className="py-[80px] px-4"
      style={{ backgroundColor: sectionBg }}
    >
      <div className="mx-auto max-w-[959px] flex flex-col items-center gap-[40px]">
        {/* Heading + subheading */}
        <div className="flex flex-col gap-[12px] items-center text-center w-full">
          {heading && (
            <h2
              className="text-[35px] font-medium leading-[49px]"
              style={{ color: headingColor }}
            >
              {heading}
            </h2>
          )}
          {subheading && (
            <p
              className="text-[17px] text-center mx-auto"
              style={{ color: subheadingColor, maxWidth: 820, lineHeight: 1.55 }}
            >
              {subheading}
            </p>
          )}
        </div>

        {/* Tab pills + content card */}
        <div className="flex flex-col gap-[24px] items-center w-full max-w-[816px]">
          {/* Tab buttons */}
          <div className="flex justify-center gap-[12px] flex-wrap w-full">
            {tabs.map((tab, i) => {
              const isActive = i === activeIndex
              const inactiveClass = isDark
                ? "bg-white/10 text-white border border-white/20 hover:border-white/60"
                : "bg-white text-[#2b074d] border border-[#e8e6e6] hover:border-[#8015e8]"
              return (
                <button
                  key={tab._key || tab.label || i}
                  onClick={() => setActiveIndex(i)}
                  className={`relative rounded-[99px] px-[31px] py-[7px] text-[16px] transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#8015e8] to-[#ba83f0] text-white shadow-[2.83px_2.83px_15px_3px_rgba(0,0,0,0.24)]"
                      : inactiveClass
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Content card */}
          <div
            className="w-full rounded-[24px] border py-[12px]"
            style={{
              backgroundColor: cardBg,
              borderColor: isDark ? "transparent" : "#e8e6e6",
            }}
          >
            {(active?.items ?? []).map((item, i) => (
              <div
                key={item._key || `item-${i}`}
                className="flex gap-[27px] items-start py-[20px] pl-[8px] pr-[30px] max-w-[740px]"
              >
                <span className="text-[48px] font-extralight text-[#8015e8] leading-[normal] text-center w-[75px] shrink-0">
                  {item.number || String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 pt-[6px]">
                  {item.description && item.bullets && item.bullets.length > 0 ? (
                    <>
                      <p className="font-bold text-[16px] text-[#2b074d] leading-[22.4px] mb-2">
                        {item.title}
                      </p>
                      <p className="text-[14px] text-black leading-[22.4px] mb-3">
                        {item.description}
                      </p>
                      <div className="flex flex-col gap-2">
                        {item.bullets.map((b, bi) => (
                          <div
                            key={b._key || `bullet-${bi}`}
                            className="flex items-start gap-2"
                          >
                            {b.emoji && (
                              <span className="text-[16px] shrink-0">
                                {b.emoji}
                              </span>
                            )}
                            <span className="text-[14px] text-black leading-[22.4px]">
                              {b.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : item.description ? (
                    <p className="text-[14px] text-black leading-[22.4px]">
                      <span className="font-bold">{item.title}</span>
                      <span className="font-normal"> {item.description}</span>
                    </p>
                  ) : item.bullets && item.bullets.length > 0 ? (
                    <>
                      <p className="font-bold text-[16px] text-[#2b074d] leading-[22.4px] mb-3">
                        {item.title}
                      </p>
                      <div className="flex flex-col gap-2">
                        {item.bullets.map((b, bi) => (
                          <div
                            key={b._key || `bullet-${bi}`}
                            className="flex items-start gap-2"
                          >
                            {b.emoji && (
                              <span className="text-[18px] shrink-0">
                                {b.emoji}
                              </span>
                            )}
                            <span className="text-[14px] text-black leading-[22.4px]">
                              {b.text}
                            </span>
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
