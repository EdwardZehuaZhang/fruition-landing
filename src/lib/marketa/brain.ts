/**
 * Marketa RAG brain client.
 *
 * Two responsibilities, both over plain `fetch` (no SDK deps, mirroring
 * sanityWriteClient.ts):
 *   1. Embed text with Google Gemini (`text-embedding-004`, 768-dim) — the
 *      SAME model the n8n draft workflow uses to embed the query, so ingest
 *      and retrieval vectors live in the same space. Do NOT change the model
 *      on one side only; embeddings would drift and retrieval silently breaks.
 *   2. Read/write the Supabase `content_chunks` table via the REST
 *      (PostgREST) API using the service-role key.
 *
 * Schema: supabase/migrations/20260616000000_marketa_brain.sql (vector(768))
 * Design: docs/marketa.md Part A.
 */

export const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "gemini-embedding-001"
export const EMBEDDING_DIM = Number(process.env.EMBEDDING_DIM || "768")

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta"

function geminiKey(): string {
  const k = process.env.GEMINI_API_KEY
  if (!k) throw new Error("GEMINI_API_KEY missing")
  return k
}

// Brain Supabase is a DEDICATED project (separate from the website's own
// SUPABASE_* vars, which point at a different project). Namespaced env names
// avoid that collision — see docs/marketa.md §11b.
function supabaseRestBase(): string {
  const url = process.env.MARKETA_SUPABASE_URL
  if (!url) throw new Error("MARKETA_SUPABASE_URL missing")
  return `${url.replace(/\/+$/, "")}/rest/v1`
}

function supabaseServiceKey(): string {
  const k = process.env.MARKETA_SUPABASE_SERVICE_ROLE_KEY
  if (!k) throw new Error("MARKETA_SUPABASE_SERVICE_ROLE_KEY missing")
  return k
}

function supabaseHeaders(extra?: Record<string, string>): Record<string, string> {
  const key = supabaseServiceKey()
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  }
}

/**
 * Embed a batch of texts with Gemini. `inputType` maps to Gemini's task type:
 * `document` → RETRIEVAL_DOCUMENT (storing), `query` → RETRIEVAL_QUERY
 * (searching). The brain stores documents; the n8n retrieval step embeds the
 * query — both must use this same model so the vectors are comparable.
 */
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

export async function embedTexts(
  texts: string[],
  inputType: "document" | "query" = "document",
): Promise<number[][]> {
  if (texts.length === 0) return []
  const taskType = inputType === "query" ? "RETRIEVAL_QUERY" : "RETRIEVAL_DOCUMENT"
  const url = `${GEMINI_BASE}/models/${EMBEDDING_MODEL}:batchEmbedContents`
  const requests = texts.map((t) => ({
    model: `models/${EMBEDDING_MODEL}`,
    content: { parts: [{ text: t }] },
    taskType,
    // gemini-embedding-001 defaults to 3072-dim; request 768 to match the
    // vector(768) column. Cosine distance (pgvector vector_cosine_ops) is
    // scale-invariant, so MRL truncation needs no manual re-normalization.
    outputDimensionality: EMBEDDING_DIM,
  }))

  // Retry on 429 (rate limit) and 5xx with backoff. Gemini's free tier is
  // generous (~1,500 RPM) but can still throttle under bursts.
  const maxRetries = Number(process.env.EMBED_MAX_RETRIES || "6")
  let r: Response
  for (let attempt = 0; ; attempt++) {
    r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": geminiKey(),
      },
      body: JSON.stringify({ requests }),
    })
    if (r.status !== 429 && r.status < 500) break
    if (attempt >= maxRetries) {
      throw new Error(
        `Gemini embed ${r.status} after ${attempt} retries: ${(await r.text()).slice(0, 200)}`,
      )
    }
    const retryAfter = Number(r.headers.get("retry-after"))
    const waitMs =
      Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : Math.min(30000, 2000 * 2 ** attempt)
    await sleep(waitMs)
  }
  if (!r.ok) {
    throw new Error(`Gemini embed ${r.status}: ${(await r.text()).slice(0, 300)}`)
  }
  const j = (await r.json()) as { embeddings?: Array<{ values: number[] }> }
  const out = (j.embeddings ?? []).map((e) => e.values)
  if (out.length !== texts.length) {
    throw new Error(`Gemini returned ${out.length} embeddings for ${texts.length} inputs`)
  }
  for (const v of out) {
    if (v.length !== EMBEDDING_DIM) {
      throw new Error(
        `Gemini embedding dim ${v.length} != expected ${EMBEDDING_DIM} (model ${EMBEDDING_MODEL}). ` +
          `Check EMBEDDING_MODEL / EMBEDDING_DIM and the vector() column dimension.`,
      )
    }
  }
  return out
}

export interface BrainChunkInput {
  sourceId: string
  sourceRev?: string
  sourceType?: string
  sourcePath?: string
  chunkIndex: number
  body: string
  embedding: number[]
  metadata?: Record<string, unknown>
  confidentialityLevel?: string
  tokenCount?: number
}

/** pgvector accepts a bracketed string literal: `[0.1,0.2,...]`. */
function toVectorLiteral(v: number[]): string {
  return `[${v.join(",")}]`
}

async function deleteBySourceId(sourceId: string): Promise<void> {
  const url = `${supabaseRestBase()}/content_chunks?source_id=eq.${encodeURIComponent(sourceId)}`
  const r = await fetch(url, { method: "DELETE", headers: supabaseHeaders() })
  if (!r.ok && r.status !== 404) {
    throw new Error(`Supabase delete ${r.status}: ${(await r.text()).slice(0, 300)}`)
  }
}

async function insertChunks(rows: BrainChunkInput[]): Promise<void> {
  if (rows.length === 0) return
  const payload = rows.map((c) => ({
    source_id: c.sourceId,
    source_rev: c.sourceRev ?? null,
    source_type: c.sourceType ?? "sanity",
    source_path: c.sourcePath ?? null,
    chunk_index: c.chunkIndex,
    body: c.body,
    embedding: toVectorLiteral(c.embedding),
    metadata: c.metadata ?? {},
    confidentiality_level: c.confidentialityLevel ?? "public",
    token_count: c.tokenCount ?? null,
  }))
  const r = await fetch(`${supabaseRestBase()}/content_chunks`, {
    method: "POST",
    headers: supabaseHeaders({ Prefer: "return=minimal" }),
    body: JSON.stringify(payload),
  })
  if (!r.ok) {
    throw new Error(`Supabase insert ${r.status}: ${(await r.text()).slice(0, 300)}`)
  }
}

/**
 * Replace every chunk for a source document. Delete-then-insert so a doc that
 * re-embeds into fewer chunks never leaves stale tail rows behind. Callers
 * embed first, then hand the rows here.
 */
export async function replaceChunksForSource(
  sourceId: string,
  rows: BrainChunkInput[],
): Promise<void> {
  await deleteBySourceId(sourceId)
  await insertChunks(rows)
}

/** Remove a document from the brain entirely (Sanity delete/unpublish). */
export async function deleteChunksForSource(sourceId: string): Promise<void> {
  await deleteBySourceId(sourceId)
}

/**
 * Read the FULL blog draft the n8n workflow stored in `blog_drafts`. The monday
 * long_text column truncates at ~2000 chars, so the auto-docs builder reads the
 * complete draft from here instead. Returns null if no row (then callers fall
 * back to the monday column). See supabase/migrations/20260617000000_blog_drafts.sql.
 */
export async function getFullDraft(mondayItemId: string): Promise<string | null> {
  // Fail-safe: any error (missing MARKETA_SUPABASE_* env, network, bad row)
  // returns null so the auto-docs route falls back to the (truncated) monday
  // column instead of throwing and breaking doc generation entirely.
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
