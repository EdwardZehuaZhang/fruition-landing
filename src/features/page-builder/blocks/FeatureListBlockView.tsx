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
  headingAccent?: string
  subheading?: string
  variant?: string
  features?: Feature[]
  siteSettings?: SiteSettings
}

export default function FeatureListBlockView({ _key, heading, headingAccent, subheading, variant, features, siteSettings }: FeatureListBlockProps) {
  // Platinum partner badge for the industries variant — pulled from Sanity navbarPartnerBadges
  const platinumBadgeImage = siteSettings?.navbarPartnerBadges?.[0]?.image
  const platinumBadgeSrc = platinumBadgeImage?.asset
    ? urlFor(platinumBadgeImage).height(90).url()
    : null

  // Auto-detect variant when CMS field is missing/default — home page content
  // lacks the variant flag but should render as Steps or Industries.
  const resolvedVariant = (() => {
    if (variant && variant !== 'default') return variant
    const hasIndustryKey = features?.some((f) => f._key?.startsWith('ind-'))
    const looksLikeIndustryLink = features?.some((f) => f.description?.startsWith('/monday-for-') || f.description?.startsWith('/monday-consulting-solutions/'))
    if (hasIndustryKey || looksLikeIndustryLink) return 'industries'
    const lowerHead = (heading ?? '').toLowerCase()
    const lowerSub = (subheading ?? '').toLowerCase()
    if (lowerHead.includes('get set up right') || lowerSub.includes('measure twice')) return 'steps'
    return variant
  })()

  const isIndustryGrid = resolvedVariant === 'industries'
  const isChallenges = resolvedVariant === 'challenges' || _key === 'challenges-01'
  const isStepsBlock = !isChallenges && resolvedVariant === 'steps'

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
            {subheading && (
              <p className="text-[20px] text-black text-center">{subheading}</p>
            )}
          </div>

          {/* Bordered card with vertical numbered items */}
          <NumberedStepList items={features ?? []} />
        </div>
      </section>
    )
  }

  // ── Industries variant ──────────────────────────────────────────────
  if (isIndustryGrid) {
    const industryFallback = (titleOrKey?: string): string | null => {
      if (!titleOrKey) return null
      const slug = titleOrKey.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const map: Record<string, string> = {
        'construction': '/images/industry-construction.png',
        'customer-service': '/images/industry-customer-service.png',
        'retail': '/images/industry-retail.png',
        'government': '/images/industry-government.png',
        'manufacturing': '/images/industry-manufacturing.png',
        'marketing-and-creative': '/images/industry-marketing.png',
        'marketing': '/images/industry-marketing.png',
        'creative': '/images/industry-creative.png',
        'professional-services': '/images/industry-professional-services.png',
        'real-estate': '/images/industry-real-estate.png',
        'finance': '/images/industry-finance.png',
      }
      return map[slug] ?? null
    }
    const resolvedSubheading = subheading || 'Our monday.com consultants have expertise across various industries. As a Platinum monday.com partner, we guarantee delivery of the right solution and training to optimise your team’s efficiency.'
    return (
      <section className="bg-[#ecf1fc] py-[80px] px-4">
        <div className="mx-auto max-w-[959px] flex flex-col items-center gap-[36px]">
          <div className="flex flex-col gap-[12px] items-center text-center">
            {heading && (
              <h2 className="text-[35px] font-medium text-black leading-[49px]">
                {headingAccent ? (
                  (() => {
                    const idx = heading.indexOf(headingAccent)
                    if (idx >= 0) {
                      return (
                        <>
                          <span>{heading.slice(0, idx)}</span>
                          <span className="text-[#8015e8]">{headingAccent}</span>
                          <span>{heading.slice(idx + headingAccent.length)}</span>
                        </>
                      )
                    }
                    return heading
                  })()
                ) : heading}
              </h2>
            )}
            <p className="text-[20px] text-black text-center">{resolvedSubheading}</p>
          </div>

          {/* Partner badge */}
          {platinumBadgeSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={platinumBadgeSrc} alt={siteSettings?.navbarPartnerBadges?.[0]?.name || 'Partner badge'} width={160} height={45} className="h-10 w-auto" />
          )}

          {/* Industry cards grid */}
          <div className="flex flex-wrap justify-center gap-0 w-full max-w-[1020px]">
            {features?.map((f, i) => {
              const fallbackSrc = industryFallback(f.title)
              const imgSrc = f.image?.asset ? urlFor(f.image).width(300).height(300).url() : fallbackSrc
              return (
                <Link
                  key={f._key ?? i}
                  href={f.description ?? '#'}
                  className="group flex flex-col items-center p-[20px] w-[234px]"
                >
                  <div className="w-[178px] h-[174px] rounded-full overflow-hidden mb-3">
                    {imgSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imgSrc}
                        alt={f.title ?? ''}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#d9d9d9]" />
                    )}
                  </div>
                  <p className="text-[16px] font-medium text-[#10003a] text-center">{f.title}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  // ── Steps variant — dark purple bg with horizontal numbered steps ──
  if (isStepsBlock) {
    const stepsHeading = heading
    const stepsSubheading = subheading

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
