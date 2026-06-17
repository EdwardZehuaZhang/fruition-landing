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

## 11b. Built in this repo — 2026-06-16

The brain read+write layer is now implemented and version-controlled:

| Component | Path | Status |
|---|---|---|
| Brain schema (pgvector + `content_chunks` + `match_content_chunks` RPC) | `supabase/migrations/20260616000000_marketa_brain.sql` | Ready to apply to the brain project |
| Embed + upsert client (Gemini `gemini-embedding-001` 768-dim, Supabase REST) | `src/lib/marketa/brain.ts` | Done |
| Sanity → plaintext → chunk logic | `src/lib/marketa/sanityIngest.ts` | Done |
| Ingest webhook receiver | `src/app/api/sanity-ingest/route.ts` | Done |
| One-shot backfill | `scripts/brain-backfill.ts` (`npm run brain:backfill`) | Done |
| Retrieval wired to real schema | `n8n/marketa-draft-blog.json` (RPC + GROQ voice guide) | Placeholders to fill on import |

**Architecture note:** unlike the original §3 sketch (route verifies → forwards to n8n for embed/upsert), ingest embedding+upsert runs in the Next.js route/script (TypeScript, testable, inspectable in Vercel logs — same rationale as the auto-docs flow). Retrieval embedding stays in n8n. Both sides call Gemini `gemini-embedding-001` (768-dim), so vectors share one space — **do not change the model on one side only.** (Switched from Voyage `voyage-3` on 2026-06-17 to use Gemini's free tier; schema is now `vector(768)`.)

**App env vars (Vercel / `.env.local`):** `GEMINI_API_KEY` (+ optional `EMBEDDING_MODEL`, `EMBEDDING_DIM`), `MARKETA_SUPABASE_URL`, `MARKETA_SUPABASE_SERVICE_ROLE_KEY`, `SANITY_WEBHOOK_SECRET`, plus existing `NEXT_PUBLIC_SANITY_*` and `SANITY_WRITE_TOKEN`. In n8n the embed node uses an `x-goog-api-key` Header Auth credential.

> The brain's Supabase vars are **namespaced `MARKETA_SUPABASE_*`** on purpose: the repo already has generic `SUPABASE_*` vars pointing at a *different* project (`vfcgltxd…`). The brain lives in its own project (`wucrgqdfyaiccacvxvpq`), so distinct names prevent the backfill/ingest from writing to the wrong database.

**Remaining to go live:** (1) apply the migration to the brain project; (2) set the app env vars; (3) `npm run brain:backfill`; (4) add a Sanity webhook → `POST /api/sanity-ingest` with the GROQ filter from §6 and the shared secret; (5) import the updated `marketa-draft-blog.json` and **deploy it in place of the "Claude-only, no brain" workflow** that is currently wired up (that brainless workflow is the root cause of the off-topic, generic drafts).

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

Board: **Website Blogs** (`5028637584`), workspace Fruition Marketing.

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
| Subitems | `subtasks_mkpsr9vr` | subtasks | Unused by pipeline |
| Timeline | `timerange_mkypnbnr` | timeline | Unused by pipeline |
| **Stage** | `dropdown_mm3jh58b` | dropdown | **Drives webhooks.** Single-select dropdown — status cols are workspace-rollup-wrapped so API-blocked; dropdown is the only working type. |
| Brief | `long_text_mm3grk84` | long_text | Marketa's idea/angle |
| Target keyword | `text_mm3gzj88` | text | SEO/AEO target |
| Industry | `dropdown_mm3gb7wm` | dropdown | RAG filter tag |
| Draft body | `long_text_mm3gj0s8` | long_text | Marketa writes here |
| Edit notes | `long_text_mm3g2bp9` | long_text | Reviewer writes here |
| Sanity doc ID | `text_mm3g4ab9` | text | Set on publish, enables in-place re-publish |
| Published URL | `link_mm3gpqq1` | link | Live URL after publish |

**Stage labels** (driver column `dropdown_mm3jh58b`). Patch via API with `{ "labels": ["<label>"] }`.

| Label | When set | Set by | Fires webhook? |
|---|---|---|---|
| Idea proposed | At creation | Marketa cron (n8n) | yes → Slack ping |
| Idea approved | Reviewer picks | Human | yes → n8n draft webhook |
| Drafting | Marketa starts | Marketa (after draft ack) | no (internal) |
| Draft ready | Marketa finishes | Marketa | yes → Slack ping |
| Edits requested | Reviewer asks for changes | Human | yes → n8n revise webhook |
| Approved to publish | Reviewer final OK | Human | yes → publish route |
| Published | Sanity write confirmed | This route | no (internal; route already pinged) |
| Stuck | Blocked | Either | no |

**Industry labels** (`dropdown_mm3gb7wm`): Construction, HR, Real Estate, Marketing, SaaS, Professional Services, Manufacturing, Product.

## B3. monday webhook config (set up in monday UI — post-deploy)

**One subscription** covers all stage transitions:

- Event: `When a column changes` (any column) → `POST https://<site>/api/webhooks/monday-blog?key=<MONDAY_WEBHOOK_SECRET>`

Route filters by `columnId === "dropdown_mm3jh58b"` and dispatches by new Stage label. Single webhook is simpler than per-label subscriptions and covers `Idea proposed` (which fires on create_item too — monday emits `change_column_value` for columns set at creation).

Auth: shared secret as `?key=` query param (existing pattern — see `src/app/api/webhooks/monday/route.ts`). monday's `change_column_value` event does not support custom Authorization headers.

**Why not API-created:** monday verifies the URL is reachable when creating a webhook via API. Endpoint must be deployed first.

## B4. monday native automations

Keep monday native automations to **non-Slack** behaviour only. Slack is owned by `/api/webhooks/monday-blog` (single source of truth).

| Trigger | Action |
|---|---|
| Stage → `Published` | Move item to `Archive` group |

If any legacy native Slack automation exists on this board → **delete it** to avoid double-pinging. The route handles Slack pings for `Idea proposed`, `Draft ready`, `Published` (see route.ts `pingHumanInLoop` + `publishToSanity`).

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
| `SLACK_SIGNING_SECRET` | Verifies Slack Event Subscription callbacks | Required for `/api/webhooks/slack-blog` |
| `SLACK_BLOG_IDEA_CHANNEL_ID` | Slack source channel for approved blog ideas | Optional; defaults to `C08VD9R6SGP` |
| `SLACK_BLOG_IDEA_TEAM_ID` | Slack workspace/team id | Optional; defaults to `T05B4T8UYV8` |
| `SLACK_BLOG_IDEA_ALLOWED_USER_IDS` | Comma-separated Slack user IDs allowed to trigger drafts | Optional; set to Josh's user ID for Josh-only triggering |
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

## B8. Slack-approved ideas

Josh's blog-request channel can bypass the weekly idea-review queue:

```
Slack channel C08VD9R6SGP
   │ message.channels event
   ▼
/api/webhooks/slack-blog
   │ verify Slack signature + optional Josh user filter
   ▼
monday item: Stage = "Drafting"
   │
   ▼
N8N_MARKETA_DRAFT_WEBHOOK_URL
   │
   ▼
Draft body + Stage = "Draft ready"
```

Slack app setup:

- Request URL: `https://<site>/api/webhooks/slack-blog`
- Bot event subscription: `message.channels`
- Bot scopes: `channels:history`, `chat:write`
- Invite the bot to channel `C08VD9R6SGP`
- Add `SLACK_SIGNING_SECRET` to the site environment
- Add `SLACK_BLOG_IDEA_ALLOWED_USER_IDS=<Josh user id>` to make it Josh-only. If omitted, any non-bot top-level message in that channel is treated as an approved idea.

Supported message format is intentionally loose. Optional labels:

```
Title: How monday.com teams can use AI agents without losing governance
Industry: SaaS
Keyword: monday.com AI agents

Angle: focus on approval checkpoints, auditability, and when to use n8n.
```

Unlabeled messages use the cleaned first line as the title, the full message as
the brief, an inferred Industry dropdown value, and a blank target keyword.

## B9. Settings locked

| Decision | Value |
|---|---|
| Reviewer | Single `People` col, same person both stages |
| Revision cap | None |
| Idea cadence | 5/week |
| Slack notifs | `/api/webhooks/monday-blog` route |
| Board | Existing `5028637584` ("Blogs"), modified in place |

## B10. Flywheel (closes Part A)

```
Marketa generates blog
  → monday draft → human approve
    → publish to Sanity (this route)
      → Sanity webhook (Part A) re-embeds into brain
        → next Marketa generation can cite this blog
```

Each cycle adds to the retrievable corpus. Compounds.

## B11. Open items

- **Josh Slack user id** — set `SLACK_BLOG_IDEA_ALLOWED_USER_IDS` once confirmed.
- **Author byline** on Sanity post — currently hardcoded `"Marketa / Fruition Editorial"`. Brief §10.2 still has this as open question.
- **n8n webhook URLs** — get from Yash and add to Doppler.
- **Cover image** — Marketa-generated or human-uploaded? Schema supports both; pipeline currently leaves it null.
- **Subitem usage** — board has Subitems column; not used by pipeline. Could be repurposed for revision history if useful later.
