import Script from "next/script"

interface CalendlySectionProps {
  heading?: string
  subheading?: string
  calendlyUrl?: string
}

export default function CalendlySection({
  heading = "Schedule A 30-Min Consultation With One of Our monday.com Consultants",
  subheading,
  calendlyUrl = "https://calendly.com/global-calendar-fruitionservices",
}: CalendlySectionProps) {
  const embedUrl = calendlyUrl.includes("?")
    ? `${calendlyUrl}&hide_gdpr_banner=1&embed_type=Inline`
    : `${calendlyUrl}?hide_gdpr_banner=1&embed_type=Inline`

  return (
    <section className="bg-[#f7f7f7]" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto flex flex-col items-center" style={{ maxWidth: 1200 }}>
        <h2 className="text-section-h2 text-center text-black" style={{ maxWidth: 900 }}>
          {heading}
        </h2>
        {subheading && (
          <p className="text-center" style={{ fontSize: 16, lineHeight: "24px", color: "black", marginTop: 20, maxWidth: 900 }}>
            {subheading}
          </p>
        )}
        <div
          className="calendly-inline-widget w-full rounded-card overflow-hidden"
          data-url={embedUrl}
          style={{ marginTop: 40, minWidth: 320, height: 1400 }}
        />
        <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
      </div>
    </section>
  )
}
