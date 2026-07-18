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
    <section className="bg-surface py-20">
      <div className="mx-auto px-4 max-w-[920px]">
        {heading && (
          <h2 className="text-section-h2 text-center text-body mb-8">
            {heading}
          </h2>
        )}
        <div className="rounded-card overflow-hidden border border-ui shadow-whisper dark:shadow-none">
          <iframe
            src={embedUrl}
            title={heading || "Application Form"}
            width="100%"
            height="1200"
            className="block w-full border-0"
            allow="camera; microphone; fullscreen"
          />
        </div>
      </div>
    </section>
  )
}
