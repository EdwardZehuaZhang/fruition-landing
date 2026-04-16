import Link from "next/link"
import { getFaqItems, getPageBySlug } from "@/sanity/queries"
import FaqList, { type FaqItem } from "./FaqList"

export async function generateMetadata() {
  const page = await getPageBySlug("faqs")
  return {
    title: page?.seoTitle || "FAQs | Fruition Services",
    description:
      page?.seoDescription ||
      "Frequently asked questions about monday.com implementation, consulting, training and Fruition services.",
  }
}

const CALENDLY_URL = "https://calendly.com/global-calendar-fruitionservices"

export default async function FaqsPage() {
  const [faqs, page] = await Promise.all([getFaqItems() as Promise<FaqItem[]>, getPageBySlug("faqs")])

  const heading = page?.heroHeading || "Frequently asked questions"
  const subheading =
    page?.heroSubheading ||
    "Answers to the most common questions about monday.com implementation, consulting, training, and working with Fruition."
  const ctaLabel = page?.primaryCtaLabel || "Book a consultation"
  const ctaUrl = page?.primaryCtaUrl || CALENDLY_URL

  return (
    <div className="bg-white">
      <section className="bg-[color:var(--light-section-bg)]">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center md:py-24">
          <span
            className="text-micro uppercase"
            style={{ color: "var(--purple-primary)", letterSpacing: "0.12em" }}
          >
            Help Center
          </span>
          <h1 className="mt-4 text-display text-black">{heading}</h1>
          <p className="mt-5 max-w-2xl text-body-lead text-[color:var(--color-text-secondary)]">{subheading}</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 py-16 md:py-20">
        <FaqList items={faqs ?? []} />
      </section>

      <section className="bg-[color:var(--dark-bg)] text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center md:py-20">
          <h2 className="text-section-h2 text-white">Still have questions?</h2>
          <p className="mt-4 max-w-xl text-body-lead text-white/80">
            Our team is happy to walk you through monday.com and how Fruition can help your business grow.
          </p>
          <Link
            href={ctaUrl}
            className="ui-cta-btn ui-cta-btn-secondary mt-8"
            style={{ minWidth: 260 }}
          >
            {ctaLabel}
          </Link>
        </div>
      </section>
    </div>
  )
}
