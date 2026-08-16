import {
  getIndustryPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { resolveFaqTabs } from "@/sanity/groupFaqs"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"
import { buildOgMetadata } from "@/lib/metadata"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-manufacturing")
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-for-manufacturing" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-for-manufacturing",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getIndustryPageBySlug("monday-for-manufacturing"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-for-manufacturing"),
  ])
  return (
    <UniversalPageTemplate
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={resolveFaqTabs(page?.faqTabs, centralFaqs)}
    />
  )
}
