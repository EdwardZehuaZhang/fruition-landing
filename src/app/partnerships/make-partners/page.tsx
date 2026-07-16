import { getSiteSettings, getCaseStudies, getMakePartnersPage } from "@/sanity/queries"
import MakePartnersContent from "./MakePartnersContent"
import { buildOgMetadata } from "@/lib/metadata"

export async function generateMetadata() {
  const page = await getMakePartnersPage()
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/partnerships/make-partners" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/partnerships/make-partners",
    }),
  }
}

export default async function MakePartnersPage() {
  const [siteSettings, caseStudies, pageData] = await Promise.all([
    getSiteSettings(),
    getCaseStudies(),
    getMakePartnersPage(),
  ])
  return (
    <MakePartnersContent
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
      pageData={pageData}
    />
  )
}
