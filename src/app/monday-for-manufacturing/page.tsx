import {
  getIndustryPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-manufacturing")
  return {
    title: page?.seoTitle || "monday.com for Manufacturing | Fruition Services",
    description:
      page?.seoDescription ||
      "Streamline manufacturing operations with monday.com. Production tracking, quality control and more.",
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getIndustryPageBySlug("monday-for-manufacturing"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-for-manufacturing"),
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
