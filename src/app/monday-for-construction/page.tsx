import {
  getIndustryPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
  getCaseStudiesForPage,
} from "@/sanity/queries"
import { groupFaqsIntoTabs } from "@/sanity/groupFaqs"
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

import MondayForConstructionContent from "./MondayForConstructionContent"
import { buildOgMetadata } from "@/lib/metadata"

const SLUG = "monday-for-construction"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug(SLUG)
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-for-construction" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-for-construction",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs, centralTestimonials] = await Promise.all([
    getIndustryPageBySlug(SLUG),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage(SLUG),
    getCaseStudiesForPage("monday-for-construction"),
  ])

  // Central testimonial store wins; the page-doc array stays as fallback.
  if (page && centralTestimonials?.length) {
    page.industryTestimonials = centralTestimonials.map((t: any) => ({ title: t.headline, quote: t.quote, name: t.clientName, role: t.clientRole, image: safePhotoUrl(t.profilePhoto) }))
  }
  return (
    <MondayForConstructionContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={groupFaqsIntoTabs(centralFaqs)}
    />
  )
}
