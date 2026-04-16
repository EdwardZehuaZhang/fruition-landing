import { getSiteSettings, getCaseStudies, getMakePartnersPage } from "@/sanity/queries"
import MakePartnersContent from "./MakePartnersContent"

export async function generateMetadata() {
  const page = await getMakePartnersPage()
  return {
    title: page?.seoTitle ?? "Make.com Gold Partner | Workflow Automation Experts | Fruition",
    description:
      page?.seoDescription ??
      "As a certified Make.com Gold Partner, Fruition delivers enterprise-grade workflow automations that connect your systems and scale with your business.",
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
