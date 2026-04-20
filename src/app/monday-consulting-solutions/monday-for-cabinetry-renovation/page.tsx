import {
  getSolutionPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import MondayForCabinetryRenovationContent from "./MondayForCabinetryRenovationContent"

export async function generateMetadata() {
  const page = await getSolutionPageBySlug("monday-for-cabinetry-renovation")
  return {
    title:
      page?.seoTitle ||
      page?.title ||
      "monday.com for Cabinetry & Renovation",
    description: page?.seoDescription,
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getSolutionPageBySlug("monday-for-cabinetry-renovation"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage(
      "monday-consulting-solutions/monday-for-cabinetry-renovation",
    ),
  ])
  return (
    <MondayForCabinetryRenovationContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
    />
  )
}
