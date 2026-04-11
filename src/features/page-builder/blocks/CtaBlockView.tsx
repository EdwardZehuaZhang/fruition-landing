import Link from 'next/link'
import { urlFor } from '@/sanity/image'
import type { SiteSettings } from '../types'

interface CtaBlockProps {
  heading?: string
  body?: string
  ctaLabel?: string
  ctaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
  variant?: string
  badgeImage?: { asset: { _ref: string } }
  siteSettings?: SiteSettings
}

export default function CtaBlockView({
  heading,
  body,
  ctaLabel,
  ctaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
  variant,
  badgeImage,
  siteSettings,
}: CtaBlockProps) {
  // Use gradient as default style to match Figma design
  const isGradient = variant !== 'default'
  // Prefer Sanity badge: per-block badgeImage, then siteSettings.badgeCertifications, then hardcoded fallback
  const certificationsBadgeSrc = siteSettings?.badgeCertifications?.asset
    ? urlFor(siteSettings.badgeCertifications).height(146).url()
    : '/images/badge-certifications.png'

  return (
    <section
      className={`flex flex-col items-center justify-center min-h-[455px] py-[80px] px-4 text-white ${
        isGradient
          ? 'bg-[radial-gradient(ellipse_at_center,rgba(210,172,247,0.98)_0%,rgba(149,59,236,0.98)_27%,rgba(128,21,232,0.98)_36%,rgba(80,11,174,0.98)_56%,rgba(32,1,116,0.98)_76%)]'
          : 'bg-[#10003a]'
      }`}
    >
      {/* Certification badge — show from Sanity or fallback to local image */}
      {badgeImage?.asset ? (
        <div className="mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={urlFor(badgeImage).height(80).url()}
            alt="Certification"
            className="h-[73px] w-auto"
          />
        </div>
      ) : isGradient ? (
        <div className="mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={certificationsBadgeSrc} alt="monday.com Certifications" width={325} height={73} className="h-[73px] w-auto" />
        </div>
      ) : null}

      {heading && (
        <h2 className="mb-4 text-center text-[35px] font-medium leading-[49px] max-w-[655px]">{heading}</h2>
      )}
      {body && (
        <p className="mb-8 text-center text-gray-200 max-w-[600px] leading-relaxed">{body}</p>
      )}

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-[24px] items-start">
        {ctaLabel && ctaUrl && (
          <Link
            href={ctaUrl}
            className="flex items-center justify-center h-[53px] w-[330px] rounded-[100px] bg-white text-[#8015e8] text-[16px] font-bold tracking-[0.32px] hover:opacity-90 transition"
          >
            {ctaLabel}
          </Link>
        )}
        {secondaryCtaLabel && secondaryCtaUrl && (
          <Link
            href={secondaryCtaUrl}
            className="flex items-center justify-center h-[53px] w-[330px] rounded-[100px] border border-white text-white text-[16px] font-bold tracking-[0.32px] hover:bg-white/10 transition"
          >
            {secondaryCtaLabel}
          </Link>
        )}
      </div>
    </section>
  )
}
