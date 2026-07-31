import { getAiPartnerPageBySlug, getSiteSettings, getFaqItemsForPageStrict, getClosingCtaForPage } from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import AiPartnerTemplate from "@/components/AiPartnerTemplate"
import { buildOgMetadata } from "@/lib/metadata"

const SLUG = "ai-capability-assessment"

export async function generateMetadata() {
  const page = await getAiPartnerPageBySlug(SLUG)
  const title = page?.seoTitle || page?.title || SLUG
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/ai-capability-assessment" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/ai-capability-assessment",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, centralFaqs, closingCta] = await Promise.all([
    getAiPartnerPageBySlug(SLUG),
    getSiteSettings(),
    getFaqItemsForPageStrict("ai-capability-assessment"),
    getClosingCtaForPage("ai-capability-assessment"),
  ])
  return <AiPartnerTemplate page={page} siteSettings={siteSettings} faqTabs={groupFaqsIntoTabs(centralFaqs)} closingCta={closingCta} />
}
