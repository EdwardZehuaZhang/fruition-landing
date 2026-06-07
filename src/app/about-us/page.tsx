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

  const calendlyUrl = siteSettings?.calendlyLink ?? ""

  const centralTabs = groupFaqsIntoTabs(centralFaqs)
  const faqTabs =
    page.faqTabs?.length > 0 ? page.faqTabs : centralTabs

  return (
    <AboutModern
      heroEyebrow={page.heroEyebrow}
      heroHeadingPart1={page.heroHeadingPart1}
      heroHeadingAccent={page.heroHeadingAccent}
      heroHeadingPart2={page.heroHeadingPart2}
      heroSubheading={page.heroSubheading}
      heroImage={page.heroImage}
      heroPartnerBadgesLabel={page.heroPartnerBadgesLabel}
      heroCalloutBadgeLabel={page.heroCalloutBadgeLabel}
      heroCalloutBadgeText={page.heroCalloutBadgeText}
      heroCalloutOfficesText={page.heroCalloutOfficesText}
      primaryCtaLabel={page.primaryCtaLabel}
      primaryCtaUrl={page.primaryCtaUrl}
      secondaryCtaLabel={page.secondaryCtaLabel}
      secondaryCtaUrl={page.secondaryCtaUrl}
      partnerBadges={page.heroPartnerBadges}
      stats={page.joinStats}
      textSections={page.textContentSections}
      storyEyebrow={page.storyEyebrow}
      storyHeading={page.storyHeading}
      storyHeadingAccent={page.storyHeadingAccent}
      storyCardEyebrowPrefix={page.storyCardEyebrowPrefix}
      capabilitiesEyebrow={page.capabilitiesEyebrow}
      capabilitiesHeading={page.capabilitiesHeading}
      capabilityCards={page.capabilitiesCards}
      methodologyEyebrow={page.methodologyEyebrow}
      methodologyStepLabel={page.methodologyStepLabel}
      methodologyHeading={page.methodologyHeading}
      methodologySteps={page.methodologySteps}
      approachEyebrow={page.approachEyebrow}
      approachHeading={page.approachHeading}
      approachHeadingAccent={page.approachHeadingAccent}
      comparisonTabs={page.comparisonTabs}
      globalPresenceEyebrow={page.globalPresenceEyebrow}
      globalPresenceHeading={page.globalPresenceHeading}
      globalPresenceHeadingAccent={page.globalPresenceHeadingAccent}
      globalPresenceBody={page.globalPresenceBody}
      offices={page.offices}
      partnerStackEyebrow={page.partnerStackEyebrow}
      faqHeading={page.faqHeading}
      faqTabs={faqTabs}
      calendlyHeading={page.calendlyHeading}
      calendlySubheading={page.calendlySubheading}
      calendlyUrl={calendlyUrl}
      closingCtaHeading={page.closingCtaHeading}
      closingCtaBody={page.closingCtaBody}
      closingCtaPrimaryLabel={page.closingCtaPrimaryLabel}
      closingCtaSecondaryLabel={page.closingCtaSecondaryLabel}
      closingCtaSecondaryUrl={page.closingCtaSecondaryUrl}
      croSections={page.croSections}
      leadershipNote={page.leadershipNote}
      leadershipSignatureName={page.leadershipSignatureName}
      leadershipSignatureTitle={page.leadershipSignatureTitle}
      siteSettings={siteSettings}
    />
  )
}
