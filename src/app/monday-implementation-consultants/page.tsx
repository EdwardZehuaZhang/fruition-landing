import {
  getMondayImplementationConsultantsPage,
  getSiteSettings,
  getCaseStudies,
} from "@/sanity/queries"
import MondayImplementationConsultantsContent from "./MondayImplementationConsultantsContent"

export async function generateMetadata() {
  const data = await getMondayImplementationConsultantsPage()
  return {
    title:
      data?.seoTitle ||
      "monday.com Implementation Consultants | Fruition Services",
    description:
      data?.seoDescription ||
      "Certified monday.com implementation consultants helping 500+ businesses streamline their workflows.",
  }
}

export default async function Page() {
  const [data, settings, caseStudies] = await Promise.all([
    getMondayImplementationConsultantsPage(),
    getSiteSettings(),
    getCaseStudies(),
  ])

  return (
    <MondayImplementationConsultantsContent
      data={data}
      carouselLogos={settings?.carouselLogos || []}
      caseStudies={caseStudies || []}
      siteSettings={settings}
    />
  )
}
