import {
  getAllPartnershipPages,
  getPartnershipPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"

export async function generateStaticParams() {
  const pages = await getAllPartnershipPages()
  return pages.map((p: { slug: string }) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await getPartnershipPageBySlug(slug)
  return {
    title: page?.seoTitle || page?.title || slug,
    description: page?.seoDescription,
  }
}

export default async function PartnershipPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getPartnershipPageBySlug(slug),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage(`partnerships/${slug}`),
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
