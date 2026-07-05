import {
  getSolutionPageBySlug,
  getSiteSettings,
} from "@/sanity/queries"
import MondayServicePage from "./MondayServicePage"

export async function generateMetadata() {
  const page = await getSolutionPageBySlug("monday-service")
  return {
    alternates: { canonical: "/monday-consulting-solutions/monday-service" },
    title: page?.seoTitle || page?.title || "monday Service",
    description: page?.seoDescription,
  }
}

export default async function Page() {
  const [page, siteSettings] = await Promise.all([
    getSolutionPageBySlug("monday-service"),
    getSiteSettings(),
  ])
  return (
    <MondayServicePage
      page={page}
      siteSettings={siteSettings}
    />
  )
}
