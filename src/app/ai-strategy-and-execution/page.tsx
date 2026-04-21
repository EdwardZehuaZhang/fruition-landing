import {
  getServicePageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import AiStrategyContent from "./AiStrategyContent"

export async function generateMetadata() {
  const page = await getServicePageBySlug("ai-strategy-and-execution")
  return {
    title: page?.seoTitle,
    description: page?.seoDescription,
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getServicePageBySlug("ai-strategy-and-execution"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("ai-strategy-and-execution"),
  ])
  return (
    <AiStrategyContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
    />
  )
}
