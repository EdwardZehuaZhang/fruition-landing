import { getPageBySlug } from "@/sanity/queries"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"
import HeroSection from "@/components/HeroSection"

export async function generateMetadata() {
  const page = await getPageBySlug("about-us")
  return {
    title: page?.seoTitle || "About Us | Fruition Services",
    description: page?.seoDescription || "Fruition is a Platinum monday.com consulting partner with 500+ implementations across Australia, UK and US.",
  }
}

export default async function AboutPage() {
  const page = await getPageBySlug("about-us")
  return (
    <div>
      <HeroSection
        heading={page?.heroHeading || "About Fruition"}
        subheading={page?.heroSubheading || "500+ clients globally trust Fruition for monday.com implementation, consulting, and training."}
        heroImage={page?.heroImage}
        primaryCta={{
          label: page?.primaryCtaLabel || "Book a Consultation",
          url: page?.primaryCtaUrl || "https://calendly.com/global-calendar-fruitionservices",
        }}
      />
      {page?.body && (
        <div className="max-w-4xl mx-auto px-4 py-16 prose prose-lg">
          <PortableText value={page.body} components={portableTextComponents} />
        </div>
      )}
    </div>
  )
}
