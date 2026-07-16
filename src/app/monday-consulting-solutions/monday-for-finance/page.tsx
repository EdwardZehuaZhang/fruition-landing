import {
  getSolutionPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import MondayForFinanceContent from "./MondayForFinanceContent"
import { buildOgMetadata } from "@/lib/metadata"

export async function generateMetadata() {
  const page = await getSolutionPageBySlug("monday-for-finance")
  const title = page?.seoTitle || page?.title || "monday.com for Finance"
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-consulting-solutions/monday-for-finance" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-consulting-solutions/monday-for-finance",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getSolutionPageBySlug("monday-for-finance"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-consulting-solutions/monday-for-finance"),
  ])
  return (
    <MondayForFinanceContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
    />
  )
}
