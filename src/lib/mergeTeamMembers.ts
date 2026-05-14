import type { TeamMember } from "@/components/TeamGridSection"
import { TEAM_ROSTER } from "@/data/teamRoster"

function normName(s?: string): string {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
}

// Sanity team docs that should never render — overrides Sanity even when
// the doc still exists (e.g. former teammates).
const EXCLUDED_NAMES = new Set(
  ["Aquib Zafar", "Natalia Mishenina"].map((n) => normName(n)),
)

/**
 * Merge Sanity team members with the canonical monday-board roster.
 *
 * Sanity entries win when both sources have the same person (matched by
 * lowercased name). New members on monday that aren't yet in Sanity are
 * appended with their roster-defined role and region tags so they still
 * appear on /fruition-team and the location-specific pages.
 */
export function mergeTeamMembers(sanityMembers: TeamMember[]): TeamMember[] {
  // Sanity is now the single source of truth for /fruition-team and the
  // location-specific monday-partner-* pages. The roster file is kept
  // around as a one-way upstream that periodically backfills Sanity (see
  // scripts/sync-roster-to-sanity.mjs) but does not run at request time.
  // All we do here is drop the excluded former-teammate docs.
  void TEAM_ROSTER
  return sanityMembers.filter((m) => !EXCLUDED_NAMES.has(normName(m.name)))
}
