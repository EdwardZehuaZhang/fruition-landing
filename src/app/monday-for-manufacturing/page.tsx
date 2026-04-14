import {
  getIndustryPageBySlug,
  getSiteSettings,
  getCaseStudies,
} from "@/sanity/queries"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-manufacturing")
  return {
    title: page?.seoTitle || "monday.com for Manufacturing | Fruition Services",
    description:
      page?.seoDescription ||
      "Streamline manufacturing operations with monday.com. Production tracking, quality control and more.",
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies] = await Promise.all([
    getIndustryPageBySlug("monday-for-manufacturing"),
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
