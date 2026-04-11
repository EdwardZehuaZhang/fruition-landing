import {
  getMondayTrainingPage,
  getSiteSettings,
  getCaseStudies,
} from "@/sanity/queries"
import MondayTrainingContent from "./MondayTrainingContent"

export async function generateMetadata() {
  const data = await getMondayTrainingPage()
  return {
    title: data?.seoTitle || "monday.com Training | Fruition Services",
    description:
      data?.seoDescription ||
      "Official monday.com training for your entire team. Get certified and confident on the platform.",
  }
}

export default async function Page() {
  const [data, settings, caseStudies] = await Promise.all([
    getMondayTrainingPage(),
    getSiteSettings(),
    getCaseStudies(),
  ])

  return (
    <MondayTrainingContent
      data={data}
      carouselLogos={settings?.carouselLogos || []}
      caseStudies={caseStudies || []}
    />
  )
}
