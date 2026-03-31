import { getServicePageBySlug } from "@/sanity/queries"
import HeroSection from "@/components/HeroSection"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

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
    <div>
      <HeroSection
        heading={page?.heroHeading || "monday.com Training"}
        subheading={page?.heroSubheading || "Certified training for your entire team."}
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