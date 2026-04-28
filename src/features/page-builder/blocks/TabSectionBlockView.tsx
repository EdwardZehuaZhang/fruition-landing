'use client'

import { useState } from 'react'
import Link from 'next/link'
import NumberedStepList from '@/components/common/NumberedStepList'

interface Feature {
  _key?: string
  icon?: string
  label?: string
}

interface Tab {
  _key?: string
  label?: string
  heading?: string
  body?: string
  ctaLabel?: string
  ctaUrl?: string
  features?: Feature[]
}

interface TabSectionBlockProps {
  heading?: string
  subheading?: string
  tabs?: Tab[]
}

export default function TabSectionBlockView({
  heading,
  subheading,
  tabs,
}: TabSectionBlockProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!tabs || tabs.length === 0) return null

  const active = tabs[activeIndex]
  const manyTabs = tabs.length > 3

  // For 7 tabs (Implement monday.com): split into rows of 3 + 4
  const row1 = manyTabs ? tabs.slice(0, 3) : tabs
  const row2 = manyTabs ? tabs.slice(3) : []

  // Detect if this is the "Implement monday.com for any team" section (7 tabs with 2 rows)
  const isImplementSection = manyTabs

  return (
    <section className="bg-white pt-[80px] pb-[120px] px-4 relative">
      {/* Decorative squiggle bg — only for the "Implement monday.com for any team" section */}
      {isImplementSection && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-[180px] h-[400px] opacity-50"
          style={{
            backgroundImage: "url(/images/bg-squiggle.avif)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
      )}
      <div className="relative mx-auto max-w-[959px] flex flex-col items-center gap-[24px]">
        {/* Heading */}
        {heading && (
          <h2 className="text-center text-[35px] font-medium text-black leading-[49px]">
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="text-center text-[20px] text-black max-w-[959px]">
            {subheading}
          </p>
        )}

        {/* Tab buttons */}
        <div className="flex flex-col items-center gap-[12px] w-full max-w-[816px]">
          {/* Row 1 */}
          <div className="flex justify-center gap-[12px] flex-wrap">
            {row1.map((tab, i) => (
              <button
                key={tab._key ?? i}
                onClick={() => setActiveIndex(i)}
                className={`relative inline-flex items-center justify-center rounded-[99px] px-[27px] py-[7px] text-[16px] leading-[1.2] transition-all ${
                  i === activeIndex
                    ? 'bg-gradient-to-r from-[#8015e8] to-[#ba83f0] text-white shadow-[2.83px_2.83px_15px_3px_rgba(0,0,0,0.24)]'
                    : 'bg-white text-[#10003a] border border-[#e8e6e6] hover:border-[#8015e8]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Row 2 (only for 7+ tabs) */}
          {row2.length > 0 && (
            <div className="flex justify-center gap-[12px] flex-wrap">
              {row2.map((tab, i) => {
                const idx = i + row1.length
                return (
                  <button
                    key={tab._key ?? idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative inline-flex items-center justify-center rounded-[99px] px-[27px] py-[7px] text-[16px] leading-[1.2] transition-all ${
                      idx === activeIndex
                        ? 'bg-gradient-to-r from-[#8015e8] to-[#ba83f0] text-white shadow-[2.83px_2.83px_15px_3px_rgba(0,0,0,0.24)]'
                        : 'bg-white text-[#10003a] border border-[#e8e6e6] hover:border-[#8015e8]'
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Tab content card — 816px wide */}
        <div className="w-full max-w-[816px] rounded-card border border-[#e8e6e6] bg-white p-[24px]">
          {isImplementSection ? (
            /* "Implement monday.com" layout: heading + button row, body text, emoji features grid */
            <div className="flex flex-col gap-[24px]">
              <div className="flex items-start justify-between w-full">
                {active?.heading && (
                  <h3 className="text-[24px] font-medium text-[#2b074d] leading-[33.6px] max-w-[487px]">
                    {active.heading}
                  </h3>
                )}
                {active?.ctaLabel && active?.ctaUrl && (
                  <Link
                    href={active.ctaUrl}
                    className="shrink-0 flex items-center justify-center h-[39px] px-[20px] rounded-[100px] border border-[#8015e8] text-[#8015e8] text-[16px] font-semibold hover:bg-[#8015e8]/5 transition gap-[4px]"
                  >
                    {active.ctaLabel}
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="ml-1">
                      <path d="M1 1L7 7L1 13" stroke="#8015e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                )}
              </div>
              {active?.body && (
                <p className="text-[16px] text-black leading-[22.4px]">{active.body}</p>
              )}
              {active?.features && active.features.length > 0 && (
                <div className="grid grid-cols-3 gap-x-[20px] gap-y-[12px]">
                  {active.features.map((f, i) => (
                    <div key={f._key ?? i} className="flex items-center gap-[12px]">
                      <span className="text-[24px] font-semibold text-[#7a14e1]">
                        {f.icon || '📊'}
                      </span>
                      <span className="text-[14px] text-black">{f.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* "Teams Transformed" layout: vertical numbered list */
            <NumberedStepList
              items={active?.features?.map((f, i) => ({
                _key: f._key,
                number: String(i + 1).padStart(2, '0'),
                title: f.label?.split(' - ')[0] || f.label,
                description: f.label?.includes(' - ') ? f.label.split(' - ').slice(1).join(' - ') : '',
              })) ?? []}
              containerClassName="w-full p-0"
              stepRowClassName="ui-step-row"
            />
          )}
        </div>
      </div>
    </section>
  )
}
