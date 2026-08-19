import { getPageBySlug } from "@/sanity/queries"
import PolicyContent from "@/components/PolicyContent"
import VisitorTrackingDisclosure from "@/components/VisitorTrackingDisclosure"
import { buildOgMetadata } from "@/lib/metadata"

export async function generateMetadata() {
  const page = await getPageBySlug("data-privacy")
  const title = page?.seoTitle
  const description = page?.seoDescription
  return {
    alternates: { canonical: "/data-privacy" },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/data-privacy",
    }),
  }
}

export default async function PrivacyPage() {
  const page = await getPageBySlug("data-privacy")

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {page.heroHeading && (
        <h1 className="text-4xl font-bold tracking-tight text-body mb-10">
          {page.heroHeading}
        </h1>
      )}
      {page.body && <PolicyContent value={page.body} />}
      <VisitorTrackingDisclosure />
    </div>
  )
}
