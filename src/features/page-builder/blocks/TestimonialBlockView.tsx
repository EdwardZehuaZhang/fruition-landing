interface TestimonialBlockProps {
  quote?: string
  authorName?: string
  authorRole?: string
  company?: string
}

export default function TestimonialBlockView({ quote, authorName, authorRole, company }: TestimonialBlockProps) {
  if (!quote) return null

  return (
    <div className="ui-surface-panel relative flex w-full max-w-[437px] min-h-[300px] flex-col">
      {/* Top: Name + Title (left) + Avatar (right) */}
      <div className="flex items-start justify-between px-8 pb-4 pt-7">
        <div>
          {authorName && (
            <p className="text-[20px] font-semibold leading-[1.45] text-[#2b074d]">{authorName}</p>
          )}
          {(authorRole || company) && (
            <p className="text-caption font-normal text-[#595959]">
              {authorRole}{authorRole && company ? ', ' : ''}{company}
            </p>
          )}
        </div>
        {/* Avatar circle */}
        <div className="w-[57px] h-[53px] rounded-full bg-[#e8e6e6] shrink-0 ml-4" />
      </div>

      {/* Quote */}
      <div className="flex-1 px-8">
        <p className="text-body-sm text-black">
          {quote}
        </p>
      </div>

      {/* Stars */}
      <div className="flex gap-[2px] px-8 pb-8 pt-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-[23px] h-[21px]" viewBox="0 0 23 21" fill="#8015E8">
            <path d="M11.5 0L14.09 7.36H22.06L15.49 11.92L18.08 19.28L11.5 14.72L4.92 19.28L7.51 11.92L0.94 7.36H8.91L11.5 0Z" />
          </svg>
        ))}
      </div>
    </div>
  )
}
