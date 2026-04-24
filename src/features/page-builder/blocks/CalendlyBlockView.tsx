'use client'

import { useEffect } from 'react'
import Image from 'next/image'

interface CalendlyBlockProps {
  heading?: string
  subheading?: string
  calendlyUrl?: string
}

export default function CalendlyBlockView({
  heading,
  subheading,
  calendlyUrl,
}: CalendlyBlockProps) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <section className="bg-white py-[80px] px-4">
      <div className="mx-auto max-w-[959px] flex flex-col items-center">
        {/* Logo removed — not in Figma design */}
        {heading && (
          <h2 className="mb-4 text-center text-[35px] font-medium text-black leading-[49px]">
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="mx-auto mb-8 max-w-2xl text-center text-[12.9px] text-black/60">{subheading}</p>
        )}
        {calendlyUrl && (
          <div
            className="calendly-inline-widget w-full"
            data-url={calendlyUrl}
            style={{ minWidth: '320px', height: '1000px' }}
          />
        )}
      </div>
    </section>
  )
}
