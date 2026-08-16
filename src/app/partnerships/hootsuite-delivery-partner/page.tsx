import {
  getPartnershipPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { resolveFaqTabs } from "@/sanity/groupFaqs"
import HootsuiteDeliveryPartnerContent from "./HootsuiteDeliveryPartnerContent"
import { buildOgMetadata } from "@/lib/metadata"

const SLUG = "hootsuite-delivery-partner"

export async function generateMetadata() {
  const page = await getPartnershipPageBySlug(SLUG)
  const title = page?.seoTitle || page?.title || SLUG
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/partnerships/hootsuite-delivery-partner" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/partnerships/hootsuite-delivery-partner",
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
    <HootsuiteDeliveryPartnerContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={resolveFaqTabs(page?.faqTabs, centralFaqs)}
    />
  )
}
