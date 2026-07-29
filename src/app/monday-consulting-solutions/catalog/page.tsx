import { bookingHref } from "@/lib/bookingLink"
import { getSiteSettings } from "@/sanity/queries"
import { buildOgMetadata } from "@/lib/metadata"
import CatalogContent from "./CatalogContent"

export async function generateMetadata() {
  const title = "Solutions Catalog | Fruition Services"
  const description =
    "The full map of what Fruition builds on monday.com. 45 solutions across Work Management, CRM, Service, Operations, and the 2026 R&D pipeline."
  return {
    alternates: { canonical: "/monday-consulting-solutions/catalog" },
    title,
    description,
    ...buildOgMetadata({ title, description, path: "/monday-consulting-solutions/catalog" }),
  }
}

export default async function Page() {
  const siteSettings = await getSiteSettings()
  const calendlyUrl = bookingHref(siteSettings?.calendlyLink)
  return <CatalogContent calendlyUrl={calendlyUrl} />
}
