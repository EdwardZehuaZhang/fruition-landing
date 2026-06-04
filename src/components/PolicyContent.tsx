import { PortableText, type PortableTextComponents } from "@portabletext/react"
import type { PortableTextBlock } from "@portabletext/types"

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-12 mb-4 border-b border-gray-200 pb-2 text-2xl font-bold tracking-tight text-gray-900">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-lg font-semibold text-gray-900">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-gray-300 pl-4 italic text-gray-600">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 ml-1 list-disc space-y-1.5 pl-5 text-gray-700 marker:text-gray-400">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 ml-1 list-decimal space-y-1.5 pl-5 text-gray-700 marker:text-gray-400">
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
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-[#8015E8] underline underline-offset-2 hover:text-[#6a11c2]"
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
