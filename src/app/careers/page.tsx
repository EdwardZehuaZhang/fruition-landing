import {
  getPageBySlug,
  getSiteSettings,
  getCaseStudies,
} from "@/sanity/queries"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"

export async function generateMetadata() {
  const page = await getPageBySlug("careers")
  return {
    title: page?.seoTitle || "Careers | Fruition Services",
    description:
      page?.seoDescription ||
      "Join the Fruition team. We are looking for talented people to help businesses transform the way they work.",
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies] = await Promise.all([
    getPageBySlug("careers"),
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
