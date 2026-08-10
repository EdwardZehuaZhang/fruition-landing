/**
 * Rolling several per-channel statuses up into one.
 *
 * Client-safe and dependency-free on purpose: the dashboard needs this in the
 * browser to show a composition's real state (derived from its channels' live
 * Zernio statuses) rather than the status cached on the row, which is only as
 * fresh as the last time someone opened the composer.
 */

/** Zernio statuses in the order they should win when channels disagree. */
export function rollupStatus(statuses: string[]): string {
  if (!statuses.length) return "draft"
  const unique = new Set(statuses)
  if (unique.size === 1) return statuses[0]
  if (unique.has("failed")) return "failed"
  if (unique.has("publishing")) return "publishing"
  // Some live, some not: "mixed" is the honest answer, and it's the state that
  // most often needs attention (a channel that quietly failed to go out).
  if (unique.has("published")) return "mixed"
  if (unique.has("scheduled")) return "scheduled"
  return "draft"
}
