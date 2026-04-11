import Link from "next/link"
import HeroSection from "@/components/HeroSection"
import { getAllSolutionPages } from "@/sanity/queries"

export const metadata = {
  title: "monday.com Solutions | Fruition Services",
  description: "Purpose-built monday.com solutions for every team. Project management, CRM, HR, Finance and more.",
}

export default async function SolutionsPage() {
  const solutions = await getAllSolutionPages()
  return (
    <div>
      <HeroSection
        heading="monday.com Solutions"
        subheading="Purpose-built solutions for every team. Powered by monday.com, configured by Fruition."
        primaryCta={{ label: "Book a Consultation", url: "https://calendly.com/global-calendar-fruitionservices" }}
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
