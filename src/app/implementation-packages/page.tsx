import {
  getImplementationPackagesPage,
  getSiteSettings,
  getCaseStudies,
} from "@/sanity/queries"
import ImplementationPackagesContent from "./ImplementationPackagesContent"

export async function generateMetadata() {
  const data = await getImplementationPackagesPage()
  return {
    title: data?.seoTitle || "Implementation Packages | Fruition Services",
    description:
      data?.seoDescription ||
      "Structured monday.com implementation packages to get your team running fast. Certified Fruition consultants.",
  }
}

export default async function Page() {
  const [data, settings, caseStudies] = await Promise.all([
    getImplementationPackagesPage(),
    getSiteSettings(),
    getCaseStudies(),
  ])
  return (
    <ImplementationPackagesContent
      data={data}
      carouselLogos={settings?.carouselLogos || []}
      caseStudies={caseStudies || []}
    />
  )
}
