import {
  getAllSolutionPages,
  getSolutionPageBySlug,
  getSiteSettings,
  getCaseStudies,
  getFaqItemsForPage,
} from "@/sanity/queries"
import { resolveFaqTabs } from "@/sanity/groupFaqs"
import UniversalPageTemplate from "@/components/UniversalPageTemplate"
import { buildOgMetadata } from "@/lib/metadata"

export async function generateStaticParams() {
  const pages = await getAllSolutionPages()
  return pages.map((p: { slug: string }) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await getSolutionPageBySlug(slug)
  const title = page?.seoTitle || page?.title || slug
  const description = page?.seoDescription
  return {
    alternates: { canonical: `/monday-consulting-solutions/${slug}` },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: `/monday-consulting-solutions/${slug}`,
    }),
  }
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [page, siteSettings, caseStudies, centralFaqs] = await Promise.all([
    getSolutionPageBySlug(slug),
    getSiteSettings(),
    getCaseStudies(),
    getFaqItemsForPage(`monday-consulting-solutions/${slug}`),
  ])
  // Per-slug overrides
  const slugsWithCalendlyTop = new Set(["solar-crm-solution"])
  const adjustedPage = page
    ? {
        ...page,
        calendlyPosition: slugsWithCalendlyTop.has(slug)
          ? "top"
          : page.calendlyPosition,
      }
    : page
  return (
    <UniversalPageTemplate
      page={adjustedPage}
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      faqTabs={resolveFaqTabs(page?.faqTabs, centralFaqs)}
    />
  )
}
