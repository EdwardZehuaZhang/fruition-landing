import Link from 'next/link'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'

interface RichTextBlockProps {
  heading?: string
  content?: PortableTextBlock[]
  ctaLabel?: string
  ctaUrl?: string
}

export default function RichTextBlockView({
  heading,
  content,
  ctaLabel,
  ctaUrl,
}: RichTextBlockProps) {
  return (
    <section className="py-12 px-4">
      <div className="mx-auto max-w-3xl">
        {heading && (
          <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
            {heading}
          </h2>
        )}
        {content && <PortableText value={content} components={portableTextComponents} />}
        {ctaLabel && ctaUrl && (
          <div className="mt-6">
            <Link
              href={ctaUrl}
              className="inline-block rounded-full bg-purple-600 px-8 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
