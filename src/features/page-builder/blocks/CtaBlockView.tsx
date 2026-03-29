import Link from 'next/link'

interface CtaBlockProps {
  heading?: string
  body?: string
  ctaLabel?: string
  ctaUrl?: string
}

export default function CtaBlockView({ heading, body, ctaLabel, ctaUrl }: CtaBlockProps) {
  return (
    <section>
      {heading && <h2>{heading}</h2>}
      {body && <p>{body}</p>}
      {ctaLabel && ctaUrl && (
        <p><Link href={ctaUrl}>{ctaLabel}</Link></p>
      )}
    </section>
  )
}
