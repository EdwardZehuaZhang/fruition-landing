import { getPageBySlug } from "@/sanity/queries"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

export const metadata = { title: "Terms and Conditions | Fruition Services" }

export default async function TermsPage() {
  const page = await getPageBySlug("terms-and-conditions")
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
      {page?.body ? <div className="prose prose-lg"><PortableText value={page.body} components={portableTextComponents} /></div>
        : <p className="text-gray-500">Terms and conditions coming soon.</p>}
    </div>
  )
}