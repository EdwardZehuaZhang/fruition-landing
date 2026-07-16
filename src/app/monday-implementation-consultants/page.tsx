import {
  getMondayImplementationConsultantsPage,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import MondayImplementationConsultantsContent from "./MondayImplementationConsultantsContent"
import { buildOgMetadata } from "@/lib/metadata"

export async function generateMetadata() {
  const data = await getMondayImplementationConsultantsPage()
  const title = data?.seoTitle
  const description = data?.seoDescription
  return {
    alternates: { canonical: "/monday-implementation-consultants" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-implementation-consultants",
    }),
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
