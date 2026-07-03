import {
  getServicePageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import MondayCrmConsultingContent from "./MondayCrmConsultingContent"

export async function generateMetadata() {
  const page = await getServicePageBySlug("monday-crm-consulting")
  return {
    alternates: { canonical: "/monday-crm-consulting" },
    title: page?.seoTitle,
    description: page?.seoDescription,
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getServicePageBySlug("monday-crm-consulting"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-crm-consulting"),
  ])
  return (
    <MondayCrmConsultingContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
    />
  )
}
