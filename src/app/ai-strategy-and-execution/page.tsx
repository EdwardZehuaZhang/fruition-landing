import {
  getServicePageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsForPage } from "@/sanity/groupFaqs"
import AiStrategyContent from "./AiStrategyContent"
import { buildOgMetadata } from "@/lib/metadata"

export async function generateMetadata() {
  const page = await getServicePageBySlug("ai-strategy-and-execution")
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/ai-strategy-and-execution" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/ai-strategy-and-execution",
    }),
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
      faqTabs={groupFaqsForPage(centralFaqs, "ai-strategy-and-execution")}
    />
  )
}
