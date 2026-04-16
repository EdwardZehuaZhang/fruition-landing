import {
  getSiteSettings,
  getCaseStudies,
} from "@/sanity/queries"
import MakePartnersContent from "./MakePartnersContent"

export const metadata = {
  title: "Make.com Gold Partner | Workflow Automation Experts | Fruition",
  description:
    "As a certified Make.com Gold Partner, Fruition delivers enterprise-grade workflow automations that connect your systems and scale with your business.",
}

export default async function MakePartnersPage() {
  const [siteSettings, caseStudies] = await Promise.all([
    getSiteSettings(),
    getCaseStudies(),
  ])
  return (
    <MakePartnersContent
      siteSettings={siteSettings}
      caseStudies={caseStudies || []}
    />
  )
}
