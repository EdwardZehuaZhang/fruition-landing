import BookingSection from "./BookingSection"

/**
 * Thin wrapper over the single BookingSection so every existing placement
 * (~34 hardcoded pages plus the Sanity page-builder `calendlyBlock`) keeps its
 * own prop names. `calendlyUrl` overrides the calendar for that page.
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
  return <BookingSection heading={heading} sub={subheading} calendlyUrl={calendlyUrl} />
}
