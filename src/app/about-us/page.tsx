import {
  getPageBySlug,
  getSiteSettings,
  getCaseStudies,
} from "@/sanity/queries"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"

export async function generateMetadata() {
  const page = await getPageBySlug("about-us")
  return {
    title: page?.seoTitle || "About Us | Fruition Services",
    description:
      page?.seoDescription ||
      "Fruition is a Platinum monday.com consulting partner with 500+ implementations across Australia, UK and US.",
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies] = await Promise.all([
    getPageBySlug("about-us"),
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
