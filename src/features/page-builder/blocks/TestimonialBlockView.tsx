interface TestimonialBlockProps {
  quote?: string
  authorName?: string
  authorRole?: string
  company?: string
}

export default function TestimonialBlockView({ quote, authorName, authorRole, company }: TestimonialBlockProps) {
  if (!quote) return null

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 flex flex-col gap-4">
      <blockquote className="text-base italic text-gray-700 leading-relaxed">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <p className="text-sm font-semibold text-gray-900">
        {authorName}
        {(authorRole || company) && (
          <span className="font-normal text-gray-500">
            {authorRole && `, ${authorRole}`}
            {company && ` at ${company}`}
          </span>
        )}
      </p>
    </div>
  )
}
