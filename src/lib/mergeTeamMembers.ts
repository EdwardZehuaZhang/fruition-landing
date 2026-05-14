import type { TeamMember } from "@/components/TeamGridSection"
import { TEAM_ROSTER } from "@/data/teamRoster"

/**
 * Merge Sanity team members with the canonical monday-board roster.
 *
 * Sanity entries win when both sources have the same person (matched by
 * lowercased name). New members on monday that aren't yet in Sanity are
 * appended with their roster-defined role and region tags so they still
 * appear on /fruition-team and the location-specific pages.
 */
export function mergeTeamMembers(sanityMembers: TeamMember[]): TeamMember[] {
  const sanityByName = new Map<string, TeamMember>()
  for (const m of sanityMembers) {
    if (m?.name) sanityByName.set(m.name.toLowerCase().trim(), m)
  }

  const merged: TeamMember[] = []
  const seen = new Set<string>()

  for (const r of TEAM_ROSTER) {
    const key = r.name.toLowerCase().trim()
    const existing = sanityByName.get(key)
    if (existing) {
      // Sanity has this member — keep Sanity fields but trust the monday-
      // derived roster for region tags + role + photoUrl/bio/linkedin
      // fallback so stale Sanity data doesn't bleed across tabs.
      const photoUrl = existing.photo?.asset?._ref ? existing.photoUrl : (existing.photoUrl ?? r.photoUrl)
      merged.push({
        ...existing,
        role: r.role || existing.role,
        regions: r.regions,
        photoUrl,
        bio: existing.bio || r.bio,
        linkedinUrl: existing.linkedinUrl || r.linkedinUrl,
      })
    } else {
      merged.push({
        _id: r.id,
        name: r.name,
        role: r.role,
        emoji: r.emoji,
        regions: r.regions,
        photoUrl: r.photoUrl,
        bio: r.bio,
        linkedinUrl: r.linkedinUrl,
      })
    }
    seen.add(key)
  }

  // Keep any extra Sanity-only members that weren't in the roster.
  for (const m of sanityMembers) {
    if (!seen.has(m.name.toLowerCase().trim())) merged.push(m)
  }

  return merged
}
