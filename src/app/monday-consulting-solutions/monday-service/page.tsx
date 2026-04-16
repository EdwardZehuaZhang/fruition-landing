import {
  getSolutionPageBySlug,
  getSiteSettings,
  getCaseStudies,
} from "@/sanity/queries"
import MondayServicePage from "./MondayServicePage"

export async function generateMetadata() {
  const page = await getSolutionPageBySlug("monday-service")
  return {
    title: page?.seoTitle || page?.title || "monday Service",
    description: page?.seoDescription,
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies] = await Promise.all([
    getSolutionPageBySlug("monday-service"),
    getSiteSettings(),
    getCaseStudies(),
  ])
  return (
    <MondayServicePage
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
    />
  )
}
