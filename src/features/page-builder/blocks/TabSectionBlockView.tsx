'use client'

import { useState } from 'react'
import Link from 'next/link'

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
  tabs?: Tab[]
}

export default function TabSectionBlockView({
  heading,
  tabs,
}: TabSectionBlockProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!tabs || tabs.length === 0) return null

  const active = tabs[activeIndex]

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="mx-auto max-w-6xl">
        {heading && (
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            {heading}
          </h2>
        )}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {tabs.map((tab, i) => (
            <button
              key={tab._key ?? i}
              onClick={() => setActiveIndex(i)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                i === activeIndex
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-purple-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-sm md:p-12">
          {active?.heading && (
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              {active.heading}
            </h3>
          )}
          {active?.body && (
            <p className="mb-6 max-w-3xl text-gray-600">{active.body}</p>
          )}
          {active?.features && active.features.length > 0 && (
            <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3">
              {active.features.map((f, i) => (
                <div
                  key={f._key ?? i}
                  className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-3"
                >
                  {f.icon && <span className="text-lg">{f.icon}</span>}
                  <span className="text-sm font-medium text-gray-700">
                    {f.label}
                  </span>
                </div>
              ))}
            </div>
          )}
          {active?.ctaLabel && active?.ctaUrl && (
            <Link
              href={active.ctaUrl}
              className="inline-block rounded-full bg-purple-600 px-8 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              {active.ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
