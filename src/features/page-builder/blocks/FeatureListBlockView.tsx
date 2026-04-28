import Link from 'next/link'
import { urlFor } from '@/sanity/image'
import NumberedStepList from '@/components/common/NumberedStepList'
import type { SiteSettings } from '../types'

interface Feature {
  _key?: string
  icon?: string
  title?: string
  description?: string
  image?: { asset: { _ref: string } }
}

interface FeatureListBlockProps {
  _key?: string
  heading?: string
  subheading?: string
  variant?: string
  features?: Feature[]
  siteSettings?: SiteSettings
}

// Static industry navigation icons — kept hardcoded because these are a fixed
// set of design-time decorative thumbnails that rarely change and would be
// unwieldy to manage per-industry in Sanity. Sanity feature.image still wins
// when populated per-feature.
const INDUSTRY_IMAGES: Record<string, string> = {
  'Construction': '/images/industry-construction.png',
  'Customer Service': '/images/industry-customer-service.png',
  'Retail': '/images/industry-retail.png',
  'Government': '/images/industry-government.png',
  'Manufacturing': '/images/industry-manufacturing.png',
  'Marketing & Creative': '/images/industry-marketing.png',
  'Professional Services': '/images/industry-professional-services.png',
  'Real Estate': '/images/industry-real-estate.png',
}

export default function FeatureListBlockView({ _key, heading, subheading, variant, features, siteSettings }: FeatureListBlockProps) {
  // Platinum partner badge for the industries variant — prefer Sanity navbarPartnerBadges[0], fall back to hardcoded image
  const platinumBadgeImage = siteSettings?.navbarPartnerBadges?.[0]?.image
  const platinumBadgeSrc = platinumBadgeImage?.asset
    ? urlFor(platinumBadgeImage).height(90).url()
    : '/images/partner-platinum-lg.png'
  const isIndustryGrid = variant === 'industries' || features?.some(f => f.description?.startsWith('/'))

  // "Teams Transformed" = challenges variant: white bg, vertical numbered list in bordered card
  // Detect by heading or key
  const isChallenges = heading?.includes('Teams Transformed') || heading?.includes('Efficiency Gains') || _key === 'challenges-01'

  // Steps variant = dark bg horizontal numbered steps (NOT challenges)
  const isStepsBlock = !isChallenges && (variant === 'steps' || features?.some(f => /^\d+$/.test(f.icon ?? '')))

  // ── Challenges variant ──────────────────────────────────────────────
  // Matches Figma: white bg, heading + subheading, bordered card with vertical numbered items
  if (isChallenges) {
    return (
      <section className="bg-white py-[80px] px-4">
        <div className="mx-auto max-w-[959px] flex flex-col gap-[40px] items-center">
          {/* Heading + subheading */}
          <div className="flex flex-col gap-[12px] items-center text-center w-full">
            {heading && (
              <h2 className="text-[35px] font-medium text-black leading-[49px]">
                {heading}
              </h2>
            )}
            <p className="text-[20px] text-black text-center">
              {subheading || 'Authorised monday.com, Atlassian and make Consulting, implementation and integration partner consultants across Australia, UK, and US.'}
            </p>
          </div>

          {/* Bordered card with vertical numbered items */}
          <NumberedStepList items={features ?? []} />
        </div>
      </section>
    )
  }

  // ── Industries variant ──────────────────────────────────────────────
  if (isIndustryGrid) {
    return (
      <section className="bg-[#ecf1fc] py-[80px] px-4">
        <div className="mx-auto max-w-[959px] flex flex-col items-center gap-[36px]">
          <div className="flex flex-col gap-[12px] items-center text-center">
            {heading && (
              <h2 className="text-[35px] font-medium text-black leading-[49px]">
                {(() => {
                  const accent = 'With You For You'
                  const idx = heading.indexOf(accent)
                  if (idx >= 0) {
                    return (
                      <>
                        <span>{heading.slice(0, idx)}</span>
                        <span className="text-[#8015e8]">{accent}</span>
                        <span>{heading.slice(idx + accent.length)}</span>
                      </>
                    )
                  }
                  return heading
                })()}
              </h2>
            )}
            {subheading ? (
              <p className="text-[20px] text-black text-center">{subheading}</p>
            ) : heading?.includes('Solution Built') && (
              <p className="text-[20px] text-black text-center">
                Our monday.com consultants have expertise across various industries. As a Platinum monday.com partner, we the guarantee delivery of the right solution and training to optimise your teams efficiency.
              </p>
            )}
          </div>

          {/* Partner badge */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={platinumBadgeSrc} alt="monday.com Platinum Partner" width={160} height={45} className="h-10 w-auto" />

          {/* Industry cards grid */}
          <div className="flex flex-wrap justify-center gap-0 w-full max-w-[1020px]">
            {features?.map((f, i) => (
              <Link
                key={f._key ?? i}
                href={f.description ?? '#'}
                className="group flex flex-col items-center p-[20px] w-[234px]"
              >
                <div className="w-[178px] h-[174px] rounded-full overflow-hidden mb-3">
                  {f.image?.asset ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={urlFor(f.image).width(300).height(300).url()}
                      alt={f.title ?? ''}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : INDUSTRY_IMAGES[f.title ?? ''] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={INDUSTRY_IMAGES[f.title ?? '']}
                      alt={f.title ?? ''}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#d9d9d9]" />
                  )}
                </div>
                <p className="text-[16px] font-medium text-[#10003a] text-center">{f.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // ── Steps variant — dark purple bg with horizontal numbered steps ──
  if (isStepsBlock) {
    // Heading may include the italic subtext baked in (legacy content):
    // "Get set up right, the first time. Measure twice, cut once."
    // Split on the last sentence so the tail renders as italic subtext.
    let stepsHeading = heading
    let stepsSubheading = subheading
    if (heading && !subheading) {
      const match = heading.match(/^(.*?[.!?])\s+(.+?)$/)
      if (match) {
        stepsHeading = match[1]
        stepsSubheading = match[2]
      }
    }

    return (
      <section className="relative py-[80px] pb-[120px] px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[#10003a]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2b074d] via-[#10003a] to-[#10003a] opacity-30" />

        <div className="mx-auto max-w-[1199px] relative z-10 flex flex-col items-center">
          {stepsHeading && (
            <h2 className="mb-3 text-center text-[45px] text-white leading-[63px]">{stepsHeading}</h2>
          )}
          {stepsSubheading && (
            <p className="mb-12 text-center text-[25px] font-extralight italic text-white">{stepsSubheading}</p>
          )}

          <div className="flex flex-wrap gap-0 w-full justify-center">
            {features?.map((f, i) => (
              <div
                key={f._key ?? i}
                className="group w-[237px] text-center cursor-default transition-transform duration-300 ease-out hover:-translate-y-1"
              >
                <p className="text-[48px] font-light text-[#b162fe] leading-[67.2px] transition-all duration-300 ease-out group-hover:font-bold group-hover:text-white">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="text-[14px] font-medium text-white mb-2 transition-all duration-300 ease-out group-hover:font-bold">{f.title}</p>
                {f.description && (
                  <p className="text-[14px] font-light text-white leading-[22.4px] mx-auto max-w-[190px]">{f.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // ── Generic feature list ───────────────────────────────────────────
  return (
    <section className="bg-white py-[80px] px-4">
      <div className="mx-auto max-w-[959px] flex flex-col items-center">
        {heading && (
          <h2 className="mb-3 text-center text-[35px] font-medium text-black leading-[49px]">{heading}</h2>
        )}
        {subheading && (
          <p className="mb-10 text-center text-[20px] text-black max-w-[800px]">{subheading}</p>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
          {features?.map((f, i) => (
            <div
              key={f._key ?? i}
              className="flex items-start gap-4 rounded-card bg-white border border-[#e8e6e6] p-6"
            >
              {f.icon && (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8015e8]/10 text-sm font-bold text-[#8015e8]">
                  {f.icon}
                </span>
              )}
              <div>
                <p className="font-semibold text-[#242323]">{f.title}</p>
                {f.description && (
                  <p className="mt-1 text-[14px] text-[#595959] leading-[22.4px]">{f.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
