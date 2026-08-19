import {
  getSolutionPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { resolveFaqTabs } from "@/sanity/groupFaqs"
import MondayProjectManagementContent from "./MondayProjectManagementContent"
import { buildOgMetadata } from "@/lib/metadata"

const SLUG = "monday-project-management"

export async function generateMetadata() {
  const page = await getSolutionPageBySlug(SLUG)
  const title = page?.seoTitle || page?.title || SLUG
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-consulting-solutions/monday-project-management" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-consulting-solutions/monday-project-management",
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
    <MondayProjectManagementContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={resolveFaqTabs(page?.faqTabs, centralFaqs)}
    />
  )
}
