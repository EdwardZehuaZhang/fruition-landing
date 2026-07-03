import {
  getSolutionPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import SolarCrmSolutionContent from "./SolarCrmSolutionContent"

const SLUG = "solar-crm-solution"

export async function generateMetadata() {
  const page = await getSolutionPageBySlug(SLUG)
  return {
    alternates: { canonical: "/monday-consulting-solutions/solar-crm-solution" },
    title: page?.seoTitle || page?.title || SLUG,
    description: page?.seoDescription,
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getSolutionPageBySlug(SLUG),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage(`monday-consulting-solutions/${SLUG}`),
  ])
  return (
    <SolarCrmSolutionContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
    />
  )
}
