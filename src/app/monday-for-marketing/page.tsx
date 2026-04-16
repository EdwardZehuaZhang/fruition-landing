import {
  getIndustryPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-marketing")
  return {
    title:
      page?.seoTitle ||
      "monday.com for Marketing & Creative | Fruition Services",
    description:
      page?.seoDescription ||
      "monday.com for marketing and creative teams. Manage campaigns, assets and creative workflows.",
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getIndustryPageBySlug("monday-for-marketing"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-for-marketing"),
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
