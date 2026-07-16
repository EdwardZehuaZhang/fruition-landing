import {
  getIndustryPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"
import { buildOgMetadata } from "@/lib/metadata"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-retail")
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-for-retail" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-for-retail",
    }),
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
    <UniversalPageTemplate
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsIntoTabs(centralFaqs, "Retail")}
    />
  )
}
