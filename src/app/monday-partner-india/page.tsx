import {
  getLocationPageBySlug,
  getSiteSettings,
  getCaseStudies,
} from "@/sanity/queries"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"

export async function generateMetadata() {
  const page = await getLocationPageBySlug("monday-partner-india")
  return {
    title: page?.seoTitle || "monday.com Partner India | Fruition Services",
    description:
      page?.seoDescription ||
      "Certified monday.com consulting partner in India. Expert implementation and training across major cities.",
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies] = await Promise.all([
    getLocationPageBySlug("monday-partner-india"),
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
