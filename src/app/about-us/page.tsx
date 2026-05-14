import {
  getPageBySlug,
  getSiteSettings,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import AboutModern from "./AboutModern"

export async function generateMetadata() {
  const page = await getPageBySlug("about-us")
  return {
    title: page?.seoTitle,
    description: page?.seoDescription,
  }
}

export default async function Page() {
  const [page, siteSettings, centralFaqs] = await Promise.all([
    getPageBySlug("about-us"),
    getSiteSettings(),
    getFaqItemsForPage("about-us"),
  ])

  if (!page) return null

  const calendlyUrl =
    siteSettings?.calendlyLink ||
    "https://calendly.com/global-calendar-fruitionservices"

  const centralTabs = groupFaqsIntoTabs(centralFaqs)
  const faqTabs =
    page.faqTabs?.length > 0 ? page.faqTabs : centralTabs

  return (
    <AboutModern
      heroEyebrow={page.heroEyebrow}
      heroHeading={page.heroHeading || page.title}
      heroSubheading={page.heroSubheading}
      heroImage={page.heroImage}
      primaryCtaLabel={page.primaryCtaLabel}
      primaryCtaUrl={page.primaryCtaUrl}
      secondaryCtaLabel={page.secondaryCtaLabel}
      secondaryCtaUrl={page.secondaryCtaUrl}
      partnerBadges={page.heroPartnerBadges}
      stats={page.joinStats}
      textSections={page.textContentSections}
      capabilitiesEyebrow={page.capabilitiesEyebrow}
      capabilitiesHeading={page.capabilitiesHeading}
      capabilityCards={page.capabilitiesCards}
      methodologyHeading={page.methodologyHeading}
      methodologySteps={page.methodologySteps}
      comparisonTabs={page.comparisonTabs}
      faqHeading={page.faqHeading}
      faqTabs={faqTabs}
      calendlyHeading={page.calendlyHeading}
      calendlySubheading={page.calendlySubheading}
      calendlyUrl={calendlyUrl}
      siteSettings={siteSettings}
    />
  )
}
