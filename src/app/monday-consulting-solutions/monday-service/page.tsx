import {
  getSolutionPageBySlug,
  getSiteSettings,
} from "@/sanity/queries"
import MondayServicePage from "./MondayServicePage"
import { buildOgMetadata } from "@/lib/metadata"

export async function generateMetadata() {
  const page = await getSolutionPageBySlug("monday-service")
  const title = page?.seoTitle || page?.title || "monday Service"
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-consulting-solutions/monday-service" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-consulting-solutions/monday-service",
    }),
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
