import Link from "next/link"
import HeroSection from "@/components/HeroSection"

const solutions = [
  { slug: "monday-project-management", title: "Project Management", desc: "Plan, track and deliver projects at scale." },
  { slug: "monday-service", title: "monday Service", desc: "Streamline IT and service management." },
  { slug: "monday-for-finance", title: "Finance", desc: "Automate financial workflows and reporting." },
  { slug: "monday-product-management", title: "Product Management", desc: "Build and ship products faster." },
  { slug: "monday-for-hr", title: "HR Solutions", desc: "Manage people processes end-to-end." },
  { slug: "solar-crm-solution", title: "Solar CRM", desc: "Purpose-built CRM for solar businesses." },
  { slug: "monday-for-cabinetry-renovation", title: "Installation & Renovation", desc: "Job management for trades and renovation." },
]

export const metadata = {
  title: "monday.com Solutions | Fruition Services",
  description: "Purpose-built monday.com solutions for every team. Project management, CRM, HR, Finance and more.",
}

export default function SolutionsPage() {
  return (
    <div>
      <HeroSection
        heading="monday.com Solutions"
        subheading="Purpose-built solutions for every team. Powered by monday.com, configured by Fruition."
        primaryCta={{ label: "Book a Consultation", url: "https://calendly.com/global-calendar-fruitionservices" }}
      />
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((s) => (
          <Link key={s.slug} href={`/monday-consulting-solutions/${s.slug}`}
            className="p-6 border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{s.title}</h3>
            <p className="text-gray-600 text-sm">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}