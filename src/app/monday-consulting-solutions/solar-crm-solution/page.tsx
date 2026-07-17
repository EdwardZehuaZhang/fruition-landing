import {
  getSolutionPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import SolarCrmSolutionContent from "./SolarCrmSolutionContent"
import { buildOgMetadata } from "@/lib/metadata"

const SLUG = "solar-crm-solution"

export async function generateMetadata() {
  const page = await getSolutionPageBySlug(SLUG)
  const title = page?.seoTitle || page?.title || SLUG
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-consulting-solutions/solar-crm-solution" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-consulting-solutions/solar-crm-solution",
    }),
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
