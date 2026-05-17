import type { TeamMember } from "@/components/TeamGridSection"

function normName(s?: string): string {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
}

/**
 * Filter Sanity team members against the optional site-level exclude
 * list (former teammates whose docs still exist in Sanity but should
 * not render publicly). The exclude list comes from siteSettings —
 * see `excludedTeamMemberNames` — so editors control it via Studio.
 */
export function mergeTeamMembers(
  sanityMembers: TeamMember[],
  excludedNames: string[] = [],
): TeamMember[] {
  const excluded = new Set(excludedNames.map(normName))
  return sanityMembers.filter((m) => !excluded.has(normName(m.name)))
}
