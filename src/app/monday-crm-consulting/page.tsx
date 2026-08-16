import {
  getServicePageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { resolveFaqTabs } from "@/sanity/groupFaqs"
import MondayCrmConsultingContent from "./MondayCrmConsultingContent"
import { buildOgMetadata } from "@/lib/metadata"

export async function generateMetadata() {
  const page = await getServicePageBySlug("monday-crm-consulting")
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-crm-consulting" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-crm-consulting",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getServicePageBySlug("monday-crm-consulting"),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage("monday-crm-consulting"),
  ])
  return (
    <MondayCrmConsultingContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={resolveFaqTabs(page?.faqTabs, centralFaqs)}
    />
  )
}
