'use client'

import { useState } from 'react'

interface FaqItem {
  _key?: string
  question?: string
  answer?: string
}

interface FaqBlockProps {
  heading?: string
  items?: FaqItem[]
}

export default function FaqBlockView({ heading, items }: FaqBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="bg-white py-16 md:py-20 px-4">
      <div className="mx-auto max-w-3xl">
        {heading && (
          <h2 className="mb-10 text-center text-2xl font-medium text-[#242323] md:text-[35px] md:leading-tight">
            {heading}
          </h2>
        )}
        {items && (
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={item._key ?? i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-[#242323]">{item.question}</span>
                  <svg
                    className={`w-5 h-5 text-[#8015e8] shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === i && item.answer && (
                  <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
