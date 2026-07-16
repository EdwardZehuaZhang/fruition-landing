import {
  getSolutionPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import MondayForCabinetryRenovationContent from "./MondayForCabinetryRenovationContent"
import { buildOgMetadata } from "@/lib/metadata"

export async function generateMetadata() {
  const page = await getSolutionPageBySlug("monday-for-cabinetry-renovation")
  const title = page?.seoTitle ||
      page?.title ||
      "monday.com for Cabinetry & Renovation"
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-consulting-solutions/monday-for-cabinetry-renovation" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-consulting-solutions/monday-for-cabinetry-renovation",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getSolutionPageBySlug("monday-for-cabinetry-renovation"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage(
      "monday-consulting-solutions/monday-for-cabinetry-renovation",
    ),
  ])
  return (
    <MondayForCabinetryRenovationContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
    />
  )
}
