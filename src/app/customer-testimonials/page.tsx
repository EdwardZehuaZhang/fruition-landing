import { bookingHref } from "@/lib/bookingLink"
import { getSiteSettings, getPageBySlug } from "@/sanity/queries"
import { LogoCloudMarquee, CalendlySection, DiscoverCtaSection, CroSections, StickyCtaBar, TestimonialFilterGrid } from "@/components/sections"
import type { PartnerBadge, SanityImageRef } from "@/components/sections/types"
import { urlFor } from "@/sanity/image"
import CtaButton from "@/components/CtaButton"
import FramedMedia from "@/components/common/FramedMedia"
import { buildOgMetadata } from "@/lib/metadata"

export async function generateMetadata() {
  const page = await getPageBySlug("customer-testimonials")
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/customer-testimonials" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/customer-testimonials",
    }),
  }
}

interface CaseStudyCard {
  _key?: string
  title?: string
  image?: SanityImageRef | string
  product?: string
  industry?: string
  services?: string
  timeline?: string
  verifiedSource?: string
}

function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).url()
  } catch {
    return null
  }
}

function getCaseStudyImageSrc(image?: SanityImageRef | string): string | null {
  if (!image) return null
  // Support both Sanity image refs and legacy string paths
  if (typeof image === "string") return image
  return safeImageUrl(image)
}

export default async function CustomerTestimonialsPage() {
  const [siteSettings, page] = await Promise.all([
    getSiteSettings(),
    getPageBySlug("customer-testimonials"),
  ])

  const rawCalendly = siteSettings?.calendlyLink || ""
  const calendlyUrl = bookingHref(rawCalendly)
  const partnerBadges: PartnerBadge[] = page?.heroPartnerBadges?.length > 0
    ? page.heroPartnerBadges
    : siteSettings?.navbarPartnerBadges || []

  const heroHeading = page?.heroHeading
  const heroSubheading = page?.heroSubheading
  const heroBody = page?.heroBody
  const primaryCtaLabel = page?.primaryCtaLabel
  const primaryCtaUrl = page?.primaryCtaUrl || calendlyUrl
  const secondaryCtaLabel = page?.secondaryCtaLabel
  const secondaryCtaUrl = page?.secondaryCtaUrl

  const logoCloudPart1 = page?.logoCloudHeadingPart1
  const logoCloudAccent = page?.logoCloudHeadingAccent

  const caseStudyCards: CaseStudyCard[] = (page?.caseStudyCards ?? []) as CaseStudyCard[]

  const calendlyHeading = page?.calendlyHeading
  const calendlySubheading = page?.calendlySubheading

  const discoverHeading = page?.discoverHeading
  const discoverPrimaryLabel = page?.discoverPrimaryCtaLabel
  const discoverPrimaryUrl = page?.discoverPrimaryCtaUrl || calendlyUrl
  const discoverSecondaryLabel = page?.discoverSecondaryCtaLabel
  const discoverSecondaryUrl = page?.discoverSecondaryCtaUrl || calendlyUrl

  return (
    <div>
      <StickyCtaBar label={page?.croSections?.stickyCtaLabel} href={bookingHref(page?.croSections?.stickyCtaUrl || rawCalendly)} />
      {/* Hero */}
      <section className="bg-surface">
        <div
          className="mx-auto flex flex-col items-center"
          style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 80, paddingBottom: 80, maxWidth: 1200 }}
        >
          {partnerBadges.length > 0 && (
            <div className="flex items-center flex-wrap justify-center" style={{ gap: 22 }}>
              {partnerBadges.map((badge, i) => {
                const src = safeImageUrl(badge.image)
                if (!src) return null
                return (
                  <FramedMedia key={badge._key || `badge-${i}`} className="dark:p-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={badge.name || "Partner badge"}
                      width={120}
                      height={44}
                      className="h-[44px] w-auto rounded-[5px]"
                    />
                  </FramedMedia>
                )
              })}
            </div>
          )}

          {heroHeading && (
            <h1
              className="text-center font-bold"
              style={{
                fontSize: "clamp(32px, 8vw, 48px)",
                lineHeight: "1.2",
                marginTop: partnerBadges.length > 0 ? 42 : 0,
                maxWidth: 924,
                color: "var(--text-body)",
              }}
            >
              {heroHeading}
            </h1>
          )}

          {heroSubheading && (
            <p
              className="text-center"
              style={{
                fontSize: 18,
                lineHeight: "28px",
                color: "var(--text-body)",
                marginTop: 24,
                maxWidth: 860,
              }}
            >
              {heroSubheading}
            </p>
          )}

          {heroBody && (
            <p
              className="text-center"
              style={{
                fontSize: 16,
                lineHeight: "26px",
                color: "var(--text-body)",
                marginTop: 16,
                maxWidth: 860,
              }}
            >
              {heroBody}
            </p>
          )}

          {(primaryCtaLabel || secondaryCtaLabel) && (
            <div
              className="flex items-center justify-center flex-wrap"
              style={{ gap: 20, marginTop: 40 }}
            >
              {primaryCtaLabel && (
                <CtaButton
                  href={primaryCtaUrl}
                  label={primaryCtaLabel}
                  variant="primary"
                  style={{ width: 260 }}
                />
              )}
              {secondaryCtaLabel && (
                <CtaButton
                  href={secondaryCtaUrl || "#case-studies"}
                  label={secondaryCtaLabel}
                  variant="outline"
                  style={{ width: 260 }}
                />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Client logos */}
      {(logoCloudPart1 || logoCloudAccent) && (
        <LogoCloudMarquee
          headingPart1={logoCloudPart1}
          headingAccent={logoCloudAccent}
          logos={siteSettings?.carouselLogos || []}
        />
      )}

      {/* Case studies - filterable by industry & solution */}
      <TestimonialFilterGrid
        heading={page?.caseStudySectionHeading}
        cards={caseStudyCards.map((s) => ({
          _key: s._key,
          title: s.title,
          product: s.product,
          industry: s.industry,
          services: s.services,
          timeline: s.timeline,
          verifiedSource: s.verifiedSource,
          imageUrl: getCaseStudyImageSrc(s.image),
        }))}
      />

      {/* CRO action items */}
      <CroSections data={page?.croSections} primaryCtaLabel={primaryCtaLabel} primaryCtaUrl={primaryCtaUrl} />

      {/* Calendly */}
      {(calendlyHeading || calendlySubheading) && (
        <CalendlySection
          heading={calendlyHeading}
          subheading={calendlySubheading}
          calendlyUrl={rawCalendly}
        />
      )}

      {/* Final CTA */}
      {discoverHeading && (
        <DiscoverCtaSection
          badge={siteSettings?.badgeCertifications}
          heading={discoverHeading}
          primaryCtaLabel={discoverPrimaryLabel}
          primaryCtaUrl={discoverPrimaryUrl}
          secondaryCtaLabel={discoverSecondaryLabel}
          secondaryCtaUrl={discoverSecondaryUrl}
        />
      )}
    </div>
  )
}
