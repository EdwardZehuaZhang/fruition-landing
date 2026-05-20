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

---

# Part B — Marketa Blog Pipeline (monday board → Sanity)

Sibling to Part A. Part A pulls Sanity into the brain (read side). Part B drives blog production through a monday board with two human checkpoints and writes the approved post back to Sanity (write side).

## B1. Flow

```
Marketa cron (5 ideas/wk)
   │
   ▼ POST monday API: create_item × N, Stage = "Idea proposed"
┌─────────────────────────────────────────────────┐
│ monday board: "Blogs" (id 5028637584)          │
│ Group: Active pipeline                          │
└──────┬──────────────────────────────────────────┘
       │ Stage change webhook
       ▼
/api/webhooks/monday-blog?key=SECRET (this repo)
       │ dispatches by new Stage value
       ├── "Idea approved"     → POST n8n marketa-draft webhook
       ├── "Edits requested"   → POST n8n marketa-revise webhook
       └── "Approved to publish" → upsertBlogPost (Sanity) + write back to monday
                                          │
                                          ▼
                                  Sanity webhook (Part A)
                                          │
                                          ▼
                                  Brain re-embed + website auto-revalidate
```

## B2. monday board state (live)

Board: **Blogs** (`5028637584`), workspace Fruition Marketing.

**Groups**

| ID | Title | Purpose |
|---|---|---|
| `topics` | Active pipeline | In-flight items |
| `group_mm3gm3rn` | Archive | Auto-move target for Published |

**Columns** (created by setup, IDs are stable)

| Column | ID | Type | Purpose |
|---|---|---|---|
| Name | `name` | name | Working title |
| People | `person` | people | Reviewer (Nikhil default, Josh fallback per §7) |
| Status | `status` | status | (legacy — leave for back-compat, not used by pipeline) |
| **Stage** | `color_mm3gj287` | status | **Drives webhooks** |
| Tier | `color_mm3gpz9w` | status | Approval tier per §5.1 |
| Brief | `long_text_mm3grk84` | long_text | Marketa's idea/angle |
| Target keyword | `text_mm3gzj88` | text | SEO/AEO target |
| Industry | `dropdown_mm3gb7wm` | dropdown | RAG filter tag |
| Draft body | `long_text_mm3gj0s8` | long_text | Marketa writes here |
| Edit notes | `long_text_mm3g2bp9` | long_text | Reviewer writes here |
| Sanity doc ID | `text_mm3g4ab9` | text | Set on publish, enables in-place re-publish |
| Published URL | `link_mm3gpqq1` | link | Live URL after publish |

**Stage labels** (driver column `color_mm3gj287`)

| ID | Label | Index | When set | Set by |
|---|---|---|---|---|
| 12 | Idea proposed | 0 | At creation | Marketa cron |
| 6 | Idea approved | 1 | Reviewer picks | Human → fires draft webhook |
| 7 | Drafting | 2 | Marketa starts | Marketa (after draft webhook ack) |
| 1 | Draft ready | 3 | Marketa finishes | Marketa |
| 8 | Edits requested | 4 | Reviewer asks for changes | Human → fires revise webhook |
| 3 | Approved to publish | 5 | Reviewer final OK | Human → fires publish |
| 9 | Published | 6 | Sanity write confirmed | This route |
| 2 | Stuck | 7 | Blocked | Either |

**Tier labels** (`color_mm3gpz9w`): Auto / Light-touch / Explicit / Dual-approval.

**Industry labels** (`dropdown_mm3gb7wm`): Construction, HR, Real Estate, Marketing, SaaS, Professional Services, Manufacturing, Product.

## B3. monday webhook config (set up in monday UI — post-deploy)

Three subscriptions, **all on the `Stage` column, all to the same endpoint**:

1. When Stage changes to `Idea approved` → `POST https://<site>/api/webhooks/monday-blog?key=<MONDAY_WEBHOOK_SECRET>`
2. When Stage changes to `Edits requested` → same URL
3. When Stage changes to `Approved to publish` → same URL

Auth: shared secret as `?key=` query param (existing pattern — see `src/app/api/webhooks/monday/route.ts`). monday's `change_column_value` event does not support custom Authorization headers.

**Why not API-created:** monday verifies the URL is reachable when creating a webhook via API. Endpoint must be deployed first. Tried and confirmed via MCP — returns 500 until live.

## B4. monday native automations (no code)

| Trigger | Action |
|---|---|
| Stage → `Draft ready` | Notify `People` col + post to Slack `#fruition-blogs` (`C0B4NFVDJKY`) |
| Stage → `Edits requested` | Notify Marketa system user |
| Stage → `Approved to publish` | Notify reviewer "publishing started" |
| Stage → `Published` | Move item to `Archive` group |

Configure in monday board → Automations. Native Slack integration handles the notifications; no code needed from this repo. monday's API does not expose `create_automation`, so these must be set up in the UI.

## B5. Repo code

**Webhook route** — `src/app/api/webhooks/monday-blog/route.ts`
- Mirrors `monday/route.ts` (same auth, same shape).
- Dispatches by new Stage value.
- For `Approved to publish`: calls `upsertBlogPost`, writes Sanity doc id + published URL back to monday, flips Stage to `Published`.
- For `Idea approved` / `Edits requested`: forwards to n8n (Marketa-side work).

**Sanity write helper** — `src/lib/sanityWriteClient.ts` → `upsertBlogPost(input)`
- Stable `docId` (`blog-monday-<pulseId>`) so re-publish updates in place.
- Cheap markdown → PortableText (handles `#`/`##`/`###` headings + paragraphs).
- Stores `mondayItemId` on the Sanity doc for round-trip linking.

**Sanity schema** — `src/sanity/schemas/blogPost.ts`
- Added `industry` (matched to monday dropdown values) and `mondayItemId` (read-only round-trip link).

## B6. Required env vars

| Var | Purpose | Notes |
|---|---|---|
| `MONDAY_WEBHOOK_SECRET` | Shared secret for `?key=` query auth | Reuse existing |
| `MONDAY_API_TOKEN` | Server-side monday GraphQL auth (for write-back) | Reuse existing |
| `SANITY_WRITE_TOKEN` | Sanity dataset write | Reuse existing |
| `N8N_MARKETA_DRAFT_WEBHOOK_URL` | n8n entry for drafting | **New** — get from Yash |
| `N8N_MARKETA_REVISE_WEBHOOK_URL` | n8n entry for revisions | **New** — get from Yash |
| `NEXT_PUBLIC_SITE_URL` | Used to build `Published URL` written back to monday | Reuse existing |

## B7. n8n workflows (versioned in this repo)

Workflow JSON lives in `/n8n/`. Import via n8n UI → Workflows → Import from File. See `n8n/README.md` for credential setup and placeholder substitutions.

| Workflow | Trigger | What it does |
|---|---|---|
| `marketa-generate-ideas.json` | Cron Mon 09:00 Australia/Sydney, 5 items/wk | Postgres query recent blogs → Claude generates 5 idea objects → creates monday items with Stage `Idea proposed` → Slack notify |
| `marketa-draft-blog.json` | Webhook `POST /webhook/marketa-draft` | Fetch monday item → embed query (Voyage) → pgvector retrieve top-8 chunks filtered by Industry → fetch voice guide → Claude writes 2000+ word draft → PATCH monday `Draft body` + Stage `Draft ready` |
| `marketa-revise-blog.json` | Webhook `POST /webhook/marketa-revise` | Fetch monday item draft + notes → fetch voice guide → Claude revises → PATCH monday, clear edit notes, Stage → `Draft ready` |

Placeholders inside the JSON files marked `{{ SUPABASE_BRAIN_TABLE }}`, `{{ CLAUDE_CREDENTIAL_ID }}`, etc. — Yash fills these in n8n when importing (his brain schema, his credentials).

This repo never calls Claude or Voyage directly. n8n owns Marketa's reasoning side.

## B8. Settings locked

| Decision | Value |
|---|---|
| Reviewer | Single `People` col, same person both stages |
| Revision cap | None |
| Idea cadence | 5/week |
| Slack notifs | monday native automation |
| Board | Existing `5028637584` ("Blogs"), modified in place |

## B9. Flywheel (closes Part A)

```
Marketa generates blog
  → monday draft → human approve
    → publish to Sanity (this route)
      → Sanity webhook (Part A) re-embeds into brain
        → next Marketa generation can cite this blog
```

Each cycle adds to the retrievable corpus. Compounds.

## B10. Open items

- **Slack channel name** for `#marketa-blog` — confirm or replace.
- **Author byline** on Sanity post — currently hardcoded `"Marketa / Fruition Editorial"`. Brief §10.2 still has this as open question.
- **n8n webhook URLs** — get from Yash and add to Doppler.
- **Cover image** — Marketa-generated or human-uploaded? Schema supports both; pipeline currently leaves it null.
- **Subitem usage** — board has Subitems column; not used by pipeline. Could be repurposed for revision history if useful later.
