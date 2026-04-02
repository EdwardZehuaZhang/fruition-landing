import Link from 'next/link'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'

interface RichTextBlockProps {
  heading?: string
  subheading?: string
  content?: PortableTextBlock[]
  ctaLabel?: string
  ctaUrl?: string
}

export default function RichTextBlockView({
  heading,
  subheading,
  content,
  ctaLabel,
  ctaUrl,
}: RichTextBlockProps) {
  return (
    <section className="bg-white py-16 px-4 border-b border-gray-100">
      <div className="mx-auto max-w-4xl flex flex-col md:flex-row gap-10 items-start">
        <div className="flex-1">
          {heading && (
            <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">{heading}</h2>
          )}
          {subheading && (
            <p className="mb-4 text-gray-500">{subheading}</p>
          )}
          {content && (
            <div className="prose prose-gray max-w-none text-gray-600">
              <PortableText value={content} components={portableTextComponents} />
            </div>
          )}
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
      </div>
    </section>
  )
}
