import {
  getSolutionPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import MondayProjectManagementContent from "./MondayProjectManagementContent"

const SLUG = "monday-project-management"

export async function generateMetadata() {
  const page = await getSolutionPageBySlug(SLUG)
  return {
    title: page?.seoTitle || page?.title || SLUG,
    description: page?.seoDescription,
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getSolutionPageBySlug(SLUG),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage(`monday-consulting-solutions/${SLUG}`),
  ])
  return (
    <MondayProjectManagementContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
    />
  )
}
