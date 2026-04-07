interface TestimonialBlockProps {
  quote?: string
  authorName?: string
  authorRole?: string
  company?: string
}

export default function TestimonialBlockView({ quote, authorName, authorRole, company }: TestimonialBlockProps) {
  if (!quote) return null

  return (
    <div className="relative flex flex-col bg-white rounded-[24px] border border-[#e8e6e6] w-full max-w-[437px] min-h-[300px]">
      {/* Top: Name + Title (left) + Avatar (right) */}
      <div className="flex items-start justify-between px-[38px] pt-[29px] pb-[18px]">
        <div>
          {authorName && (
            <p className="font-semibold text-[20px] text-[#2b074d] leading-[30px]">{authorName}</p>
          )}
          {(authorRole || company) && (
            <p className="font-light text-[14px] text-[#595959] leading-[21px]">
              {authorRole}{authorRole && company ? ', ' : ''}{company}
            </p>
          )}
        </div>
        {/* Avatar circle */}
        <div className="w-[57px] h-[53px] rounded-full bg-[#e8e6e6] shrink-0 ml-4" />
      </div>

      {/* Quote */}
      <div className="px-[38px] flex-1">
        <p className="text-[15px] text-black leading-[22.5px]">
          {quote}
        </p>
      </div>

      {/* Stars */}
      <div className="flex gap-[2px] px-[38px] pb-[35px] pt-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-[23px] h-[21px]" viewBox="0 0 23 21" fill="#8015E8">
            <path d="M11.5 0L14.09 7.36H22.06L15.49 11.92L18.08 19.28L11.5 14.72L4.92 19.28L7.51 11.92L0.94 7.36H8.91L11.5 0Z" />
          </svg>
        ))}
      </div>
    </div>
  )
}
