import BookingSection from "./BookingSection"

/**
 * Thin wrapper over the unified BookingSection so every existing placement
 * (~15 hardcoded pages plus the Sanity page-builder `calendlyBlock`) upgrades
 * in place. The props interface is unchanged from the old scheduling section;
 * `calendlyUrl` remains the last-resort link when availability fails.
 */

interface CalendlySectionProps {
  heading?: string
  subheading?: string
  calendlyUrl?: string
}

export default function CalendlySection({
  heading = "Schedule A 30-Min Consultation With One of Our monday.com Consultants",
  subheading,
  calendlyUrl,
}: CalendlySectionProps) {
  return (
    <BookingSection
      eyebrow="Book a consultation"
      heading={heading}
      sub={subheading}
      calendlyUrl={calendlyUrl}
    />
  )
}
