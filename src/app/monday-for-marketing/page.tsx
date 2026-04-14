import {
  getIndustryPageBySlug,
  getSiteSettings,
  getCaseStudies,
} from "@/sanity/queries"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-marketing")
  return {
    title:
      page?.seoTitle ||
      "monday.com for Marketing & Creative | Fruition Services",
    description:
      page?.seoDescription ||
      "monday.com for marketing and creative teams. Manage campaigns, assets and creative workflows.",
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies] = await Promise.all([
    getIndustryPageBySlug("monday-for-marketing"),
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
