'use client'

import { useState } from 'react'
import NumberedStepList from '@/components/common/NumberedStepList'

interface TabItem {
  _key?: string
  title?: string
  description?: string
}

interface Tab {
  _key?: string
  label?: string
  subheading?: string
  items?: TabItem[]
}

interface Props {
  heading?: string
  subheading?: string
  tabs?: Tab[]
}

export default function TeamsTransformedSection({ heading, subheading, tabs }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!tabs || tabs.length === 0) return null
  const active = tabs[activeIndex]

  return (
    <section className="bg-white py-[80px] px-4 relative overflow-visible">
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
      <div className="relative mx-auto max-w-[959px] flex flex-col items-center gap-[40px]">
        {(heading || subheading) && (
          <div className="flex flex-col gap-[12px] items-center text-center w-full">
            {heading && (
              <h2 className="text-[35px] font-medium text-black leading-[49px]">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="text-[20px] text-black text-center">
                {subheading}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-[24px] items-center w-full max-w-[816px]">
          <div className="flex justify-center gap-[12px] flex-wrap w-full">
            {tabs.map((tab, i) => (
              <button
                key={tab._key || tab.label || i}
                onClick={() => setActiveIndex(i)}
                className={`relative inline-flex items-center justify-center rounded-[99px] px-[31px] py-[7px] text-[16px] leading-[1.2] transition-all ${
                  i === activeIndex
                    ? 'bg-gradient-to-r from-[#8015e8] to-[#ba83f0] text-white shadow-[2.83px_2.83px_15px_3px_rgba(0,0,0,0.24)]'
                    : 'bg-white text-[#2b074d] border border-[#e8e6e6] hover:border-[#8015e8]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {active?.subheading && (
            <p className="text-[20px] text-black text-center">
              {active.subheading}
            </p>
          )}

          {active?.items && (
            <NumberedStepList
              items={active.items.map((item, i) => ({
                _key: item._key || item.title || String(i),
                number: String(i + 1).padStart(2, '0'),
                title: item.title,
                description: item.description,
              }))}
              containerClassName="w-full rounded-card border border-[#e8e6e6] bg-white py-2 px-0"
              stepRowClassName="ui-step-row"
            />
          )}
        </div>
      </div>
    </section>
  )
}
