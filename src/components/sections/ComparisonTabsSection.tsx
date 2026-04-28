"use client"

import { useState } from "react"
import NumberedStepList from "@/components/common/NumberedStepList"
import type { ComparisonTab, ComparisonTabItem, SectionTheme } from "./types"

interface ComparisonTabsSectionProps {
  heading?: string
  subheading?: string
  tabs?: ComparisonTab[]
  theme?: SectionTheme
  /** "tabs" (default) or "sideBySide" for a two-column before/after view */
  layout?: "tabs" | "sideBySide"
  /** Render decorative purple circle bg behind section */
  withPurpleCircle?: boolean
}

const DARK_BG = "#2b074d"

function XIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, marginTop: 2 }}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="10" fill="#EF4444" />
      <path
        d="M6.5 6.5L13.5 13.5M13.5 6.5L6.5 13.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, marginTop: 2 }}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="10" fill="#22C55E" />
      <path
        d="M6 10.5L8.5 13L14 7.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function renderItemText(item: ComparisonTabItem) {
  const number = (item.number || "").trim()
  const hasBoldPrefix =
    number && number !== "✅" && number !== "❌" && number !== "✓" && number !== "✗"
  const description = item.description || item.title || ""
  if (hasBoldPrefix) {
    return (
      <span
        style={{
          fontSize: 15,
          lineHeight: "22px",
          color: "#111",
        }}
      >
        <span style={{ fontWeight: 700 }}>{number}</span>
        {description ? ` ${description}` : ""}
      </span>
    )
  }
  return (
    <span
      style={{
        fontSize: 15,
        lineHeight: "22px",
        color: "#111",
      }}
    >
      {description}
    </span>
  )
}

export default function ComparisonTabsSection({
  heading,
  subheading,
  tabs = [],
  theme = "light",
  layout = "tabs",
  withPurpleCircle = false,
}: ComparisonTabsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  if (tabs.length === 0) return null
  const isDark = theme === "dark"

  const sectionBg = isDark ? DARK_BG : "#ffffff"
  const headingColor = isDark ? "#ffffff" : "#000000"
  const subheadingColor = isDark ? "rgba(255,255,255,0.8)" : "#000000"

  if (layout === "sideBySide" && tabs.length >= 2) {
    const beforeItems = tabs[0]?.items ?? []
    const afterItems = tabs.slice(1).flatMap((t) => t.items ?? [])

    return (
      <section
        className="py-[80px] px-4"
        style={{ backgroundColor: sectionBg }}
      >
        <div className="mx-auto max-w-[1040px] flex flex-col items-center gap-[40px]">
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

          <div
            className="grid w-full"
            style={{
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "start",
            }}
          >
            <ul className="flex flex-col" style={{ gap: 20, listStyle: "none" }}>
              {beforeItems.map((item, i) => (
                <li
                  key={item._key || `before-${i}`}
                  className="flex items-start"
                  style={{ gap: 12 }}
                >
                  <XIcon />
                  {renderItemText(item)}
                </li>
              ))}
            </ul>

            <ul className="flex flex-col" style={{ gap: 20, listStyle: "none" }}>
              {afterItems.map((item, i) => (
                <li
                  key={item._key || `after-${i}`}
                  className="flex items-start"
                  style={{ gap: 12 }}
                >
                  <CheckIcon />
                  {renderItemText(item)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    )
  }

  const active = tabs[activeIndex]
  const cardBg = "#ffffff"

  return (
    <section
      className="py-[80px] px-4 relative overflow-visible"
      style={{ backgroundColor: sectionBg }}
    >
      {withPurpleCircle && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] max-w-none"
          style={{
            backgroundImage: "url(/images/purple-circle-background.avif)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
      )}
      <div className="relative mx-auto max-w-[959px] flex flex-col items-center gap-[40px]">
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
                  className={`relative inline-flex items-center justify-center rounded-[99px] px-[31px] py-[7px] text-[16px] leading-[1.2] transition-all cursor-pointer ${
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
