import { getPartnershipPageBySlug } from "@/sanity/queries"
import HeroSection from "@/components/HeroSection"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

const PARTNERSHIP_SLUGS = [
  "monday-consulting-partner","make-partners","n8n-integration-partner","certified-clickup-partner",
  "certified-guidde-partner","certified-hubspot-partner","hootsuite-delivery-partner",
  "aircall-partner","certified-atlassian-partner","consultants",
]

export default async function PartnershipPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPartnershipPageBySlug(slug)

  return (
    <div>
      <HeroSection
        heading={page?.heroHeading || page?.title || slug.replace(/-/g, " ")}
        subheading={page?.heroSubheading || "Certified partner services by Fruition."}
        heroImage={page?.heroImage}
        primaryCta={{ label: page?.primaryCtaLabel || "Book a Consultation", url: page?.primaryCtaUrl || "https://calendly.com/global-calendar-fruitionservices" }}
      />
      {page?.body && (
        <div className="max-w-4xl mx-auto px-4 py-16 prose prose-lg">
          <PortableText value={page.body} components={portableTextComponents} />
        </div>
      )}
    </div>
  )
}

export async function generateStaticParams() {
  return PARTNERSHIP_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPartnershipPageBySlug(slug)
  return { title: page?.seoTitle || page?.title || slug, description: page?.seoDescription }
}