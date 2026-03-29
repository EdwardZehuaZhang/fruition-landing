interface TestimonialBlockProps {
  quote?: string
  authorName?: string
  authorRole?: string
  company?: string
}

export default function TestimonialBlockView({ quote, authorName, authorRole, company }: TestimonialBlockProps) {
  return (
    <section>
      {quote && <blockquote>&ldquo;{quote}&rdquo;</blockquote>}
      <p>
        {authorName && <strong>{authorName}</strong>}
        {authorRole && <span>, {authorRole}</span>}
        {company && <span> at {company}</span>}
      </p>
    </section>
  )
}
