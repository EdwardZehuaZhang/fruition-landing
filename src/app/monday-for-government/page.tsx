import {
  getIndustryPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { resolveFaqTabs } from "@/sanity/groupFaqs"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"
import { buildOgMetadata } from "@/lib/metadata"
import { getIndustryLogos } from "@/sanity/industryLogos"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-government")
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-for-government" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-for-government",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs, industryLogos] = await Promise.all([
    getIndustryPageBySlug("monday-for-government"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-for-government"),
    getIndustryLogos("government"),
  ])
  return (
    <UniversalPageTemplate
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      industryLogos={industryLogos}
      faqTabs={resolveFaqTabs(page?.faqTabs, centralFaqs)}
    />
  )
}
