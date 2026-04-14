import {
  getIndustryPageBySlug,
  getSiteSettings,
  getCaseStudies,
} from "@/sanity/queries"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-real-estate")
  return {
    title: page?.seoTitle || "monday.com for Real Estate | Fruition Services",
    description:
      page?.seoDescription ||
      "monday.com solutions for real estate companies. Manage listings, deals and client relationships.",
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies] = await Promise.all([
    getIndustryPageBySlug("monday-for-real-estate"),
    getSiteSettings(),
    getCaseStudies(),
  ])
  return (
    <UniversalPageTemplate
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
    />
  )
}
