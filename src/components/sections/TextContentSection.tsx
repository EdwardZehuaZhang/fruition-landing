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

  const bg = theme === "tint" ? "var(--surface-subtle)" : "var(--surface)"

  return (
    <section className="px-4" style={{ backgroundColor: bg, paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto" style={{ maxWidth: 880 }}>
        {(heading || headingAccent) && (
          <h2
            className="text-section-h2 text-center"
            style={{ marginBottom: 32, color: "var(--ink)" }}
          >
            {heading}
            {headingAccent && (
              <span style={{ color: "var(--brand)" }}> {headingAccent}</span>
            )}
          </h2>
        )}
        {body && (
          <div
            style={{
              fontSize: 17,
              lineHeight: "28px",
              color: "var(--ink)",
              whiteSpace: "pre-line",
              textAlign: "center",
            }}
          >
            {body}
          </div>
        )}
      </div>
    </section>
  )
}
