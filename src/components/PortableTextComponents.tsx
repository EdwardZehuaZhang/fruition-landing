import type { PortableTextComponents } from "@portabletext/react"
import Image from "next/image"
import Link from "next/link"

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null
      return (
        <div className="my-8 relative w-full h-96 rounded-xl overflow-hidden">
          <Image
            src={`https://cdn.sanity.io/images/bt6nb58h/production/${value.asset._ref.replace("image-", "").replace(/-(\w+)$/, ".$1")}`}
            alt={value.alt || ""}
            fill
            className="object-cover"
          />
        </div>
      )
    },
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline hover:text-blue-900">
        {children}
      </a>
    ),
    internalLink: ({ children, value }) => (
      <Link href={value?.slug?.current ? `/${value.slug.current}` : "#"} className="text-blue-700 underline hover:text-blue-900">
        {children}
      </Link>
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-bold text-gray-900 mt-10 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-2">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-semibold text-gray-900 mt-4 mb-2">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-700 pl-4 italic text-gray-600 my-4">{children}</blockquote>
    ),
    normal: ({ children }) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4 text-gray-700">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-700">{children}</ol>,
  },
}

export default portableTextComponents