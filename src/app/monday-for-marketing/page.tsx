import {
  getIndustryPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import {
  HeroBanner,
  LogoCloudMarquee,
  ComparisonTabsSection,
  CalendlySection,
  FaqAccordion,
  CaseStudyCardsSection,
  SolutionCardsSection,
  TestimonialCtaBanner,
} from "@/components/sections"
import YouTubeEmbed from "@/components/YouTubeEmbed"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-marketing")
  return {
    alternates: { canonical: "/monday-for-marketing" },
    title: page?.seoTitle,
    description: page?.seoDescription,
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getIndustryPageBySlug("monday-for-marketing"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-for-marketing"),
  ])

  if (!page) return null

  const calendlyUrl =
    siteSettings?.calendlyLink || "https://calendly.com/global-calendar-fruitionservices"

  const faqTabs = groupFaqsIntoTabs(centralFaqs)
  const effectiveFaqTabs = faqTabs.length > 0 ? faqTabs : page.faqTabs || []

  const featuredTestimonial =
    caseStudies?.find(
      (c: { clientCompany?: string; clientName?: string }) =>
        c.clientCompany?.toLowerCase().includes("windfall") ||
        c.clientName?.toLowerCase().includes("louis stenmark"),
    ) || caseStudies?.[0]

  return (
    <div>
      {/* 1. Hero */}
      <HeroBanner
        headingPart1={page.heroHeading || page.title || ""}
        subheading={page.hideHeroSubheading ? undefined : page.heroSubheading}
        heroImage={page.heroImage}
        partnerImageSrc={page.heroPartnerImagePath}
        primaryCtaLabel={page.primaryCtaLabel}
        primaryCtaUrl={page.primaryCtaUrl || calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={page.secondaryCtaUrl || calendlyUrl}
      />

      {/* 2. Logo Cloud */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1 || ""}
        headingAccent={page.logoCloudHeadingAccent ?? ""}
        description={page.logoCloudDescription}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3. Three-tab "Why monday.com for Marketing & Creative?" */}
      <ComparisonTabsSection
        heading={page.comparisonHeading}
        tabs={page.comparisonTabs || []}
        theme="light"
        layout="tabs"
        withPurpleCircle={false}
      />

      {/* 4. Calendly */}
      <CalendlySection
        heading={page.calendlyHeading}
        subheading={page.calendlySubheading}
        calendlyUrl={calendlyUrl}
      />

      {/* 5. FAQ */}
      {effectiveFaqTabs.length > 0 && <FaqAccordion tabs={effectiveFaqTabs} />}

      {/* 6. Marketing Case Studies (with video) */}
      <CaseStudyCardsSection
        heading={page.caseStudySectionHeading}
        cards={page.marketingCaseStudyCards || []}
      />

      {/* 7. Streamline content creation */}
      {page.solutionCards?.length > 0 && (
        <SolutionCardsSection cards={page.solutionCards} />
      )}

      {/* 8. Full-width video + Why the best use monday.com — single unified section */}
      <section style={{ backgroundColor: "#f7f5ff", paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
          {page.bottomVideoUrl && (
            <div
              className="w-full rounded-card overflow-hidden"
              style={{ aspectRatio: "16 / 9", marginBottom: 64 }}
            >
              <YouTubeEmbed
                url={page.bottomVideoUrl}
                title={page.bottomVideoTitle}
              />
            </div>
          )}
          {page.whyBestHeading && (
            <h2
              className="text-section-h2 text-center"
              style={{ color: "#000000", marginBottom: 48 }}
            >
              {page.whyBestHeading}
            </h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 24 }}>
            {(page.whyBestCards || []).map((card: { _key?: string; emoji?: string; title?: string; description?: string }) => (
              <div
                key={card._key}
                className="bg-white rounded-card border border-[#e8e6e6]"
                style={{ padding: 28 }}
              >
                <div style={{ fontSize: 32, lineHeight: 1, marginBottom: 12 }}>{card.emoji}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 8 }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 15, lineHeight: "22px", color: "#4a4a4a" }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Join 500+ CTA + testimonial */}
      <TestimonialCtaBanner
        headingPart1={page.joinHeadingPart1}
        headingAccent={page.joinHeadingAccent}
        headingPart2={page.joinHeadingPart2}
        primaryCtaLabel={page.testimonialBannerPrimaryCtaLabel}
        primaryCtaUrl={calendlyUrl}
        secondaryCtaLabel={page.secondaryCtaLabel}
        secondaryCtaUrl={page.secondaryCtaUrl || calendlyUrl}
        testimonial={featuredTestimonial}
        testimonials={caseStudies}
      />
    </div>
  )
}
