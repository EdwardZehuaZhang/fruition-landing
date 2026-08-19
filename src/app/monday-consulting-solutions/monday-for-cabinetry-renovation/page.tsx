import {
  getSolutionPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
  getCaseStudiesForPage,
} from "@/sanity/queries"
import { resolveFaqTabs } from "@/sanity/groupFaqs"
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
  const [page, siteSettings, caseStudies, centralFaqs, centralTestimonials] = await Promise.all([
    getSolutionPageBySlug("monday-for-cabinetry-renovation"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage(
      "monday-consulting-solutions/monday-for-cabinetry-renovation",
    ),
    getCaseStudiesForPage("monday-consulting-solutions/monday-for-cabinetry-renovation"),
  ])

  // Central testimonial store wins; the page-doc array stays as fallback.
  if (page && centralTestimonials?.length) {
    page.inlineTestimonials = centralTestimonials.map((t: any) => ({ quote: t.quote, name: t.clientName, role: t.clientRole, company: t.clientCompany, photo: t.profilePhoto }))
  }
  return (
    <MondayForCabinetryRenovationContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={resolveFaqTabs(page?.faqTabs, centralFaqs)}
    />
  )
}
