import { getPageBySlug } from "@/sanity/queries"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

export async function generateMetadata() {
  const page = await getPageBySlug("terms-and-conditions")
  return {
    title: page?.seoTitle || "Terms and Conditions | Fruition Services",
    description: page?.seoDescription || "Fruition Services terms and conditions governing use of our services and website.",
  }
}

export default async function TermsPage() {
  const page = await getPageBySlug("terms-and-conditions")
  const heading = page?.heroHeading || "Terms and Conditions"
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">{heading}</h1>
      {page?.body ? <div className="prose prose-lg"><PortableText value={page.body} components={portableTextComponents} /></div>
        : <p className="text-gray-500">Terms and conditions coming soon.</p>}
    </div>
  )
}
