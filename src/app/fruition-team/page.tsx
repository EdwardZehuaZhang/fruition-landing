import { getTeamMembers, getPageBySlug, getSiteSettings } from "@/sanity/queries"
import type { PartnerBadge, SanityImageRef } from "@/components/sections/types"
import FruitionTeamClient, { type TeamMember } from "./FruitionTeamClient"

export async function generateMetadata() {
  const page = await getPageBySlug("fruition-team")
  return {
    title: page?.seoTitle || "Meet The Fruition Team | Fruition Services",
    description:
      page?.seoDescription ||
      "Meet the Fruition team — 37 certified consultants in monday.com, Atlassian, Make, n8n, and Hootsuite, across Australia, the UK, and the US.",
  }
}

export default async function TeamPage() {
  const [members, page, siteSettings] = await Promise.all([
    getTeamMembers() as Promise<TeamMember[]>,
    getPageBySlug("fruition-team"),
    getSiteSettings(),
  ])

  const calendlyUrl =
    siteSettings?.calendlyLink || "https://calendly.com/global-calendar-fruitionservices"
  const partnerBadges: PartnerBadge[] = (siteSettings?.navbarPartnerBadges as PartnerBadge[]) || []
  const certificationBadge = siteSettings?.badgeCertifications as SanityImageRef

  return (
    <FruitionTeamClient
      members={members}
      heroHeading={page?.heroHeading || "Meet The Fruition Team"}
      calendlyUrl={calendlyUrl}
      partnerBadges={partnerBadges}
      certificationBadge={certificationBadge}
    />
  )
}
