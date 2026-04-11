import { getIndustryPageBySlug } from "@/sanity/queries"
import HeroSection from "@/components/HeroSection"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-marketing")
  return {
    title: page?.seoTitle || "monday.com for Marketing & Creative | Fruition Services",
    description: page?.seoDescription || "monday.com for marketing and creative teams. Manage campaigns, assets and creative workflows.",
  }
}

export default async function Page() {
  const page = await getIndustryPageBySlug("monday-for-marketing")
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