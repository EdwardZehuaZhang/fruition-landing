import { getIndustryPageBySlug } from "@/sanity/queries"
import HeroSection from "@/components/HeroSection"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

export async function generateMetadata() {
  const page = await getIndustryPageBySlug("monday-for-manufacturing")
  return {
    title: page?.seoTitle || "monday.com for Manufacturing | Fruition Services",
    description: page?.seoDescription || "Streamline manufacturing operations with monday.com. Production tracking, quality control and more.",
  }
}

export default async function Page() {
  const page = await getIndustryPageBySlug("monday-for-manufacturing")
  return (
    <div>
      <HeroSection
        heading={page?.heroHeading || "monday.com for Manufacturing"}
        subheading={page?.heroSubheading || "monday.com solutions for manufacturing teams."}
        heroImage={page?.heroImage}
        primaryCta={{ label: "Book a Consultation", url: "https://calendly.com/global-calendar-fruitionservices" }}
      />
      {page?.body && (
        <div className="max-w-4xl mx-auto px-4 py-16 prose prose-lg">
          <PortableText value={page.body} components={portableTextComponents} />
        </div>
      )}
    </div>
  )
}