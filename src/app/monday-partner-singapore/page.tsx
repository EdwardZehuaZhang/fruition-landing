import { getLocationPageBySlug } from "@/sanity/queries"
import HeroSection from "@/components/HeroSection"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

export async function generateMetadata() {
  const page = await getLocationPageBySlug("monday-partner-singapore")
  return {
    title: page?.seoTitle || "monday.com Partner Singapore | Fruition Services",
    description: page?.seoDescription || "Certified monday.com consulting partner in Singapore. Expert implementation and support for local businesses.",
  }
}

export default async function Page() {
  const page = await getLocationPageBySlug("monday-partner-singapore")
  return (
    <div>
      <HeroSection
        heading={page?.heroHeading || "monday.com Consultants Singapore"}
        subheading={page?.heroSubheading || "Expert monday.com consulting and implementation in Singapore."}
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