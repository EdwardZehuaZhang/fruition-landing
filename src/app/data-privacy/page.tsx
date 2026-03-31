import { getPageBySlug } from "@/sanity/queries"
import { PortableText } from "@portabletext/react"
import { portableTextComponents } from "@/components/PortableTextComponents"

export async function generateMetadata() {
  const page = await getPageBySlug("data-privacy")
  return {
    title: page?.seoTitle || "Data Privacy Policy | Fruition Services",
    description: page?.seoDescription || "Fruition Services data privacy policy. How we collect, use and protect your personal information.",
  }
}

export default async function PrivacyPage() {
  const page = await getPageBySlug("data-privacy")
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Data Privacy Policy</h1>
      {page?.body ? <div className="prose prose-lg"><PortableText value={page.body} components={portableTextComponents} /></div>
        : <p className="text-gray-500">Privacy policy coming soon.</p>}
    </div>
  )
}