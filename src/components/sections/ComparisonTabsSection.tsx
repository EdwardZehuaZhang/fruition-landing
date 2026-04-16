"use client"

import { useState } from "react"
import NumberedStepList from "@/components/common/NumberedStepList"
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
              className="text-section-h2 text-center"
              style={{ color: headingColor }}
            >
              {heading}
            </h2>
          )}
          {subheading && (
            <p
              className="text-body text-center mx-auto"
              style={{ color: subheadingColor, maxWidth: 820 }}
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
            className="w-full rounded-card border py-[12px]"
            style={{
              backgroundColor: cardBg,
              borderColor: isDark ? "transparent" : "#e8e6e6",
            }}
          >
            <NumberedStepList
              items={active?.items ?? []}
              containerClassName="w-full p-0"
              stepRowClassName="ui-step-row"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
