import { getServicePageBySlug } from "@/sanity/queries"
import ServicePageTemplate from "@/components/ServicePageTemplate"

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
    <ServicePageTemplate
      heroHeading={page?.heroHeading || "Get your team official monday.com workflow training"}
      heroSubheading={page?.heroSubheading || "Expert Workflow Training delivered by a certified monday partner.\nOur training and adoption programs helps you onboard and adopt monday.com up to 10x faster."}
      heroPurpleAccent="workflow training"
      primaryCtaLabel={page?.primaryCtaLabel || "🚀 Book a Consultation"}
      primaryCtaUrl={page?.primaryCtaUrl || "https://calendly.com/global-calendar-fruitionservices"}
      secondaryCtaLabel={page?.secondaryCtaLabel}
      secondaryCtaUrl={page?.secondaryCtaUrl}
    />
  )
}
