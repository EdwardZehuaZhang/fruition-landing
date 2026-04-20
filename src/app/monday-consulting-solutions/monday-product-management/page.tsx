import {
  getSolutionPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import MondayProductManagementContent from "./MondayProductManagementContent"

export async function generateMetadata() {
  const page = await getSolutionPageBySlug("monday-product-management")
  return {
    title:
      page?.seoTitle ||
      page?.title ||
      "monday.com for Product Management",
    description: page?.seoDescription,
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getSolutionPageBySlug("monday-product-management"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage(
      "monday-consulting-solutions/monday-product-management",
    ),
  ])
  return (
    <MondayProductManagementContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
    />
  )
}
