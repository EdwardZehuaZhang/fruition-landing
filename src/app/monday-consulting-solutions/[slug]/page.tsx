import { getSolutionPageBySlug } from "@/sanity/queries"
import HeroSection from "@/components/HeroSection"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"
import { notFound } from "next/navigation"

const SOLUTION_SLUGS = [
  "monday-project-management","monday-service","monday-for-finance",
  "monday-product-management","monday-for-hr","solar-crm-solution","monday-for-cabinetry-renovation",
]

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getSolutionPageBySlug(slug)

  return (
    <div>
      <HeroSection
        heading={page?.heroHeading || page?.title || slug.replace(/-/g, " ")}
        subheading={page?.heroSubheading || "Expert monday.com consulting and implementation."}
        primaryCta={{ label: page?.primaryCtaLabel || "Book a Consultation", url: page?.primaryCtaUrl || "https://calendly.com/global-calendar-fruitionservices" }}
        secondaryCta={page?.secondaryCtaLabel ? { label: page.secondaryCtaLabel, url: page.secondaryCtaUrl || "#" } : undefined}
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
  return SOLUTION_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getSolutionPageBySlug(slug)
  return { title: page?.seoTitle || page?.title || slug, description: page?.seoDescription }
}