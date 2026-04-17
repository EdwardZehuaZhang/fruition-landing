import Link from "next/link"
import { getSiteSettings, getCaseStudies, getPageBySlug, getFaqItemsForPage } from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import {
  LogoCloudMarquee,
  CapabilitiesGrid,
  RemoteTeamSection,
  FaqAccordion,
  ApplicationFormSection,
  TestimonialsGrid,
  TestimonialCtaBanner,
  PartnerEcosystemSection,
} from "@/components/sections"
import type { Partner } from "@/components/sections/PartnerEcosystemSection"
import type { CaseStudy } from "@/components/sections/types"

export async function generateMetadata() {
  const page = await getPageBySlug("careers")
  return {
    title: page?.seoTitle || "Careers | Fruition Services",
    description:
      page?.seoDescription ||
      "Join Fruition — a Platinum monday.com partner building workflow, automation and integration solutions. 100% remote across 5 countries.",
  }
}

export default async function CareersPage() {
  const [siteSettings, caseStudies, page, centralFaqs] = await Promise.all([
    getSiteSettings(),
    getCaseStudies(),
    getPageBySlug("careers"),
    getFaqItemsForPage("careers"),
  ])

  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  const studies: CaseStudy[] = caseStudies || []
  const featuredTestimonial =
    studies.find(
      (c) =>
        c.clientCompany?.toLowerCase().includes("windfall") ||
        c.clientName?.toLowerCase().includes("louis stenmark"),
    ) || studies[0]

  /* ----------------------------------------------------------------- */
  /*  Pull content from Sanity page doc, with sensible fallbacks       */
  /* ----------------------------------------------------------------- */

  const heroEyebrow = page?.heroEyebrow || "Careers"
  const heroHeading = page?.heroHeading || "Build Solutions That Matter"
  const heroSubheading =
    page?.heroSubheading ||
    "At Fruition, we design solutions that simplify, scale and transform the way teams operate. As a Platinum monday.com partner, we specialize in tailoring workflows, automations, and integrations that turn software into a growth engine."
  const primaryCtaLabel = page?.primaryCtaLabel || "\uD83D\uDE80 Join Us"
  const primaryCtaUrl = page?.primaryCtaUrl || "#application-form"
  const secondaryCtaLabel = page?.secondaryCtaLabel || "See Where We Work"
  const secondaryCtaUrl = page?.secondaryCtaUrl || "#remote"

  const heroStats = page?.heroStats || [
    { value: "500+", label: "Clients transformed" },
    { value: "5", label: "Countries" },
    { value: "7", label: "SaaS partnerships" },
    { value: "100%", label: "Remote team" },
  ]

  const logoCloudPart1 = page?.logoCloudHeadingPart1 || "Trusted by 500+ companies worldwide to "
  const logoCloudAccent = page?.logoCloudHeadingAccent || "transform how they work"

  const benefitsEyebrow = page?.capabilitiesEyebrow || "BENEFITS"
  const benefitsHeading = page?.capabilitiesHeading || "Why Join "
  const benefitsAccent = page?.capabilitiesHeadingAccent || "Fruition"
  const benefitsSubheading =
    page?.capabilitiesSubheading ||
    "Four reasons our consultants, developers and strategists choose to build their careers at Fruition."
  const benefitsCards = page?.capabilitiesCards || []

  const partnerEyebrow = page?.partnerEcosystemEyebrow || "PARTNER ECOSYSTEM"
  const partnerHeading = page?.partnerEcosystemHeading || "Built on a platform of "
  const partnerAccent = page?.partnerEcosystemHeadingAccent || "trusted partners"
  const partnerSubheading =
    page?.partnerEcosystemSubheading ||
    "We partner with 7 industry-leading SaaS platforms to deliver best-in-class solutions tailored to our clients\u2019 needs."
  const partnerCards: Partner[] = page?.partnerEcosystemCards || []

  const lookingForHeading = page?.secondaryCapabilitiesHeading || "What We're "
  const lookingForAccent = page?.secondaryCapabilitiesHeadingAccent || "Looking For"
  const lookingForSubheading =
    page?.secondaryCapabilitiesSubheading ||
    "If you\u2019re passionate about helping businesses work better, we want to hear from you."
  const lookingForCards = page?.secondaryCapabilitiesCards || []
  const lookingForCtaLabel = page?.secondaryCapabilitiesCtaLabel || "\uD83D\uDE80 Join Us"
  const lookingForCtaUrl = page?.secondaryCapabilitiesCtaUrl || "#application-form"

  const remoteEyebrow = page?.remoteTeamEyebrow || "\uD83C\uDF0D FULLY REMOTE"
  const remoteHeading = page?.remoteTeamHeading || "Work From Anywhere. "
  const remoteAccent = page?.remoteTeamHeadingAccent || "Our Team Is Global."
  const remoteSubheading =
    page?.remoteTeamSubheading ||
    "Fruition is a 100% remote company. Our consultants, developers, and strategists collaborate across five countries \u2014 meaning you can work from home, a caf\u00E9, or wherever you do your best thinking."
  const offices = page?.officeLocations || []
  const remoteFeatures = page?.remoteFeatures || []
  const remoteCtaLabel = page?.remoteTeamCtaLabel || "\uD83D\uDE80 Join Our Remote Team"
  const remoteCtaUrl = page?.remoteTeamCtaUrl || "#application-form"

  // FAQ — prefer central faqItem docs, fallback to page-embedded faqTabs
  const faqTabs = centralFaqs?.length > 0
    ? groupFaqsIntoTabs(centralFaqs)
    : page?.faqTabs || []

  const appFormHeading = page?.applicationFormHeading || "Apply Now"
  const appFormUrl = page?.applicationFormEmbedUrl || "https://forms.monday.com/forms/embed/a8f0bd1f2cc95cec5fb0dfb32726b8c4?r=use1"

  const testimonialsHeading = page?.testimonialsHeading || "What it\u2019s like to work with us \uD83D\uDE4C"

  const bannerPart1 = page?.testimonialBannerHeadingPart1 || "Join the team behind "
  const bannerAccent = page?.testimonialBannerHeadingAccent || "500+ successful"
  const bannerPart2 = page?.testimonialBannerHeadingPart2 || " monday.com transformations."
  const bannerPrimaryLabel = page?.testimonialBannerPrimaryCtaLabel || "\uD83D\uDE80 Apply Now"
  const bannerPrimaryUrl = page?.testimonialBannerPrimaryCtaUrl || "#application-form"
  const bannerSecondaryLabel = page?.testimonialBannerSecondaryCtaLabel || "Book a Call"
  const bannerSecondaryUrl = page?.testimonialBannerSecondaryCtaUrl || calendlyUrl

  return (
    <div>
      {/* -------------------------------------------------------------- */}
      {/*  1. Hero — custom layout with chip, headline, CTAs + stat row  */}
      {/* -------------------------------------------------------------- */}
      <section className="bg-white">
        <div
          className="mx-auto flex flex-col items-center px-4"
          style={{ maxWidth: 1200, paddingTop: 96, paddingBottom: 64 }}
        >
          <div
            className="inline-flex items-center rounded-full"
            style={{
              backgroundColor: "#f4ecff",
              color: "var(--purple-primary)",
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              border: "1px solid #e4d6fb",
            }}
          >
            <span aria-hidden style={{ marginRight: 8 }}>{"\uD83D\uDE80"}</span> {heroEyebrow}
          </div>

          <h1
            className="text-display text-center"
            style={{ marginTop: 24, maxWidth: 900 }}
          >
            <span className="text-black">{heroHeading.replace(/\s\S+$/, "")} </span>
            <span style={{ color: "var(--purple-primary)" }}>{heroHeading.split(" ").pop()}</span>
          </h1>

          <p
            className="text-body-lead text-center"
            style={{
              marginTop: 24,
              maxWidth: 820,
              color: "#4a4a4a",
              lineHeight: 1.6,
            }}
          >
            {heroSubheading}
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center"
            style={{ gap: 16, marginTop: 40 }}
          >
            <Link
              href={primaryCtaUrl}
              className="flex items-center justify-center font-bold"
              style={{
                minWidth: 240,
                height: 53,
                padding: "0 32px",
                borderRadius: 100,
                background: "linear-gradient(to right, #8015e8, #ba83f0)",
                color: "white",
                fontSize: 16,
              }}
            >
              {primaryCtaLabel}
            </Link>
            <Link
              href={secondaryCtaUrl}
              className="flex items-center justify-center font-bold"
              style={{
                minWidth: 240,
                height: 53,
                padding: "0 32px",
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

          <div
            className="grid grid-cols-2 md:grid-cols-4"
            style={{
              marginTop: 56,
              gap: 16,
              width: "100%",
              maxWidth: 920,
            }}
          >
            {heroStats.map((s: { value?: string; label?: string }, i: number) => (
              <div
                key={s.label || i}
                className="rounded-card border border-[#ece7fb] bg-white text-center"
                style={{ padding: 20, boxShadow: "var(--shadow-whisper)" }}
              >
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "var(--purple-primary)",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    color: "#4a4a4a",
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Client logo marquee */}
      <LogoCloudMarquee
        headingPart1={logoCloudPart1}
        headingAccent={logoCloudAccent}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 3. Benefits — "Why Join Fruition" */}
      {benefitsCards.length > 0 && (
        <CapabilitiesGrid
          eyebrow={benefitsEyebrow}
          heading={benefitsHeading}
          headingAccent={benefitsAccent}
          subheading={benefitsSubheading}
          theme="light"
          columns={2}
          cards={benefitsCards}
        />
      )}

      {/* 4. Partner Ecosystem — SaaS platforms */}
      {partnerCards.length > 0 && (
        <PartnerEcosystemSection
          eyebrow={partnerEyebrow}
          heading={partnerHeading}
          headingAccent={partnerAccent}
          subheading={partnerSubheading}
          partners={partnerCards}
        />
      )}

      {/* 5. What We're Looking For */}
      {lookingForCards.length > 0 && (
        <CapabilitiesGrid
          heading={lookingForHeading}
          headingAccent={lookingForAccent}
          subheading={lookingForSubheading}
          theme="light"
          columns={3}
          cards={lookingForCards}
          ctaLabel={lookingForCtaLabel}
          ctaUrl={lookingForCtaUrl}
        />
      )}

      {/* 6. Remote Team / Global Offices */}
      {(offices.length > 0 || remoteHeading) && (
        <div id="remote">
          <RemoteTeamSection
            eyebrow={remoteEyebrow}
            heading={remoteHeading}
            headingAccent={remoteAccent}
            subheading={remoteSubheading}
            offices={offices}
            features={remoteFeatures}
            ctaLabel={remoteCtaLabel}
            ctaUrl={remoteCtaUrl}
          />
        </div>
      )}

      {/* 7. FAQ */}
      {faqTabs.length > 0 && <FaqAccordion tabs={faqTabs} />}

      {/* 8. Application form embed */}
      {appFormUrl && (
        <div id="application-form">
          <ApplicationFormSection
            heading={appFormHeading}
            embedUrl={appFormUrl}
          />
        </div>
      )}

      {/* 9. Testimonials — social proof after the ask */}
      <TestimonialsGrid
        heading={testimonialsHeading}
        caseStudies={studies}
      />

      {/* 10. Bottom CTA banner */}
      <TestimonialCtaBanner
        headingPart1={bannerPart1}
        headingAccent={bannerAccent}
        headingPart2={bannerPart2}
        primaryCtaLabel={bannerPrimaryLabel}
        primaryCtaUrl={bannerPrimaryUrl}
        secondaryCtaLabel={bannerSecondaryLabel}
        secondaryCtaUrl={bannerSecondaryUrl}
        testimonial={featuredTestimonial}
      />
    </div>
  )
}
