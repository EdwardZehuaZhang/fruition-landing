import {
  getMondayImplementationConsultantsPage,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import MondayImplementationConsultantsContent from "./MondayImplementationConsultantsContent"

export async function generateMetadata() {
  const data = await getMondayImplementationConsultantsPage()
  return {
    title:
      data?.seoTitle ||
      "monday.com Implementation Consultants | Fruition Services",
    description:
      data?.seoDescription ||
      "Certified monday.com implementation consultants helping 500+ businesses streamline their workflows.",
  }
}

export default async function Page() {
  const [data, settings, caseStudies, centralFaqs] = await Promise.all([
    getMondayImplementationConsultantsPage(),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-implementation-consultants"),
  ])

  return (
    <MondayImplementationConsultantsContent
      data={data}
      carouselLogos={settings?.carouselLogos || []}
      caseStudies={caseStudies || []}
      siteSettings={settings}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
    />
  )
}
