import {
  getServicePageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"

export async function generateMetadata() {
  const page = await getServicePageBySlug("ai-strategy-and-execution")
  return {
    title: page?.seoTitle || "AI Strategy & Execution | Fruition Services",
    description:
      page?.seoDescription ||
      "Leverage AI and automation to transform your business operations with Fruition's expert consultants.",
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
    <UniversalPageTemplate
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
    />
  )
}
