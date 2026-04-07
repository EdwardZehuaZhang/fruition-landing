import { getServicePageBySlug } from "@/sanity/queries"
import MondayTrainingContent from "./MondayTrainingContent"

export async function generateMetadata() {
  const page = await getServicePageBySlug("monday-training")
  return {
    title: page?.seoTitle || "monday.com Training | Fruition Services",
    description: page?.seoDescription || "Official monday.com training for your entire team. Get certified and confident on the platform.",
  }
}

export default async function Page() {
  const page = await getServicePageBySlug("monday-training")
  return (
    <MondayTrainingContent
      heroHeading={page?.heroHeading}
      heroSubheading={page?.heroSubheading}
      primaryCtaLabel={page?.primaryCtaLabel}
      primaryCtaUrl={page?.primaryCtaUrl}
      secondaryCtaLabel={page?.secondaryCtaLabel}
      secondaryCtaUrl={page?.secondaryCtaUrl}
    />
  )
}
