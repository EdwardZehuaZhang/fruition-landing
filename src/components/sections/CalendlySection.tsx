import CalendlyBooking from "./calendly/CalendlyBooking"
import LegacyCalendlyEmbed from "./calendly/LegacyCalendlyEmbed"

const LEGACY_WIDGET_HEIGHT = 880

interface CalendlySectionProps {
  heading?: string
  subheading?: string
  /** Public Calendly scheduling URL — used only by the legacy iframe fallback. */
  calendlyUrl?: string
}

/**
 * Consultation booking section. Renders the custom, on-brand booking widget
 * (calendar → time slots → details → confirmation) backed by the Calendly API.
 * When the API isn't configured (missing CALENDLY_API_TOKEN / event-type URI)
 * or availability can't load, it falls back to the original Calendly iframe so
 * the page keeps working. See src/lib/calendly.ts for setup.
 */
export default function CalendlySection({
  heading = "Schedule A 30-Min Consultation With One of Our monday.com Consultants",
  subheading,
  calendlyUrl = "https://calendly.com/global-calendar-fruitionservices",
}: CalendlySectionProps) {
  return (
    <section className="bg-surface-subtle" style={{ paddingTop: 0, paddingBottom: 0 }}>
      <div className="mx-auto flex flex-col items-center px-4" style={{ maxWidth: 1200, paddingTop: 80 }}>
        <h2 className="text-section-h2 text-center text-body" style={{ maxWidth: 900 }}>
          {heading}
        </h2>
        {subheading && (
          <p
            className="text-center"
            style={{
              fontSize: 16,
              lineHeight: "24px",
              color: "var(--text-body)",
              marginTop: 16,
              maxWidth: 900,
              whiteSpace: "pre-line",
            }}
          >
            {subheading}
          </p>
        )}
        <div className="w-full" style={{ marginTop: 32 }}>
          <CalendlyBooking
            fallback={<LegacyCalendlyEmbed calendlyUrl={calendlyUrl} height={LEGACY_WIDGET_HEIGHT} />}
          />
        </div>
      </div>
    </section>
  )
}
