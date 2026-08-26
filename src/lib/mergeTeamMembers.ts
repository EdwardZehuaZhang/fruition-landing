import type { TeamMember } from "@/components/TeamGridSection"

function normName(s?: string): string {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
}

/**
 * TEMPORARY code-level hide, on top of the Sanity exclude list below.
 *
 * These names are filtered out of every public team grid regardless of
 * what siteSettings says. Kept in code (rather than Studio) so the hide
 * can be reverted by deleting this array in a single commit — remove the
 * entry once the person should show on the site again.
 */
const TEMPORARILY_HIDDEN_NAMES = ["Edward Zehua Zhang"]

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
  const excluded = new Set(
    [...excludedNames, ...TEMPORARILY_HIDDEN_NAMES].map(normName),
  )
  return sanityMembers.filter((m) => !excluded.has(normName(m.name)))
}
