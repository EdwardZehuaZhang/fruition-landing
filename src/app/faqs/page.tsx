import Link from "next/link"
import { getFaqItems, getPageBySlug, getSiteSettings } from "@/sanity/queries"
import FaqList, { type FaqItem } from "./FaqList"

export async function generateMetadata() {
  const page = await getPageBySlug("faqs")
  return {
    title: page?.seoTitle,
    description: page?.seoDescription,
  }
}

export default async function FaqsPage() {
  const [faqs, page, siteSettings] = await Promise.all([
    getFaqItems() as Promise<FaqItem[]>,
    getPageBySlug("faqs"),
    getSiteSettings(),
  ])

  const calendlyUrl = siteSettings?.calendlyLink || ""

  return (
    <div className="bg-white">
      <section className="bg-[color:var(--light-section-bg)]">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center md:py-24">
          {page.heroEyebrow && (
            <span
              className="text-micro uppercase"
              style={{ color: "var(--purple-primary)", letterSpacing: "0.12em" }}
            >
              {page.heroEyebrow}
            </span>
          )}
          {page.heroHeading && (
            <h1 className="mt-4 text-display text-black">{page.heroHeading}</h1>
          )}
          {page.heroSubheading && (
            <p className="mt-5 max-w-2xl text-body-lead text-[color:var(--color-text-secondary)]">
              {page.heroSubheading}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 py-16 md:py-20">
        <FaqList items={faqs ?? []} />
      </section>

      {(page.calendlyHeading || page.calendlySubheading || page.primaryCtaLabel) && (
        <section className="bg-[color:var(--dark-bg)] text-white">
          <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center md:py-20">
            {page.calendlyHeading && (
              <h2 className="text-section-h2 text-white">{page.calendlyHeading}</h2>
            )}
            {page.calendlySubheading && (
              <p className="mt-4 max-w-xl text-body-lead text-white/80">
                {page.calendlySubheading}
              </p>
            )}
            {page.primaryCtaLabel && (
              <Link
                href={page.primaryCtaUrl || calendlyUrl}
                className="ui-cta-btn ui-cta-btn-secondary mt-8"
                style={{ minWidth: 260 }}
              >
                {page.primaryCtaLabel}
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
