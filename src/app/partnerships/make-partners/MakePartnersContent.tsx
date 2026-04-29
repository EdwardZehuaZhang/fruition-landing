"use client"

import {
  LogoCloudMarquee,
  ComparisonTabsSection,
  TestimonialsGrid,
  CalendlySection,
  DiscoverCtaSection,
  JoinStatsSection,
  SecurityBadgeSection,
  TestimonialCtaBanner,
} from "@/components/sections"
import type { CaseStudy, SiteSettingsData, ComparisonTab } from "@/components/sections/types"
import { urlFor } from "@/sanity/image"
import CtaButton from "@/components/CtaButton"

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageRef = any

interface ShowcaseCard {
  heading?: string
  body?: string
  imageRight?: boolean
  mediaType?: "image" | "video"
  image?: SanityImageRef
  videoUrl?: string
}

interface FeatureListItem {
  _key?: string
  emoji?: string
  text?: string
}

interface MakePartnersPageData {
  seoTitle?: string
  seoDescription?: string
  heroHeadingPart1?: string
  heroHeadingAccent?: string
  heroSubheading?: string
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaUrl?: string
  heroSecondaryCtaLabel?: string
  heroSecondaryCtaUrl?: string
  heroImage?: SanityImageRef
  announcementHeading?: string
  announcementBody?: string
  announcementImage?: SanityImageRef
  logoCloudHeadingPart1?: string
  logoCloudHeadingAccent?: string
  comparisonHeading?: string
  comparisonTabs?: ComparisonTab[]
  featureListsHeading?: string
  featureListsSubheading?: string
  featureListsRightEyebrow?: string
  featureListsFooter?: string
  featureListLeft?: FeatureListItem[]
  featureListRight?: FeatureListItem[]
  showcaseHeading?: string
  showcaseSubheading?: string
  showcaseCards?: ShowcaseCard[]
  calendlyHeading?: string
  calendlySubheading?: string
  testimonialsHeading?: string
  testimonialsCtaLabel?: string
  testimonialsCtaUrl?: string
  statCardValue?: string
  statCardSubtitle?: string
  statCardCtaLabel?: string
  statCardCtaUrl?: string
  joinHeadingPart1?: string
  joinHeadingAccent?: string
  joinHeadingPart2?: string
  joinStats?: Array<{ _key?: string; value?: string; label?: string }>
  joinCtaLabel?: string
  joinCtaUrl?: string
  testimonialBannerHeadingPart1?: string
  testimonialBannerHeadingAccent?: string
  testimonialBannerHeadingPart2?: string
  testimonialBannerPrimaryCtaLabel?: string
  testimonialBannerPrimaryCtaUrl?: string
  testimonialBannerSecondaryCtaLabel?: string
  testimonialBannerSecondaryCtaUrl?: string
  discoverHeading?: string
}

interface Props {
  siteSettings?: SiteSettingsData | null
  caseStudies?: CaseStudy[]
  pageData?: MakePartnersPageData | null
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function safeSrc(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try { return urlFor(ref).url() } catch { return null }
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function MakePartnersContent({
  siteSettings,
  caseStudies = [],
  pageData,
}: Props) {
  const calendlyUrl = siteSettings?.calendlyLink || ""
  const partnerBadges = siteSettings?.navbarPartnerBadges || []

  const featuredTestimonial = caseStudies[0]

  const heroImageSrc = safeSrc(pageData?.heroImage)
  const announcementImageSrc = safeSrc(pageData?.announcementImage)

  type ResolvedCard = {
    heading: string
    body: string
    imageRight: boolean
    mediaType: "video" | "image"
    mediaSrc: string
  }

  const resolvedShowcaseCards: ResolvedCard[] = (pageData?.showcaseCards ?? [])
    .map((card): ResolvedCard | null => {
      const heading = card.heading ?? ""
      const body = card.body ?? ""
      const imageRight = card.imageRight ?? true
      const mediaType = card.mediaType ?? "image"
      let mediaSrc = ""
      if (mediaType === "video") {
        mediaSrc = card.videoUrl ?? ""
      } else {
        mediaSrc = safeSrc(card.image) ?? ""
      }
      if (!mediaSrc) return null
      return { heading, body, imageRight, mediaType, mediaSrc }
    })
    .filter((c): c is ResolvedCard => c !== null)

  return (
    <div>
      {/* 1. Hero */}
      <section className="bg-white">
        <div className="mx-auto flex flex-col items-center px-6 md:px-16 lg:px-[273px] py-[80px]">
          {partnerBadges.length > 0 && (
            <div className="flex items-center flex-wrap justify-center" style={{ gap: 22 }}>
              {partnerBadges.map((badge, i) => {
                const src = safeSrc(badge.image)
                if (!src) return null
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    key={(badge as any)._key || `badge-${i}`}
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

          {(pageData?.heroHeadingPart1 || pageData?.heroHeadingAccent) && (
            <h1
              className="text-center font-bold"
              style={{ fontSize: 48, lineHeight: "67.2px", marginTop: 42, maxWidth: 924 }}
            >
              {pageData?.heroHeadingPart1 && <span className="text-black">{pageData.heroHeadingPart1}</span>}
              {pageData?.heroHeadingAccent && <span style={{ color: "#8015e8" }}>{pageData.heroHeadingAccent}</span>}
            </h1>
          )}

          {pageData?.heroSubheading && (
            <p
              style={{
                fontSize: 18,
                lineHeight: "25.2px",
                color: "black",
                marginTop: 31,
                textAlign: "center",
                maxWidth: 859,
                whiteSpace: "pre-line",
              }}
            >
              {pageData.heroSubheading}
            </p>
          )}

          {(pageData?.heroPrimaryCtaLabel || pageData?.heroSecondaryCtaLabel) && (
            <div className="flex flex-col sm:flex-row items-center justify-center" style={{ gap: 20, marginTop: 40 }}>
              {pageData?.heroPrimaryCtaLabel && (pageData.heroPrimaryCtaUrl || calendlyUrl) && (
                <CtaButton
                  href={pageData.heroPrimaryCtaUrl || calendlyUrl}
                  label={pageData.heroPrimaryCtaLabel}
                  variant="outline"
                  style={{ width: 330 }}
                />
              )}
              {pageData?.heroSecondaryCtaLabel && (pageData.heroSecondaryCtaUrl || calendlyUrl) && (
                <CtaButton
                  href={pageData.heroSecondaryCtaUrl || calendlyUrl}
                  label={pageData.heroSecondaryCtaLabel}
                  variant="primary"
                  style={{ width: 330 }}
                />
              )}
            </div>
          )}

          {heroImageSrc && (
            <div style={{ marginTop: 40, width: "100%", maxWidth: 1042 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageSrc}
                alt={pageData?.heroHeadingAccent || "Hero"}
                className="w-full h-auto"
              />
            </div>
          )}
        </div>
      </section>

      {/* 2. Partnership Announcement */}
      {(pageData?.announcementHeading || pageData?.announcementBody || announcementImageSrc) && (
        <section className="bg-[#f7f7f7] py-[80px] px-4">
          <div className="mx-auto flex flex-col md:flex-row items-center justify-center gap-12" style={{ maxWidth: 1100 }}>
            <div style={{ flex: 1, maxWidth: 650 }}>
              {pageData?.announcementHeading && (
                <h2 className="text-section-h2 text-black" style={{ marginBottom: 20 }}>
                  {pageData.announcementHeading}
                </h2>
              )}
              {pageData?.announcementBody && (
                <p style={{ fontSize: 18, lineHeight: "28.8px", color: "black" }}>
                  {pageData.announcementBody}
                </p>
              )}
            </div>
            {announcementImageSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={announcementImageSrc}
                alt={pageData?.announcementHeading || "Partnership"}
                width={233}
                height={233}
                className="rounded-[16px] shrink-0"
              />
            )}
          </div>
        </section>
      )}

      {/* 3. Logo Cloud */}
      {(pageData?.logoCloudHeadingPart1 || pageData?.logoCloudHeadingAccent) && (
        <LogoCloudMarquee
          headingPart1={pageData?.logoCloudHeadingPart1}
          headingAccent={pageData?.logoCloudHeadingAccent}
          logos={siteSettings?.carouselLogos || []}
        />
      )}

      {/* 4. Feature Tabs */}
      {pageData?.comparisonTabs && pageData.comparisonTabs.length > 0 && (
        <ComparisonTabsSection
          heading={pageData.comparisonHeading}
          tabs={pageData.comparisonTabs}
        />
      )}

      {/* 5. Feature Lists */}
      {(pageData?.featureListLeft?.length || pageData?.featureListRight?.length) && (
        <section className="py-[80px] px-4" style={{ backgroundColor: "#2b074d" }}>
          <div className="mx-auto" style={{ maxWidth: 1100 }}>
            <div className="flex flex-col items-center text-center" style={{ marginBottom: 48 }}>
              {pageData?.featureListsHeading && (
                <h2 className="text-section-h2 text-white" style={{ maxWidth: 900 }}>
                  {pageData.featureListsHeading}
                </h2>
              )}
              {pageData?.featureListsSubheading && (
                <p style={{ fontSize: 18, lineHeight: "28.8px", color: "rgba(255,255,255,0.85)", marginTop: 16, maxWidth: 760 }}>
                  {pageData.featureListsSubheading}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto" style={{ maxWidth: 900 }}>
              <div className="flex flex-col gap-5">
                {pageData?.featureListLeft?.map((item, i) => (
                  <div key={item._key || `fl1-${i}`} className="flex items-start gap-3">
                    <span className="text-[1.25rem] shrink-0">{item.emoji}</span>
                    <span style={{ fontSize: 16, lineHeight: "25.6px", color: "white" }}>{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-5">
                {pageData?.featureListsRightEyebrow && (
                  <p style={{ fontSize: 14, lineHeight: "22px", color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
                    {pageData.featureListsRightEyebrow}
                  </p>
                )}
                {pageData?.featureListRight?.map((item, i) => (
                  <div key={item._key || `fl2-${i}`} className="flex items-start gap-3">
                    <span className="text-[1.25rem] shrink-0">{item.emoji}</span>
                    <span className="font-semibold" style={{ fontSize: 16, lineHeight: "25.6px", color: "white" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {pageData?.featureListsFooter && (
              <p className="text-center mx-auto" style={{ fontSize: 16, lineHeight: "25.6px", color: "rgba(255,255,255,0.85)", marginTop: 48, maxWidth: 760 }}>
                {pageData.featureListsFooter}
              </p>
            )}
          </div>
        </section>
      )}

      {/* 6. Calendly */}
      {(pageData?.calendlyHeading || pageData?.calendlySubheading) && (
        <CalendlySection
          heading={pageData?.calendlyHeading}
          subheading={pageData?.calendlySubheading}
          calendlyUrl={calendlyUrl}
        />
      )}

      {/* 7. Showcase */}
      {resolvedShowcaseCards.length > 0 && (
        <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
            <div className="flex flex-col items-center text-center" style={{ marginBottom: 60 }}>
              {pageData?.showcaseHeading && (
                <h2 className="text-section-h2 text-black" style={{ maxWidth: 900 }}>
                  {pageData.showcaseHeading}
                </h2>
              )}
              {pageData?.showcaseSubheading && (
                <p className="text-black" style={{ fontSize: 20, marginTop: 12, maxWidth: 760 }}>
                  {pageData.showcaseSubheading}
                </p>
              )}
            </div>

            <div className="flex flex-col" style={{ gap: 60 }}>
              {resolvedShowcaseCards.map((card, i) => (
                <div
                  key={`showcase-${i}`}
                  className={`flex flex-col items-center gap-10 ${card.imageRight ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 28, fontWeight: 600, color: "#2b074d", lineHeight: "36px" }}>
                      {card.heading}
                    </h3>
                    <p style={{ fontSize: 16, lineHeight: "25.6px", color: "black", marginTop: 20 }}>
                      {card.body}
                    </p>
                  </div>
                  <div
                    className="rounded-card overflow-hidden w-full"
                    style={{ flex: 1, aspectRatio: "16 / 10", background: "#ffffff" }}
                  >
                    {card.mediaType === "video" ? (
                      <video
                        src={card.mediaSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={card.mediaSrc}
                        alt={card.heading}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Join Stats */}
      <JoinStatsSection
        headingPart1={pageData?.joinHeadingPart1}
        headingAccent={pageData?.joinHeadingAccent}
        headingPart2={pageData?.joinHeadingPart2}
        stats={pageData?.joinStats}
        ctaLabel={pageData?.joinCtaLabel}
        ctaUrl={pageData?.joinCtaUrl || calendlyUrl}
        siteSettings={siteSettings || undefined}
      />

      {/* 9. Testimonials */}
      <TestimonialsGrid
        caseStudies={caseStudies}
        heading={pageData?.testimonialsHeading ?? undefined}
        ctaLabel={pageData?.testimonialsCtaLabel ?? undefined}
        ctaUrl={pageData?.testimonialsCtaUrl ?? undefined}
        statCardValue={pageData?.statCardValue ?? undefined}
        statCardSubtitle={pageData?.statCardSubtitle ?? undefined}
        statCardCtaLabel={pageData?.statCardCtaLabel ?? undefined}
        statCardCtaUrl={pageData?.statCardCtaUrl ?? undefined}
      />

      {/* 10. Discover CTA */}
      {pageData?.discoverHeading && (
        <DiscoverCtaSection
          badge={siteSettings?.badgeCertifications}
          heading={pageData.discoverHeading}
        />
      )}

      {/* 11. Testimonial CTA Banner */}
      <TestimonialCtaBanner
        headingPart1={pageData?.testimonialBannerHeadingPart1}
        headingAccent={pageData?.testimonialBannerHeadingAccent}
        headingPart2={pageData?.testimonialBannerHeadingPart2}
        primaryCtaLabel={pageData?.testimonialBannerPrimaryCtaLabel}
        primaryCtaUrl={pageData?.testimonialBannerPrimaryCtaUrl || calendlyUrl}
        secondaryCtaLabel={pageData?.testimonialBannerSecondaryCtaLabel}
        secondaryCtaUrl={pageData?.testimonialBannerSecondaryCtaUrl || calendlyUrl}
        testimonial={featuredTestimonial}
      />

      {/* 12. Security */}
      <SecurityBadgeSection badge={siteSettings?.badgeSecurity} />
    </div>
  )
}
