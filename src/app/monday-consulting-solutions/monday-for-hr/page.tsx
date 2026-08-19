import {
  getSolutionPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsForPage } from "@/sanity/groupFaqs"
import MondayForHrContent from "./MondayForHrContent"
import { buildOgMetadata } from "@/lib/metadata"

const SLUG = "monday-for-hr"

export async function generateMetadata() {
  const page = await getSolutionPageBySlug(SLUG)
  const title = page?.seoTitle || page?.title || SLUG
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-consulting-solutions/monday-for-hr" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-consulting-solutions/monday-for-hr",
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
    <MondayForHrContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsForPage(centralFaqs, `monday-consulting-solutions/${SLUG}`)}
    />
  )
}
