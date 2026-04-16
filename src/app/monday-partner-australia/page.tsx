import {
  getLocationPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"

export async function generateMetadata() {
  const page = await getLocationPageBySlug("monday-partner-australia")
  return {
    title: page?.seoTitle || "monday.com Partner Australia | Fruition Services",
    description:
      page?.seoDescription ||
      "Fruition is a Platinum monday.com partner in Australia. Expert consultants across Sydney, Melbourne, Brisbane, Adelaide and Perth.",
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getLocationPageBySlug("monday-partner-australia"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-partner-australia"),
  ])
  return (
    <UniversalPageTemplate
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
    />
  )
}
