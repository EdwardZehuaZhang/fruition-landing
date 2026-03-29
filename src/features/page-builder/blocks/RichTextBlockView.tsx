import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { portableTextComponents } from '@/components/PortableTextComponents'

interface RichTextBlockProps {
  content?: PortableTextBlock[]
}

export default function RichTextBlockView({ content }: RichTextBlockProps) {
  if (!content) return null
  return (
    <section>
      <PortableText value={content} components={portableTextComponents} />
    </section>
  )
}
