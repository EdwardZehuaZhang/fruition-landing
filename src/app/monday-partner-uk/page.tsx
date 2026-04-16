import {
  getLocationPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"

export async function generateMetadata() {
  const page = await getLocationPageBySlug("monday-partner-uk")
  return {
    title: page?.seoTitle || "monday.com Partner UK | Fruition Services",
    description:
      page?.seoDescription ||
      "Fruition is a certified monday.com partner in the UK. Expert consultants across London and the United Kingdom.",
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getLocationPageBySlug("monday-partner-uk"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-partner-uk"),
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
