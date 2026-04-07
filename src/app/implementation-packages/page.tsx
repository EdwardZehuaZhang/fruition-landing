import { getServicePageBySlug } from "@/sanity/queries"
import ImplementationPackagesContent from "./ImplementationPackagesContent"

export async function generateMetadata() {
  const page = await getServicePageBySlug("implementation-packages")
  return {
    title: page?.seoTitle || "Implementation Packages | Fruition Services",
    description:
      page?.seoDescription ||
      "Structured monday.com implementation packages to get your team running fast. Certified Fruition consultants.",
  }
}

export default function Page() {
  return <ImplementationPackagesContent />
}
