/**
 * Data access for the `social_variants` table (Marketa social approval loop).
 *
 * Same transport as brain.ts: plain fetch against the Marketa Supabase
 * PostgREST API with the service-role key. Keyed by (monday_item_id, channel).
 *
 * Schema: supabase/migrations/20260622000000_social_variants.sql
 */

import type { SocialChannel } from "@/lib/marketa/ayrshare"

function restBase(): string {
  const url = process.env.MARKETA_SUPABASE_URL
  if (!url) throw new Error("MARKETA_SUPABASE_URL missing")
  return `${url.replace(/\/+$/, "")}/rest/v1`
}

function headers(extra?: Record<string, string>): Record<string, string> {
  const key = process.env.MARKETA_SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error("MARKETA_SUPABASE_SERVICE_ROLE_KEY missing")
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  }
}

export type SocialVariantStatus =
  | "pending"
  | "approved"
  | "published"
  | "skipped"
  | "error"

export interface SocialVariantRow {
  monday_item_id: string
  channel: SocialChannel
  post_text: string
  title?: string | null
  media_urls?: string[]
  blog_url?: string | null
  status?: SocialVariantStatus
  ayrshare_post_id?: string | null
  result_summary?: string | null
}

/**
 * Upsert all of an item's variants in one call (called at generation time).
 * Uses PostgREST upsert via Prefer: resolution=merge-duplicates on the
 * composite PK (monday_item_id, channel).
 */
export async function upsertVariants(rows: SocialVariantRow[]): Promise<void> {
  if (!rows.length) return
  const payload = rows.map((r) => ({
    monday_item_id: r.monday_item_id,
    channel: r.channel,
    post_text: r.post_text,
    title: r.title ?? null,
    media_urls: r.media_urls ?? [],
    blog_url: r.blog_url ?? null,
    status: r.status ?? "pending",
    updated_at: new Date().toISOString(),
  }))
  const r = await fetch(`${restBase()}/social_variants`, {
    method: "POST",
    headers: headers({ Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify(payload),
  })
  if (!r.ok) {
    throw new Error(`Supabase upsert social_variants ${r.status}: ${(await r.text()).slice(0, 300)}`)
  }
}

/** Read one variant for a click. Returns null on any miss/error. */
export async function getVariant(
  mondayItemId: string,
  channel: SocialChannel,
): Promise<SocialVariantRow | null> {
  try {
    const url =
      `${restBase()}/social_variants` +
      `?monday_item_id=eq.${encodeURIComponent(mondayItemId)}` +
      `&channel=eq.${encodeURIComponent(channel)}&limit=1`
    const r = await fetch(url, { headers: headers() })
    if (!r.ok) return null
    const rows = (await r.json()) as SocialVariantRow[]
    return rows[0] ?? null
  } catch {
    return null
  }
}

/** Patch status (+ optional ayrshare id / summary) after an approve/skip. */
export async function updateVariantStatus(
  mondayItemId: string,
  channel: SocialChannel,
  patch: { status: SocialVariantStatus; ayrsharePostId?: string; resultSummary?: string },
): Promise<void> {
  const url =
    `${restBase()}/social_variants` +
    `?monday_item_id=eq.${encodeURIComponent(mondayItemId)}` +
    `&channel=eq.${encodeURIComponent(channel)}`
  const r = await fetch(url, {
    method: "PATCH",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify({
      status: patch.status,
      ayrshare_post_id: patch.ayrsharePostId ?? null,
      result_summary: patch.resultSummary ?? null,
      updated_at: new Date().toISOString(),
    }),
  })
  if (!r.ok) {
    throw new Error(`Supabase update social_variants ${r.status}: ${(await r.text()).slice(0, 300)}`)
  }
}
