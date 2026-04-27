import { getSiteSettings } from "@/sanity/queries"
import CatalogContent from "./CatalogContent"

export const metadata = {
  title: "Solutions Catalog | Fruition Services",
  description:
    "The full map of what Fruition builds on monday.com. 45 solutions across Work Management, CRM, Service, Operations, and the 2026 R&D pipeline.",
}

export default async function Page() {
  const siteSettings = await getSiteSettings()
  const calendlyUrl =
    siteSettings?.calendlyLink || "https://calendly.com/global-calendar-fruitionservices"
  return <CatalogContent calendlyUrl={calendlyUrl} />
}
