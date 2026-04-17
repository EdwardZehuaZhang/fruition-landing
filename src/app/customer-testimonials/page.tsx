import Link from "next/link"
import { getSiteSettings, getPageBySlug } from "@/sanity/queries"
import { LogoCloudMarquee, CalendlySection, DiscoverCtaSection } from "@/components/sections"
import type { PartnerBadge, SanityImageRef } from "@/components/sections/types"
import { urlFor } from "@/sanity/image"

export async function generateMetadata() {
  const page = await getPageBySlug("customer-testimonials")
  return {
    title: page?.seoTitle || "Case Studies | Fruition Services",
    description:
      page?.seoDescription ||
      "Real results from 500+ businesses. See how Fruition transformed operations with monday.com.",
  }
}

interface CaseStudyCard {
  _key?: string
  title?: string
  image?: SanityImageRef | string
  product?: string
  services?: string
  timeline?: string
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

  const calendlyUrl =
    siteSettings?.calendlyLink || "https://calendly.com/global-calendar-fruitionservices"
  const partnerBadges: PartnerBadge[] = page?.heroPartnerBadges?.length > 0
    ? page.heroPartnerBadges
    : siteSettings?.navbarPartnerBadges || []

  const heroHeading = page?.heroHeading || "Case Studies"
  const heroSubheading =
    page?.heroSubheading ||
    "A big part of our operation is ensuring we set up our clients for success through our specialized monday.com and AI expertise."
  const heroBody =
    page?.heroBody ||
    "Become part of the growing community of companies across all industries that have optimised their workflows and boosted team performance with our proven guidance."
  const primaryCtaLabel = page?.primaryCtaLabel || "\uD83D\uDE80 Get Started"
  const primaryCtaUrl = page?.primaryCtaUrl || calendlyUrl
  const secondaryCtaLabel = page?.secondaryCtaLabel || "\uD83D\uDCD1 Learn More"
  const secondaryCtaUrl = page?.secondaryCtaUrl || "#case-studies"

  const logoCloudPart1 = page?.logoCloudHeadingPart1 || "Clients who have used our "
  const logoCloudAccent = page?.logoCloudHeadingAccent || "monday.com expert consultants"

  const caseStudyCards: CaseStudyCard[] = page?.caseStudyCards || []

  const calendlyHeading =
    page?.calendlyHeading ||
    "Schedule Your Personalised Demo With A monday.com Expert"
  const calendlySubheading =
    page?.calendlySubheading ||
    "Schedule a demo with our monday.com implementation consultants to discover how monday.com can be customised for your business, and get a free 4-week extended trial to experience its full potential."

  const discoverHeading =
    page?.discoverHeading ||
    "Discover how much monday.com can do for your team."
  const discoverPrimaryLabel = page?.discoverPrimaryCtaLabel || "Schedule a Consultation"
  const discoverPrimaryUrl = page?.discoverPrimaryCtaUrl || calendlyUrl
  const discoverSecondaryLabel = page?.discoverSecondaryCtaLabel || "Get Started with monday.com"
  const discoverSecondaryUrl = page?.discoverSecondaryCtaUrl || calendlyUrl

  return (
    <div>
      {/* Hero */}
      <section className="bg-white">
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
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={badge._key || `badge-${i}`}
                    src={src}
                    alt={badge.name || "Partner badge"}
                    width={120}
                    height={44}
                    className="h-[44px] w-auto rounded-[5px]"
                  />
                )
              })}
            </div>
          )}

          <h1
            className="text-center font-bold"
            style={{
              fontSize: 48,
              lineHeight: "67.2px",
              marginTop: partnerBadges.length > 0 ? 42 : 0,
              maxWidth: 924,
              color: "black",
            }}
          >
            {heroHeading}
          </h1>

          <p
            className="text-center"
            style={{
              fontSize: 18,
              lineHeight: "28px",
              color: "black",
              marginTop: 24,
              maxWidth: 860,
            }}
          >
            {heroSubheading}
          </p>

          <p
            className="text-center"
            style={{
              fontSize: 16,
              lineHeight: "26px",
              color: "#444",
              marginTop: 16,
              maxWidth: 860,
            }}
          >
            {heroBody}
          </p>

          <div
            className="flex items-center justify-center flex-wrap"
            style={{ gap: 20, marginTop: 40 }}
          >
            <Link
              href={primaryCtaUrl}
              className="flex items-center justify-center font-bold text-white"
              style={{
                width: 260,
                height: 53,
                borderRadius: 100,
                background: "linear-gradient(to right, #8015e8, #ba83f0)",
                fontSize: 16,
              }}
            >
              {primaryCtaLabel}
            </Link>
            <Link
              href={secondaryCtaUrl}
              className="flex items-center justify-center font-bold"
              style={{
                width: 260,
                height: 53,
                borderRadius: 100,
                border: "1px solid #8015e8",
                backgroundColor: "white",
                color: "#8015e8",
                fontSize: 16,
              }}
            >
              {secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* Client logos */}
      <LogoCloudMarquee
        headingPart1={logoCloudPart1}
        headingAccent={logoCloudAccent}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* Case studies */}
      {caseStudyCards.length > 0 && (
        <section id="case-studies" className="bg-white" style={{ paddingTop: 96, paddingBottom: 96 }}>
          <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
            <div className="flex flex-col" style={{ gap: 40 }}>
              {caseStudyCards.map((study, i) => {
                const imgSrc = getCaseStudyImageSrc(study.image)
                return (
                  <article
                    key={study._key || study.title || i}
                    className="relative overflow-hidden"
                    style={{
                      borderRadius: 32,
                      background:
                        "linear-gradient(135deg, #faf7ff 0%, #ffffff 55%, #f9f5ff 100%)",
                      padding: 56,
                    }}
                  >
                    {/* decorative top-right soft blob */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute"
                      style={{
                        top: -120,
                        right: -120,
                        width: 320,
                        height: 320,
                        borderRadius: "50%",
                        background:
                          "radial-gradient(circle, rgba(128,21,232,0.10) 0%, rgba(128,21,232,0) 70%)",
                      }}
                    />

                    <div className="relative">
                      {/* Eyebrow */}
                      <div className="flex items-center" style={{ gap: 12 }}>
                        <span
                          className="font-bold"
                          style={{
                            color: "#8015e8",
                            fontSize: 14,
                            letterSpacing: "0.08em",
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          aria-hidden
                          style={{
                            display: "inline-block",
                            width: 28,
                            height: 1,
                            backgroundColor: "#d9c8f5",
                          }}
                        />
                        <span
                          className="font-semibold uppercase"
                          style={{
                            color: "#8015e8",
                            fontSize: 12,
                            letterSpacing: "0.18em",
                          }}
                        >
                          Case Study
                        </span>
                      </div>

                      {/* Title */}
                      <h2
                        className="font-bold"
                        style={{
                          fontSize: 44,
                          lineHeight: "52px",
                          letterSpacing: "-0.015em",
                          color: "#1a0b3e",
                          marginTop: 18,
                          maxWidth: 880,
                        }}
                      >
                        {study.title}
                      </h2>

                      {/* Services as lead paragraph */}
                      <p
                        style={{
                          fontSize: 18,
                          lineHeight: "28px",
                          color: "#4a4a57",
                          marginTop: 18,
                          maxWidth: 820,
                        }}
                      >
                        {study.services}
                      </p>

                      {/* Pills: Product + Timeline */}
                      <div
                        className="flex flex-wrap items-center"
                        style={{ gap: 12, marginTop: 28 }}
                      >
                        {study.product && (
                          <span
                            className="inline-flex items-center font-semibold"
                            style={{
                              gap: 8,
                              padding: "8px 16px",
                              borderRadius: 999,
                              backgroundColor: "#f2e8ff",
                              color: "#5a0ea5",
                              fontSize: 14,
                            }}
                          >
                            <span
                              aria-hidden
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor: "#8015e8",
                              }}
                            />
                            {study.product}
                          </span>
                        )}

                        {study.timeline && (
                          <span
                            className="inline-flex items-center font-medium"
                            style={{
                              gap: 8,
                              padding: "8px 16px",
                              borderRadius: 999,
                              border: "1px solid #e2d6f3",
                              backgroundColor: "#ffffff",
                              color: "#3b2963",
                              fontSize: 14,
                            }}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#8015e8"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden
                            >
                              <circle cx="12" cy="12" r="9" />
                              <polyline points="12 7 12 12 15 14" />
                            </svg>
                            {study.timeline}
                          </span>
                        )}
                      </div>

                      {/* Image */}
                      {imgSrc && (
                        <div style={{ marginTop: 40 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgSrc}
                            alt={study.title || "Case study"}
                            className="w-full h-auto block"
                            style={{ borderRadius: 20 }}
                          />
                        </div>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Calendly */}
      <CalendlySection
        heading={calendlyHeading}
        subheading={calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* Final CTA */}
      <DiscoverCtaSection
        badge={siteSettings?.badgeCertifications}
        heading={discoverHeading}
        primaryCtaLabel={discoverPrimaryLabel}
        primaryCtaUrl={discoverPrimaryUrl}
        secondaryCtaLabel={discoverSecondaryLabel}
        secondaryCtaUrl={discoverSecondaryUrl}
      />
    </div>
  )
}
