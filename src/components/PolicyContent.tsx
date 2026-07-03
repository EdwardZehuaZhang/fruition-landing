import { PortableText, type PortableTextComponents } from "@portabletext/react"
import type { PortableTextBlock } from "@portabletext/types"

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-12 mb-4 border-b border-line-soft pb-2 text-2xl font-bold tracking-tight text-ink">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-lg font-semibold text-ink">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed text-ink-soft">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-line-soft pl-4 italic text-ink-muted">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 ml-1 list-disc space-y-1.5 pl-5 text-ink-soft marker:text-ink-faint">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 ml-1 list-decimal space-y-1.5 pl-5 text-ink-soft marker:text-ink-faint">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-ink">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-brand underline underline-offset-2 hover:text-brand-dark"
      >
        {children}
      </a>
    ),
  },
}

export default function PolicyContent({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="text-[15px]">
      <PortableText value={value} components={components} />
    </div>
  )
}
