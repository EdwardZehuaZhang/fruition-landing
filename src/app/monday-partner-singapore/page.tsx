import {
  getLocationPageBySlug,
  getSiteSettings,
  getCaseStudies,
} from "@/sanity/queries"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"

export async function generateMetadata() {
  const page = await getLocationPageBySlug("monday-partner-singapore")
  return {
    title:
      page?.seoTitle || "monday.com Partner Singapore | Fruition Services",
    description:
      page?.seoDescription ||
      "Certified monday.com consulting partner in Singapore. Expert implementation and support for local businesses.",
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies] = await Promise.all([
    getLocationPageBySlug("monday-partner-singapore"),
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
