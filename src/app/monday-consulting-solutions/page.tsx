import { bookingHref } from "@/lib/bookingLink"
import Link from "next/link"
import HeroSection from "@/components/HeroSection"
import { CroSections, StickyCtaConfig } from "@/components/sections"
import { getAllSolutionPages, getPageBySlug, getSiteSettings } from "@/sanity/queries"
import { buildOgMetadata } from "@/lib/metadata"
import AuditCtaBanner from "@/components/sections/AuditCtaBanner"

export async function generateMetadata() {
  const page = await getPageBySlug("monday-consulting-solutions")
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/monday-consulting-solutions" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/monday-consulting-solutions",
    }),
  }
}

export default async function SolutionsPage() {
  const [solutions, page, siteSettings] = await Promise.all([
    getAllSolutionPages(),
    getPageBySlug("monday-consulting-solutions"),
    getSiteSettings(),
  ])

  const rawCalendly = siteSettings?.calendlyLink || ""
  const calendlyUrl = bookingHref(rawCalendly)

  return (
    <div>
      <StickyCtaConfig label={page?.croSections?.stickyCtaLabel} mobileLabel={page?.croSections?.stickyCtaMobileLabel} href={bookingHref(page?.croSections?.stickyCtaUrl || rawCalendly)} />
      <HeroSection
        heading={page.heroHeading || ""}
        subheading={page.heroSubheading}
        primaryCta={{ label: page.primaryCtaLabel || "", url: page.primaryCtaUrl || calendlyUrl }}
      />
      <CroSections data={page?.croSections} primaryCtaLabel={page?.primaryCtaLabel} primaryCtaUrl={bookingHref(page?.primaryCtaUrl || rawCalendly)} />
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((s: { slug: string; title: string; heroSubheading?: string }) => (
          <Link
            key={s.slug}
            href={`/monday-consulting-solutions/${s.slug}`}
            className="p-6 border border-ui rounded-xl hover:border-blue-400 hover:shadow-md transition-all"
          >
            <h3 className="text-xl font-semibold text-body mb-2">{s.title}</h3>
            {s.heroSubheading && <p className="text-muted text-sm">{s.heroSubheading}</p>}
          </Link>
        ))}
      </div>

      {/* Mid-page conversion banner — shared site-wide */}
      <AuditCtaBanner />
    </div>
  )
}
