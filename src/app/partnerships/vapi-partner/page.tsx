import { getAiPartnerPageBySlug, getSiteSettings, getFaqItemsForPageStrict, getClosingCtaForPage } from "@/sanity/queries"
import { resolveFaqTabs } from "@/sanity/groupFaqs"
import AiPartnerTemplate from "@/components/AiPartnerTemplate"
import { buildOgMetadata } from "@/lib/metadata"

const SLUG = "vapi-partner"

export async function generateMetadata() {
  const page = await getAiPartnerPageBySlug(SLUG)
  const title = page?.seoTitle || page?.title || SLUG
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/partnerships/vapi-partner" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/partnerships/vapi-partner",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, centralFaqs, closingCta] = await Promise.all([
    getAiPartnerPageBySlug(SLUG),
    getSiteSettings(),
    getFaqItemsForPageStrict("partnerships/vapi-partner"),
    getClosingCtaForPage("partnerships/vapi-partner"),
  ])
  return <AiPartnerTemplate page={page} siteSettings={siteSettings} faqTabs={resolveFaqTabs(page?.faqTabs, centralFaqs)} closingCta={closingCta} />
}
