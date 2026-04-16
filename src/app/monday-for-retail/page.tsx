import {
  getIndustryPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-retail")
  return {
    title: page?.seoTitle || "monday.com for Retail | Fruition Services",
    description:
      page?.seoDescription ||
      "monday.com for retail and eCommerce operations. Inventory, fulfilment and team coordination.",
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getIndustryPageBySlug("monday-for-retail"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-for-retail"),
  ])
  return (
    <div className="monday-for-retail-page">
      <UniversalPageTemplate
        page={page}
        siteSettings={siteSettings}
        caseStudies={caseStudies || []}
        faqTabs={groupFaqsIntoTabs(centralFaqs)}
      />
    </div>
  )
}
