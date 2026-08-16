import {
  getPartnershipPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { resolveFaqTabs } from "@/sanity/groupFaqs"
import CertifiedClickupPartnerContent from "./CertifiedClickupPartnerContent"
import { buildOgMetadata } from "@/lib/metadata"

const SLUG = "certified-clickup-partner"

export async function generateMetadata() {
  const page = await getPartnershipPageBySlug(SLUG)
  const title = page?.seoTitle || page?.title || SLUG
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/partnerships/certified-clickup-partner" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/partnerships/certified-clickup-partner",
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
    <CertifiedClickupPartnerContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={resolveFaqTabs(page?.faqTabs, centralFaqs)}
    />
  )
}
