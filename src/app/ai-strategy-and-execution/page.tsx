import { getServicePageBySlug } from "@/sanity/queries"
import HeroSection from "@/components/HeroSection"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

export async function generateMetadata() {
  const page = await getServicePageBySlug("ai-strategy-and-execution")
  return {
    title: page?.seoTitle || "AI Strategy & Execution | Fruition Services",
    description: page?.seoDescription || "Leverage AI and automation to transform your business operations with Fruition's expert consultants.",
  }
}

export default async function Page() {
  const page = await getServicePageBySlug("ai-strategy-and-execution")
  return (
    <div>
      <HeroSection
        heading={page?.heroHeading || "AI Strategy & Execution"}
        subheading={page?.heroSubheading || "Leverage AI to transform your business operations."}
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