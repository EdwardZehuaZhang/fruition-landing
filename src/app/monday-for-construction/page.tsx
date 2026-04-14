import {
  getIndustryPageBySlug,
  getSiteSettings,
  getCaseStudies,
} from "@/sanity/queries"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-construction")
  return {
    title:
      page?.seoTitle || "monday.com for Construction | Fruition Services",
    description:
      page?.seoDescription ||
      "monday.com implementation for construction companies. Manage projects, sites and subcontractors.",
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies] = await Promise.all([
    getIndustryPageBySlug("monday-for-construction"),
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
