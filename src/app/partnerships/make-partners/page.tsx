import { getSiteSettings, getCaseStudies, getMakePartnersPage } from "@/sanity/queries"
import MakePartnersContent from "./MakePartnersContent"

export async function generateMetadata() {
  const page = await getMakePartnersPage()
  return {
    title: page?.seoTitle,
    description: page?.seoDescription,
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
