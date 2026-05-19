# Marketa — Sanity → RAG Brain Integration

Reference doc for wiring the Fruition website (Sanity CMS) into Marketa's centralised RAG brain. Based on Marketa Brief v0.2 (3 May 2026).

---

## 1. What this integration does

Sanity holds all written website content — blogs, landing pages, service pages, voice guide. Marketa needs to *read* that content to write new content. We sync Sanity → Supabase pgvector ("the brain") so Marketa can semantically retrieve any piece of Fruition's published material.

Also closes a feedback loop: Marketa drafts blogs → published to Sanity → re-ingested → available as reference for the next blog.

---

## 2. System map

| System | Role | Owner |
|---|---|---|
| **Sanity** | Canonical CMS — blogs, pages, voice guide | Already live |
| **Supabase pgvector** | The brain — vector store for all retrievable content | Yash (Marketa stack) |
| **n8n** | Glue layer — receives webhooks, runs ingest pipeline | Yash (Railway cloud VM) |
| **Voyage AI (`voyage-3`)** | Embedding model — text → 1024-dim vectors | Shared API key |
| **Claude API** | Marketa's reasoning engine | Brief §4.1 |
| **This Next.js repo** | Hosts `/api/sanity-ingest` receiver + Sanity Studio | fruition-landing |

---

## 3. Why webhook + n8n + pgvector (and not alternatives)

| Option | Verdict | Reason |
|---|---|---|
| **Sanity webhook → n8n → pgvector** | ✅ Chosen | Sub-minute delta, push-based, fits existing toolchain, single brain |
| Sanity Embeddings Index (hosted) | ❌ | Splits brain — brief mandates one Supabase index for Marketa + Reachly |
| Sanity MCP server (agent-direct) | ❌ as primary | Bypasses chunking, PII pass, RLS, audit log required §6.2 |
| GROQ polling | ❌ | Wasteful, laggy |
| Live Content API (SSE) | ❌ | Overkill — blog cadence is 3/week |
| Export API one-shot | ⚠️ Use only for initial seed | Stale after first run |

**Final pattern:** Export API for one-time backfill + webhook for ongoing delta.

---

## 4. Architecture

```
                    ┌──────────────────────────────┐
   write side ────▶ │   Sanity (canonical CMS)     │ ◀──── humans + Marketa drafts
                    └──────┬───────────────────────┘
                           │ webhook (GROQ filter, HMAC-signed)
                           ▼
                    ┌──────────────────────────────┐
                    │   /api/sanity-ingest         │ (this repo)
                    │   verify signature → forward │
                    └──────┬───────────────────────┘
                           ▼
                    ┌──────────────────────────────┐
                    │   n8n workflow: sanity-ingest│
                    │   1. fetch full doc          │
                    │   2. portableText→plaintext  │
                    │   3. chunk 400–600 / 50 ovlp │
                    │   4. PII NER+regex pass      │
                    │   5. Voyage voyage-3 embed   │
                    │   6. upsert content_chunks   │
                    └──────┬───────────────────────┘
                           ▼
                    ┌──────────────────────────────┐
                    │  Supabase pgvector (brain)   │
                    └──────────────────────────────┘
                           ▲
                           │ retrieval + cite
                    ┌──────┴───────────────────────┐
                    │  Marketa (Claude)            │
                    │  - retrieves chunks          │
                    │  - cites source_id           │
                    │  - resolves slug → fresh URL │
                    │    via @sanity/client        │
                    └──────────────────────────────┘
```

---

## 5. Publish flow (step by step)

1. Editor hits **Publish** in Sanity Studio.
2. Sanity fires webhook → `/api/sanity-ingest` on this site.
3. Receiver verifies HMAC signature, forwards to n8n.
4. n8n fetches full document via `@sanity/client`.
5. Converts Portable Text → plain text (`@portabletext/toolkit` `toPlainText`).
6. Splits into ~500-token chunks with 50-token overlap.
7. PII scrub pass.
8. Sends each chunk to Voyage AI → 1024-dim embedding.
9. Upserts to `content_chunks` with metadata + `source_rev`.

Delete event → `DELETE FROM content_chunks WHERE source_id = $_id`.

---

## 6. What gets indexed

GROQ filter for the webhook:

```groq
_type in [
  "page",
  "servicePage",
  "industryPage",
  "locationPage",
  "partnershipPage",
  "mondayImplementationConsultantsPage",
  "post"
]
```

**Voice guide is excluded** from vector pipeline. Fetched raw via GROQ on every Claude call → injected as system prompt. Embedding it would dilute retrieval.

**Drafts excluded.** Only published content enters the brain. Prevents Marketa citing un-approved material (governance §5.1).

---

## 7. Metadata mapping (Sanity → brain)

| Sanity field | Brain metadata column |
|---|---|
| `_id` | `source_id` |
| `_rev` | `source_rev` |
| `slug.current` | `source_path` |
| `industryPage.industry` | `metadata.industry` |
| `locationPage.region` | `metadata.region` |
| `servicePage.useCase` | `metadata.use_case` |
| (all Sanity content) | `source_type = 'sanity'` |
| (all Sanity content) | `confidentiality_level = 'public'` |

Public confidentiality bypasses RLS complexity — Sanity content is for the public website by definition.

---

## 8. Voyage AI key — what it does

Embedding provider. Turns text → 1024 numbers per chunk (the "meaning fingerprint" for semantic search).

Used twice:
- **Ingest:** every chunk during sync (one-shot per chunk).
- **Query:** every Marketa retrieval (search query gets embedded the same way).

Must use the **same key and model** as Yash's existing pipeline — otherwise embeddings drift and retrieval breaks. Cost: <$50/mo at projected volume (brief §6.2).

Stored in Doppler. Never in code, never in committed `.env`.

---

## 9. Citation contract

Every brain chunk stores `source_id` + `slug`. Marketa cite format:

```
[Source: Fruition / <title> / /<slug>]
```

At write-time, Marketa resolves URL via `@sanity/client` for current-rev body. Avoids stale cites if Sanity content was edited after embed.

---

## 10. Feedback loop (the flywheel)

```
Marketa writes blog
  → saved as Sanity draft
    → human approves (per §5.1 approval tier)
      → publish in Sanity
        → webhook fires
          → re-embedded into brain
            → available as reference for next blog
```

Marketa's own published output trains the next round. Compounds over time.

---

## 11. What needs building

| Component | Where | Owner |
|---|---|---|
| `src/app/api/sanity-ingest/route.ts` | This repo | Frontend |
| n8n workflow `sanity-ingest.json` | n8n instance | Frontend, w/ Yash review |
| `content_chunks` table + HNSW index | Supabase | Yash (likely already done) |
| Initial backfill script (Export API) | This repo, run once | Frontend |
| Sanity webhook config (GROQ filter + HMAC secret) | Sanity Studio | Frontend |

---

## 12. What's needed from Yash (handoff)

Block on these before coding:

1. **Brain schema** — `CREATE TABLE content_chunks (...)` SQL + indexes
2. **Supabase URL + service-role key** — in Doppler / 1Password
3. **n8n instance URL + admin login** — or "send me the JSON to import"
4. **Existing embed function signature** — reuse if it exists, don't rewrite
5. **Voyage AI key** — same one used for Fireflies pipeline
6. **One example row** from `content_chunks` for an existing Fireflies chunk — so the real shape is visible

Plus a status check on his progress:
- Is pgvector enabled? Brain table created?
- Is n8n connected to Supabase?
- Have any Fireflies transcripts been embedded yet?
- Any Sanity webhooks already wired?
- What's his next task — so work doesn't collide?

---

## 13. Brief alignment

| Brief section | How this integration honours it |
|---|---|
| §2.5 Shared content repository in Sanity | Sanity stays canonical; brain is mirror, not replacement |
| §4.2 Single Supabase pgvector brain | One table, one vector store — no fragmentation |
| §5.1 Tiered approval | Drafts excluded → only approved content in brain |
| §5.3 Rollback via Sanity revert | Webhook fires on delete → brain auto-cleans |
| §6.2 Centralised brain with audit + RLS | Sanity chunks marked `confidentiality_level='public'`, audit logged |
| §6.2 Voyage `voyage-3` primary | Used as-is, no custom embedding stack |
| §6.3 Sanity as context source | This integration *is* that contract |
| Phase 0 lighter than v0.1 | Sanity + React + Claude already live for solution catalogue — adds delta sync only |

---

## 14. Cost

| Item | Cost |
|---|---|
| Voyage embeddings (full Sanity content, one-time + delta) | <$5/mo |
| Webhook calls | $0 |
| n8n workflow runtime | $0 (existing Railway VM) |
| Supabase storage for chunks | Negligible (<1 GB) |

Sits comfortably within brief's $50/mo Voyage line item.

---

## 15. Open questions

- **Backfill scope:** ingest full history or last 12 months only? (Mirrors §10.2 question on Fireflies.)
- **Multi-tenant:** when Orange Growth Labs / Senzo are onboarded (Phase 4), separate Supabase project per tenant or shared instance with RLS by `tenant_id`?
- **Voice guide doc type:** confirm singleton `_type` for the upcoming Sanity voice guide (Phase 0 deliverable, §6.5) so the GROQ exclusion is exact.
- **Image-heavy pages:** servicePage / industryPage have hero images and PortableText blocks with embedded assets. Decide whether image alt-text + captions feed the brain (low cost, marginal value).

---

## 16. References

- Marketa Brief v0.2 — `/Users/gel/Desktop/Marketa Brief v0.2.pdf`
- Sanity Content Lake docs — https://www.sanity.io/docs/http-api
- Sanity webhooks — https://www.sanity.io/docs/webhooks
- Voyage AI embeddings — https://docs.voyageai.com/
- Supabase pgvector — https://supabase.com/docs/guides/database/extensions/pgvector
