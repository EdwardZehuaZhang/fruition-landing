import {
  getLocationPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"

export async function generateMetadata() {
  const page = await getLocationPageBySlug("monday-partner-india")
  return {
    title: page?.seoTitle || "monday.com Partner India | Fruition Services",
    description:
      page?.seoDescription ||
      "Certified monday.com consulting partner in India. Expert implementation and training across major cities.",
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getLocationPageBySlug("monday-partner-india"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-partner-india"),
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
