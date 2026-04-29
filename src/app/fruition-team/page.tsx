import { getTeamMembers, getPageBySlug, getSiteSettings } from "@/sanity/queries"
import type { PartnerBadge, SanityImageRef } from "@/components/sections/types"
import FruitionTeamClient, { type TeamMember } from "./FruitionTeamClient"

export async function generateMetadata() {
  const page = await getPageBySlug("fruition-team")
  return {
    title: page?.seoTitle,
    description: page?.seoDescription,
  }
}

export default async function TeamPage() {
  const [members, page, siteSettings] = await Promise.all([
    getTeamMembers() as Promise<TeamMember[]>,
    getPageBySlug("fruition-team"),
    getSiteSettings(),
  ])

  const calendlyUrl = siteSettings?.calendlyLink || ""
  const partnerBadges: PartnerBadge[] = (siteSettings?.navbarPartnerBadges as PartnerBadge[]) || []
  const certificationBadge = siteSettings?.badgeCertifications as SanityImageRef

  return (
    <FruitionTeamClient
      members={members}
      heroHeading={page?.heroHeading}
      calendlyUrl={calendlyUrl}
      partnerBadges={partnerBadges}
      certificationBadge={certificationBadge}
    />
  )
}
