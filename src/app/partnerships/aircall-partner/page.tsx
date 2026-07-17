import {
  getPartnershipPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import AircallPartnerContent from "./AircallPartnerContent"
import { buildOgMetadata } from "@/lib/metadata"

const SLUG = "aircall-partner"

export async function generateMetadata() {
  const page = await getPartnershipPageBySlug(SLUG)
  const title = page?.seoTitle || page?.title || SLUG
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/partnerships/aircall-partner" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/partnerships/aircall-partner",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getPartnershipPageBySlug(SLUG),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage(`partnerships/${SLUG}`),
  ])
  return (
    <AircallPartnerContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
    />
  )
}
