import {
  getServicePageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"

export async function generateMetadata() {
  const page = await getServicePageBySlug("monday-crm-consulting")
  return {
    title: page?.seoTitle || "monday CRM Consulting | Fruition Services",
    description:
      page?.seoDescription ||
      "Expert monday CRM consulting and implementation. Build a CRM tailored to your business in 2-3 weeks.",
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
    <UniversalPageTemplate
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
    />
  )
}
