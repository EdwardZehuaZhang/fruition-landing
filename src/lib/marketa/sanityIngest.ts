/**
 * Sanity → brain ingest logic, shared by the webhook route
 * (src/app/api/sanity-ingest/route.ts) and the one-shot backfill
 * (scripts/brain-backfill.ts).
 *
 * Pipeline per document: fetch full doc → flatten to plaintext →
 * chunk → embed (Voyage) → replace chunks in Supabase.
 *
 * Design: docs/marketa.md Part A (§5–§7).
 */
import { createClient } from "@sanity/client"
import { apiVersion, dataset, projectId } from "../../sanity/env"
import {
  embedTexts,
  replaceChunksForSource,
  deleteChunksForSource,
  type BrainChunkInput,
} from "./brain"

/**
 * Document _types that enter the brain. Mirrors the GROQ webhook filter in
 * docs/marketa.md §6 plus this repo's actual schema name for blog posts
 * (`blogPost`). The voice guide is intentionally excluded — it's fetched raw
 * via GROQ and injected as a system prompt, so embedding it would only
 * dilute retrieval.
 */
export const INGEST_TYPES = [
  "page",
  "servicePage",
  "industryPage",
  "locationPage",
  "partnershipPage",
  "mondayImplementationConsultantsPage",
  "post",
  "blogPost",
] as const

/** Fresh (non-CDN, token-authed) read client so ingest sees latest revs. */
function freshClient() {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_WRITE_TOKEN, // read scope is enough; reuse existing token
  })
}

interface SanityDoc {
  _id: string
  _rev?: string
  _type?: string
  title?: string
  slug?: { current?: string }
  industry?: string
  region?: string
  useCase?: string
  [key: string]: unknown
}

const TEXT_FIELD_KEYS = new Set([
  "title",
  "heading",
  "subheading",
  "subtitle",
  "eyebrow",
  "label",
  "body",
  "text",
  "excerpt",
  "question",
  "answer",
  "description",
  "quote",
  "seoTitle",
  "seoDescription",
  "ctaText",
])

const SKIP_KEYS = new Set([
  "_id",
  "_rev",
  "_type",
  "_key",
  "_ref",
  "_createdAt",
  "_updatedAt",
  "asset",
  "slug",
  "image",
  "hotspot",
  "crop",
])

/**
 * Flatten an arbitrary Sanity document (PortableText + nested block objects)
 * into readable plaintext. Joins PortableText span children, and collects
 * string values under known text-ish keys. Imperfect by design — good enough
 * to make a page semantically retrievable without rendering every block type.
 */
export function extractPlainText(value: unknown): string {
  const out: string[] = []

  const walk = (node: unknown, underTextKey: boolean): void => {
    if (node == null) return
    if (typeof node === "string") {
      if (underTextKey) {
        const t = node.trim()
        if (t) out.push(t)
      }
      return
    }
    if (Array.isArray(node)) {
      for (const item of node) walk(item, underTextKey)
      return
    }
    if (typeof node === "object") {
      const obj = node as Record<string, unknown>
      // PortableText block: join its spans.
      if (obj._type === "block" && Array.isArray(obj.children)) {
        const line = (obj.children as Array<{ text?: string }>)
          .map((c) => (typeof c?.text === "string" ? c.text : ""))
          .join("")
          .trim()
        if (line) out.push(line)
        return
      }
      for (const [key, v] of Object.entries(obj)) {
        if (SKIP_KEYS.has(key)) continue
        walk(v, underTextKey || TEXT_FIELD_KEYS.has(key))
      }
    }
  }

  walk(value, false)
  // Collapse whitespace and de-dupe consecutive identical lines.
  const lines: string[] = []
  for (const l of out) {
    const clean = l.replace(/\s+/g, " ").trim()
    if (clean && clean !== lines[lines.length - 1]) lines.push(clean)
  }
  return lines.join("\n")
}

/**
 * Split text into ~500-token chunks with ~50-token overlap (approximated by
 * characters: ~4 chars/token → ~2000 char target, ~200 char overlap).
 * Splits on paragraph boundaries first so chunks stay coherent.
 */
export function chunkText(
  text: string,
  { maxChars = 2000, overlapChars = 200 }: { maxChars?: number; overlapChars?: number } = {},
): string[] {
  const trimmed = text.trim()
  if (!trimmed) return []
  if (trimmed.length <= maxChars) return [trimmed]

  const paragraphs = trimmed.split(/\n{1,}/).map((p) => p.trim()).filter(Boolean)
  const chunks: string[] = []
  let buf = ""

  const flush = () => {
    const b = buf.trim()
    if (b) chunks.push(b)
    // Carry an overlap tail into the next chunk for context continuity.
    buf = b.length > overlapChars ? b.slice(b.length - overlapChars) : ""
  }

  for (const para of paragraphs) {
    if (para.length > maxChars) {
      // A single huge paragraph: hard-split by sentence-ish boundaries.
      const sentences = para.split(/(?<=[.!?])\s+/)
      for (const s of sentences) {
        if ((buf + " " + s).length > maxChars) flush()
        buf = buf ? `${buf} ${s}` : s
      }
      continue
    }
    if ((buf + "\n\n" + para).length > maxChars) flush()
    buf = buf ? `${buf}\n\n${para}` : para
  }
  const tail = buf.trim()
  if (tail) chunks.push(tail)
  return chunks
}

function buildMetadata(doc: SanityDoc): Record<string, unknown> {
  const meta: Record<string, unknown> = { type: doc._type }
  if (doc.industry) meta.industry = doc.industry
  if (doc.region) meta.region = doc.region
  if (doc.useCase) meta.use_case = doc.useCase
  if (doc.title) meta.title = doc.title
  return meta
}

/** True for draft documents (Sanity prefixes draft ids with `drafts.`). */
export function isDraftId(id: string): boolean {
  return id.startsWith("drafts.")
}

export interface IngestResult {
  sourceId: string
  action: "indexed" | "deleted" | "skipped"
  chunks?: number
  reason?: string
}

/**
 * Build, embed, and store chunks for an already-fetched document.
 * Returns the ingest result. Exposed for the backfill path which already has
 * full doc objects from a GROQ query.
 */
export async function ingestDoc(doc: SanityDoc): Promise<IngestResult> {
  if (!doc?._id) return { sourceId: "(unknown)", action: "skipped", reason: "no _id" }
  if (isDraftId(doc._id)) {
    return { sourceId: doc._id, action: "skipped", reason: "draft" }
  }
  if (!doc._type || !INGEST_TYPES.includes(doc._type as (typeof INGEST_TYPES)[number])) {
    return { sourceId: doc._id, action: "skipped", reason: `type ${doc._type} not indexed` }
  }

  const titleLine = doc.title ? `${doc.title}\n\n` : ""
  const text = titleLine + extractPlainText(doc)
  const chunks = chunkText(text)
  if (chunks.length === 0) {
    // Nothing retrievable — make sure no stale chunks linger.
    await deleteChunksForSource(doc._id)
    return { sourceId: doc._id, action: "skipped", reason: "no text" }
  }

  const embeddings = await embedTexts(chunks, "document")
  const metadata = buildMetadata(doc)
  const sourcePath = doc.slug?.current
  const rows: BrainChunkInput[] = chunks.map((body, i) => ({
    sourceId: doc._id,
    sourceRev: doc._rev,
    sourceType: "sanity",
    sourcePath,
    chunkIndex: i,
    body,
    embedding: embeddings[i],
    metadata,
    confidentialityLevel: "public",
    tokenCount: Math.round(body.length / 4),
  }))

  await replaceChunksForSource(doc._id, rows)
  return { sourceId: doc._id, action: "indexed", chunks: rows.length }
}

/** Fetch a document by id from Sanity, then ingest it. Used by the webhook. */
export async function ingestDocById(id: string): Promise<IngestResult> {
  if (isDraftId(id)) return { sourceId: id, action: "skipped", reason: "draft" }
  const doc = await freshClient().fetch<SanityDoc | null>(`*[_id == $id][0]`, { id })
  if (!doc) {
    // Deleted or unpublished — remove from the brain.
    await deleteChunksForSource(id)
    return { sourceId: id, action: "deleted", reason: "not found in Sanity" }
  }
  return ingestDoc(doc)
}

/** Remove a document from the brain (delete webhook event). */
export async function removeDoc(id: string): Promise<IngestResult> {
  await deleteChunksForSource(id)
  return { sourceId: id, action: "deleted" }
}

/** GROQ to enumerate every indexable published document, for backfill. */
export function backfillQuery(): string {
  const types = INGEST_TYPES.map((t) => `"${t}"`).join(", ")
  return `*[_type in [${types}] && !(_id in path("drafts.**"))]`
}

export async function fetchAllIndexableDocs(): Promise<SanityDoc[]> {
  return freshClient().fetch<SanityDoc[]>(backfillQuery())
}
