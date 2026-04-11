import { getLocationPageBySlug } from "@/sanity/queries"
import HeroSection from "@/components/HeroSection"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

export async function generateMetadata() {
  const page = await getLocationPageBySlug("monday-partner-us")
  return {
    title: page?.seoTitle || "monday.com Partner US | Fruition Services",
    description: page?.seoDescription || "Fruition is a certified monday.com partner in the United States. Expert consultants across New York and beyond.",
  }
}

export default async function Page() {
  const page = await getLocationPageBySlug("monday-partner-us")
  return (
    <div>
      <HeroSection
        heading={page?.heroHeading || ""}
        subheading={page?.heroSubheading}
        heroImage={page?.heroImage}
        primaryCta={{
          label: page?.primaryCtaLabel || "Book a Consultation",
          url: page?.primaryCtaUrl || "https://calendly.com/global-calendar-fruitionservices",
        }}
        secondaryCta={
          page?.secondaryCtaLabel && page?.secondaryCtaUrl
            ? { label: page.secondaryCtaLabel, url: page.secondaryCtaUrl }
            : undefined
        }
      />
      {page?.body && (
        <div className="max-w-4xl mx-auto px-4 py-16 prose prose-lg">
          <PortableText value={page.body} components={portableTextComponents} />
        </div>
      )}
    </div>
  )
}