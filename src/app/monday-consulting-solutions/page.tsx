import Link from "next/link"
import HeroSection from "@/components/HeroSection"
import { getAllSolutionPages, getPageBySlug } from "@/sanity/queries"

export async function generateMetadata() {
  const page = await getPageBySlug("monday-consulting-solutions")
  return {
    title: page?.seoTitle || "monday.com Solutions | Fruition Services",
    description: page?.seoDescription || "Purpose-built monday.com solutions for every team. Project management, CRM, HR, Finance and more.",
  }
}

export default async function SolutionsPage() {
  const [solutions, page] = await Promise.all([
    getAllSolutionPages(),
    getPageBySlug("monday-consulting-solutions"),
  ])

  const heading = page?.heroHeading || "monday.com Solutions"
  const subheading = page?.heroSubheading || "Purpose-built solutions for every team. Powered by monday.com, configured by Fruition."
  const ctaLabel = page?.primaryCtaLabel || "Book a Consultation"
  const ctaUrl = page?.primaryCtaUrl || "https://calendly.com/global-calendar-fruitionservices"

  return (
    <div>
      <HeroSection
        heading={heading}
        subheading={subheading}
        primaryCta={{ label: ctaLabel, url: ctaUrl }}
      />
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((s: { slug: string; title: string; heroSubheading?: string }) => (
          <Link
            key={s.slug}
            href={`/monday-consulting-solutions/${s.slug}`}
            className="p-6 border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{s.title}</h3>
            {s.heroSubheading && <p className="text-gray-600 text-sm">{s.heroSubheading}</p>}
          </Link>
        ))}
      </div>
    </div>
  )
}
