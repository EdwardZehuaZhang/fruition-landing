import CalendlySection from '@/components/sections/CalendlySection'

/**
 * Sanity page-builder `calendlyBlock` → the shared custom scheduling section.
 * Previously embedded the Calendly iframe widget; now delegates to
 * CalendlySection so page-builder pages (incl. the homepage) get the same
 * custom day/slot picker as the hardcoded pages. Props map one-to-one.
 */

interface CalendlyBlockProps {
  heading?: string
  subheading?: string
  calendlyUrl?: string
}

export default function CalendlyBlockView({ heading, subheading, calendlyUrl }: CalendlyBlockProps) {
  return <CalendlySection heading={heading} subheading={subheading} calendlyUrl={calendlyUrl} />
}
