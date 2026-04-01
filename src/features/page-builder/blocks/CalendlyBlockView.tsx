'use client'

import { useEffect } from 'react'

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
    <section className="bg-white py-16 px-4">
      <div className="mx-auto max-w-4xl text-center">
        {heading && (
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="mx-auto mb-8 max-w-2xl text-gray-600">{subheading}</p>
        )}
        {calendlyUrl && (
          <div
            className="calendly-inline-widget"
            data-url={calendlyUrl}
            style={{ minWidth: '320px', height: '700px' }}
          />
        )}
      </div>
    </section>
  )
}
