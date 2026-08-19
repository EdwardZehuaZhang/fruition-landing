import {
  getSolutionPageBySlug,
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
    return urlFor(img).width(800).auto("format").url()
  } catch {
    return undefined
  }
}

import SolarCrmSolutionContent from "./SolarCrmSolutionContent"
import { buildOgMetadata } from "@/lib/metadata"

const SLUG = "solar-crm-solution"

export async function generateMetadata() {
  const page = await getSolutionPageBySlug(SLUG)
  const title = page?.seoTitle || page?.title || SLUG
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-consulting-solutions/solar-crm-solution" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-consulting-solutions/solar-crm-solution",
    }),
  }
}

export default async function Page() {
  const [page, siteSettings, caseStudies, centralFaqs, centralTestimonials] = await Promise.all([
    getSolutionPageBySlug(SLUG),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage(`monday-consulting-solutions/${SLUG}`),
    getCaseStudiesForPage("monday-consulting-solutions/solar-crm-solution"),
  ])

  // Central testimonial store wins; the page-doc array stays as fallback.
  if (page && centralTestimonials?.length) {
    page.solarTestimonials = centralTestimonials.map((t: any) => ({ quote: t.quote, name: t.clientName, role: t.clientRole, company: t.clientCompany, photo: safePhotoUrl(t.profilePhoto) }))
  }
  return (
    <SolarCrmSolutionContent
      page={page}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={resolveFaqTabs(page?.faqTabs, centralFaqs)}
    />
  )
}
