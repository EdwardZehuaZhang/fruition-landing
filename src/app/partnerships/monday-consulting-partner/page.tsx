import {
  getPartnershipPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
  getCaseStudiesForPage,
} from "@/sanity/queries"
import { resolveFaqTabs } from "@/sanity/groupFaqs"
import { urlFor } from "@/sanity/image"

/* Legacy Wix imports can carry malformed asset refs — never let urlFor throw. */
function safePhotoUrl(img: unknown): string | undefined {
  try {
    // @ts-expect-error loose Sanity image shape
    if (!img?.asset?._ref) return undefined
    return urlFor(img).url()
  } catch {
    return undefined
  }
}

import MondayConsultingPartnerContent from "./MondayConsultingPartnerContent"
import { buildOgMetadata } from "@/lib/metadata"

const SLUG = "monday-consulting-partner"

export async function generateMetadata() {
  const page = await getPartnershipPageBySlug(SLUG)
  const title = page?.seoTitle || page?.title || SLUG
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/partnerships/monday-consulting-partner" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/partnerships/monday-consulting-partner",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs, centralTestimonials] = await Promise.all([
    getPartnershipPageBySlug(SLUG),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage(`partnerships/${SLUG}`),
    getCaseStudiesForPage("partnerships/monday-consulting-partner"),
  ])

  // Central testimonial store wins; the page-doc array stays as fallback.
  if (page && centralTestimonials?.length) {
    page.partnerTestimonials = centralTestimonials.map((t: any) => ({ name: t.clientName, role: t.clientRole, quote: t.quote, photo: safePhotoUrl(t.profilePhoto) }))
  }
  return (
    <MondayConsultingPartnerContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={resolveFaqTabs(page?.faqTabs, centralFaqs)}
    />
  )
}
