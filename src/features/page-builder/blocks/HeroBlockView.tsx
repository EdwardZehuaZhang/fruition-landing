import Link from 'next/link'

interface HeroBlockProps {
  heading?: string
  subheading?: string
  primaryCtaLabel?: string
  primaryCtaUrl?: string
}

export default function HeroBlockView({ heading, subheading, primaryCtaLabel, primaryCtaUrl }: HeroBlockProps) {
  return (
    <section>
      {heading && <h1>{heading}</h1>}
      {subheading && <p>{subheading}</p>}
      {primaryCtaLabel && primaryCtaUrl && (
        <p><Link href={primaryCtaUrl}>{primaryCtaLabel}</Link></p>
      )}
    </section>
  )
}
