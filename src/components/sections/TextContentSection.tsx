interface TextContentSectionProps {
  heading?: string
  headingAccent?: string
  body?: string
  theme?: "light" | "tint"
}

export default function TextContentSection({
  heading,
  headingAccent,
  body,
  theme = "light",
}: TextContentSectionProps) {
  if (!heading && !body) return null

  return (
    <section className={`px-4 py-20 ${theme === "tint" ? "bg-surface-subtle" : "bg-surface"}`}>
      <div className="mx-auto max-w-[880px]">
        {(heading || headingAccent) && (
          <h2 className="text-section-h2 text-center mb-8">
            {heading}
            {headingAccent && (
              <span className="text-brand"> {headingAccent}</span>
            )}
          </h2>
        )}
        {body && (
          <div className="text-[17px] leading-7 text-body whitespace-pre-line text-center">
            {body}
          </div>
        )}
      </div>
    </section>
  )
}
