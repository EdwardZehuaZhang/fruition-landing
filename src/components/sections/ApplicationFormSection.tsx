"use client"

interface ApplicationFormSectionProps {
  heading?: string
  embedUrl?: string
}

export default function ApplicationFormSection({
  heading,
  embedUrl,
}: ApplicationFormSectionProps) {
  if (!embedUrl) return null

  return (
    <section style={{ backgroundColor: "var(--surface)", paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto px-4" style={{ maxWidth: 920 }}>
        {heading && (
          <h2
            className="text-section-h2 text-center"
            style={{ color: "var(--text-body)", marginBottom: 32 }}
          >
            {heading}
          </h2>
        )}
        <div
          className="rounded-card overflow-hidden border border-ui dark:shadow-none"
          style={{ boxShadow: "var(--shadow-whisper)" }}
        >
          <iframe
            src={embedUrl}
            title={heading || "Application Form"}
            width="100%"
            height="1200"
            style={{ border: 0, display: "block", width: "100%" }}
            allow="camera; microphone; fullscreen"
          />
        </div>
      </div>
    </section>
  )
}
