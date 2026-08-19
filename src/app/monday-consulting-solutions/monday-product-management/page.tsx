import {
  getSolutionPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsForPage } from "@/sanity/groupFaqs"
import MondayProductManagementContent from "./MondayProductManagementContent"
import { buildOgMetadata } from "@/lib/metadata"

export async function generateMetadata() {
  const page = await getSolutionPageBySlug("monday-product-management")
  const title = page?.seoTitle ||
      page?.title ||
      "monday.com for Product Management"
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-consulting-solutions/monday-product-management" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-consulting-solutions/monday-product-management",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getSolutionPageBySlug("monday-product-management"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage(
      "monday-consulting-solutions/monday-product-management",
    ),
  ])
  return (
    <MondayProductManagementContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsForPage(centralFaqs, "monday-consulting-solutions/monday-product-management")}
    />
  )
}
