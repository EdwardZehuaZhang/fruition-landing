import {
  getLocationPageBySlug,
  getSiteSettings,
  getCaseStudies,
} from "@/sanity/queries"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"

export async function generateMetadata() {
  const page = await getLocationPageBySlug("monday-partner-us")
  return {
    title: page?.seoTitle || "monday.com Partner US | Fruition Services",
    description:
      page?.seoDescription ||
      "Fruition is a certified monday.com partner in the United States. Expert consultants across New York and beyond.",
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies] = await Promise.all([
    getLocationPageBySlug("monday-partner-us"),
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
