import CalendlyBooking from '@/components/sections/calendly/CalendlyBooking'
import LegacyCalendlyEmbed from '@/components/sections/calendly/LegacyCalendlyEmbed'

interface CalendlyBlockProps {
  heading?: string
  subheading?: string
  calendlyUrl?: string
}

/**
 * Page-builder Calendly block. Renders the custom, on-brand booking widget
 * (see components/sections/calendly), falling back to the original Calendly
 * iframe when the API isn't configured or availability can't load.
 */
export default function CalendlyBlockView({
  heading,
  subheading,
  calendlyUrl,
}: CalendlyBlockProps) {
  return (
    <section className="bg-surface py-[80px] px-4">
      <div className="mx-auto max-w-[959px] flex flex-col items-center">
        {heading && (
          <h2 className="mb-4 text-center text-[26px] leading-[36px] sm:text-[35px] sm:leading-[49px] font-medium text-body">
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="mx-auto mb-8 max-w-2xl text-center text-[12.9px] text-body/60">{subheading}</p>
        )}
        <div className="w-full">
          <CalendlyBooking
            fallback={
              calendlyUrl ? (
                <LegacyCalendlyEmbed calendlyUrl={calendlyUrl} height={880} />
              ) : null
            }
          />
        </div>
      </div>
    </section>
  )
}
