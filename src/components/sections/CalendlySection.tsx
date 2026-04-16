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
  return (
    <section className="bg-[#f7f7f7]" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto flex flex-col items-center" style={{ maxWidth: 1200 }}>
        <h2 className="text-center" style={{ fontSize: 35, fontWeight: 500, color: "black", maxWidth: 900 }}>
          {heading}
        </h2>
        {subheading && (
          <p className="text-center" style={{ fontSize: 16, lineHeight: "24px", color: "black", marginTop: 20, maxWidth: 900 }}>
            {subheading}
          </p>
        )}
        <div className="w-full" style={{ marginTop: 40, borderRadius: 24, overflow: "hidden", height: 700 }}>
          <iframe src={calendlyUrl} width="100%" height="100%" frameBorder="0" title="Schedule a consultation" />
        </div>
      </div>
    </section>
  )
}
