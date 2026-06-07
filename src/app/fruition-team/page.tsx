import { getTeamMembers, getPageBySlug, getSiteSettings } from "@/sanity/queries"
import type { PartnerBadge, SanityImageRef } from "@/components/sections/types"
import FruitionTeamClient, {
  type TeamMember,
  type TeamRegion,
  type HeroDescriptionBlock,
} from "./FruitionTeamClient"
import { mergeTeamMembers } from "@/lib/mergeTeamMembers"

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

  const mergedMembers = mergeTeamMembers(members, siteSettings?.excludedTeamMemberNames || [])

  const regions: TeamRegion[] = Array.isArray(page?.teamRegions)
    ? (page.teamRegions as TeamRegion[])
    : []

  const heroDescriptionBlocks: HeroDescriptionBlock[] = Array.isArray(
    page?.heroDescriptionBlocks
  )
    ? (page.heroDescriptionBlocks as HeroDescriptionBlock[])
    : []

  return (
    <FruitionTeamClient
      members={mergedMembers}
      heroHeading={page?.heroHeading}
      heroCtaLabel={page?.primaryCtaLabel}
      calendlyUrl={calendlyUrl}
      partnerBadges={partnerBadges}
      certificationBadge={certificationBadge}
      regions={regions}
      heroDescriptionBlocks={heroDescriptionBlocks}
      croSections={page?.croSections}
    />
  )
}
