import Link from "next/link"
import HeroSection from "@/components/HeroSection"
import { getAllSolutionPages, getPageBySlug, getSiteSettings } from "@/sanity/queries"

export async function generateMetadata() {
  const page = await getPageBySlug("monday-consulting-solutions")
  return {
    title: page?.seoTitle,
    description: page?.seoDescription,
  }
}

export default async function SolutionsPage() {
  const [solutions, page, siteSettings] = await Promise.all([
    getAllSolutionPages(),
    getPageBySlug("monday-consulting-solutions"),
    getSiteSettings(),
  ])

  const calendlyUrl =
    siteSettings?.calendlyLink || "https://calendly.com/global-calendar-fruitionservices"

  return (
    <div>
      <HeroSection
        heading={page.heroHeading || ""}
        subheading={page.heroSubheading}
        primaryCta={{ label: page.primaryCtaLabel || "", url: page.primaryCtaUrl || calendlyUrl }}
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
