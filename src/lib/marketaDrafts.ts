/**
 * Read-only accessor for Marketa's draft store (brain Supabase, blog_drafts).
 *
 * The Marketa pipeline runs from the marketa-monorepo host; the portal pages
 * here only ever READ drafts. This is the one seam the website keeps —
 * extracted from lib/marketa/brain.ts when the pipeline was cut over
 * (see marketa-monorepo/docs/MIGRATION-STATUS.md).
 */

function supabaseRestBase(): string {
  const url = process.env.MARKETA_SUPABASE_URL
  if (!url) throw new Error("MARKETA_SUPABASE_URL missing")
  return `${url.replace(/\/+$/, "")}/rest/v1`
}

function supabaseHeaders(): Record<string, string> {
  const key = process.env.MARKETA_SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error("MARKETA_SUPABASE_SERVICE_ROLE_KEY missing")
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  }
}

export async function getFullDraft(mondayItemId: string): Promise<string | null> {
  // Fail-safe: any error (missing MARKETA_SUPABASE_* env, network, bad row)
  // returns null so callers fall back to the (truncated) monday column.
  try {
    const url = `${supabaseRestBase()}/blog_drafts?monday_item_id=eq.${encodeURIComponent(
      mondayItemId,
    )}&select=body&limit=1`
    const r = await fetch(url, { headers: supabaseHeaders() })
    if (!r.ok) return null
    const rows = (await r.json()) as Array<{ body?: string }>
    return rows[0]?.body ?? null
  } catch {
    return null
  }
}
