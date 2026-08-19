import Link from "next/link"
import { getSiteSettings, getPageBySlug, getFaqItemsForPage } from "@/sanity/queries"
import { resolveFaqTabs } from "@/sanity/groupFaqs"
import { urlFor } from "@/sanity/image"
import {
  LogoCloudMarquee,
  CapabilitiesGrid,
  RemoteTeamSection,
  FaqAccordion,
  ApplicationFormSection,
  PartnerEcosystemSection,
} from "@/components/sections"
import type { Partner } from "@/components/sections/PartnerEcosystemSection"
import type { SanityImageRef } from "@/components/sections/types"
import { buildOgMetadata } from "@/lib/metadata"

function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try { return urlFor(ref).width(800).auto("format").url() } catch { return null }
}

export async function generateMetadata() {
  const page = await getPageBySlug("careers")
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/careers" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/careers",
    }),
  }
}

export default async function CareersPage() {
  const [siteSettings, page, centralFaqs] = await Promise.all([
    getSiteSettings(),
    getPageBySlug("careers"),
    getFaqItemsForPage("careers"),
  ])

  const faqTabs = resolveFaqTabs(page.faqTabs, centralFaqs)

  const partnerCards: Partner[] = page.partnerEcosystemCards || []
  const heroImageSrc = safeImageUrl(page.heroImage)

  return (
    <div>
      {/* 1. Hero */}
      <section className="bg-surface">
        <div
          className="mx-auto flex flex-col items-center px-4"
          style={{ maxWidth: 1200, paddingTop: 96, paddingBottom: 64 }}
        >
          {page.heroEyebrow && (
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
              {page.heroEyebrow}
            </div>
          )}

          {page.heroHeading && (
            <h1
              className="text-display text-center"
              style={{ marginTop: 24, maxWidth: 900 }}
            >
              {page.heroHeadingAccent ? (
                (() => {
                  const idx = page.heroHeading.indexOf(page.heroHeadingAccent)
                  if (idx >= 0) {
                    return (
                      <>
                        <span className="text-body">{page.heroHeading.slice(0, idx)}</span>
                        <span style={{ color: "var(--purple-primary)" }}>{page.heroHeadingAccent}</span>
                        <span className="text-body">{page.heroHeading.slice(idx + page.heroHeadingAccent.length)}</span>
                      </>
                    )
                  }
                  return <span className="text-body">{page.heroHeading}</span>
                })()
              ) : (
                <span className="text-body">{page.heroHeading}</span>
              )}
            </h1>
          )}

          {page.heroSubheading && (
            <p
              className="text-body-lead text-center"
              style={{
                marginTop: 24,
                maxWidth: 820,
                color: "var(--text-body)",
                lineHeight: 1.6,
              }}
            >
              {page.heroSubheading}
            </p>
          )}

          {(page.primaryCtaLabel || page.secondaryCtaLabel) && (
            <div
              className="flex flex-col md:flex-row items-center justify-center"
              style={{ gap: 16, marginTop: 40 }}
            >
              {page.primaryCtaLabel && (
                <Link
                  href={page.primaryCtaUrl || "#application-form"}
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
                  {page.primaryCtaLabel}
                </Link>
              )}
              {page.secondaryCtaLabel && (
                <Link
                  href={page.secondaryCtaUrl || "#remote"}
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
                  {page.secondaryCtaLabel}
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 2. Team image */}
      {heroImageSrc && (
        <section className="bg-surface">
          <div className="mx-auto px-4" style={{ maxWidth: 1200, paddingBottom: 64 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImageSrc}
              alt={page.heroHeading || "The Fruition team"}
              className="rounded-card w-full h-auto"
            />
          </div>
        </section>
      )}

      {/* 3. Client logo marquee */}
      <LogoCloudMarquee
        headingPart1={page.logoCloudHeadingPart1}
        headingAccent={page.logoCloudHeadingAccent}
        logos={siteSettings?.carouselLogos || []}
      />

      {/* 4. Benefits — "Why Join Fruition" */}
      {page.capabilitiesCards?.length > 0 && (
        <CapabilitiesGrid
          eyebrow={page.capabilitiesEyebrow}
          heading={page.capabilitiesHeading}
          headingAccent={page.capabilitiesHeadingAccent}
          subheading={page.capabilitiesSubheading}
          theme="light"
          columns={page.capabilitiesColumns || 2}
          cards={page.capabilitiesCards}
        />
      )}

      {/* 5. Partner Ecosystem */}
      {partnerCards.length > 0 && (
        <PartnerEcosystemSection
          eyebrow={page.partnerEcosystemEyebrow}
          heading={page.partnerEcosystemHeading}
          headingAccent={page.partnerEcosystemHeadingAccent}
          subheading={page.partnerEcosystemSubheading}
          partners={partnerCards}
        />
      )}

      {/* 6. What We're Looking For */}
      {page.secondaryCapabilitiesCards?.length > 0 && (
        <CapabilitiesGrid
          heading={page.secondaryCapabilitiesHeading}
          headingAccent={page.secondaryCapabilitiesHeadingAccent}
          subheading={page.secondaryCapabilitiesSubheading}
          theme="light"
          columns={page.secondaryCapabilitiesColumns || 3}
          cards={page.secondaryCapabilitiesCards}
          ctaLabel={page.secondaryCapabilitiesCtaLabel}
          ctaUrl={page.secondaryCapabilitiesCtaUrl}
        />
      )}

      {/* 7. Remote Team / Global Offices */}
      {(page.officeLocations?.length > 0 || page.remoteTeamHeading) && (
        <div id="remote">
          <RemoteTeamSection
            eyebrow={page.remoteTeamEyebrow}
            heading={page.remoteTeamHeading}
            headingAccent={page.remoteTeamHeadingAccent}
            subheading={page.remoteTeamSubheading}
            offices={page.officeLocations || []}
            features={page.remoteFeatures || []}
            ctaLabel={page.remoteTeamCtaLabel}
            ctaUrl={page.remoteTeamCtaUrl}
            bg="transparent"
          />
        </div>
      )}

      {/* 8. Application form embed */}
      {page.applicationFormEmbedUrl && (
        <div id="application-form">
          <ApplicationFormSection
            heading={page.applicationFormHeading}
            embedUrl={page.applicationFormEmbedUrl}
          />
        </div>
      )}

      {/* 9. FAQ */}
      {faqTabs.length > 0 && <FaqAccordion tabs={faqTabs} />}
    </div>
  )
}
