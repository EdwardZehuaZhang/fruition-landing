# Marketa make.com scenarios

make.com ports of the four n8n workflows in `../n8n/` that drive Marketa's blog pipeline. Same board, same column IDs, same prompts, same Claude model — only the runtime changes. The `-claude` ("no brain") n8n variants are intentionally **not** ported; these blueprints carry the production RAG/brain logic paths.

## Scenarios

| File | Trigger | What it does |
|---|---|---|
| `marketa-generate-ideas.json` | Scheduled — daily 09:00 Australia/Sydney | Supabase (PostgREST) pulls last 30 days of sanity-sourced chunks → text-aggregated into `recent_context` → Claude generates 5 ideas as JSON → iterator creates 5 monday items with Stage `Idea proposed` |
| `marketa-draft-blog.json` | Custom webhook (replaces `POST /webhook/marketa-draft`) | monday fetch → normalize (webhook body wins, monday is fallback) → **responds 200 immediately** → Gemini embed (768-dim) → `match_content_chunks` RPC (top 8) → Sanity GROQ voice guide → Claude drafts with web_search → full draft saved to `blog_drafts` → monday patched with draft + Stage `Draft ready` |
| `marketa-revise-blog.json` | Custom webhook (replaces `POST /webhook/marketa-revise`) | monday fetch → guard (422 if draft or edit notes missing) → Sanity voice guide → Claude revises → monday patched with revised text, **edit notes cleared**, Stage `Draft ready` → responds 200 with `{ok, pulseId}` |
| `marketa-publish-social.json` | Custom webhook (replaces `POST /marketa-publish-social`) | Build Ayrshare body → `POST https://api.ayrshare.com/api/post` → responds 200 with Ayrshare id/status |

Board `5028637584` ("Website Blogs") and every column ID (`dropdown_mm3jh58b` Stage, `long_text_mm3grk84` Brief, `text_mm3gzj88` Target keyword, `dropdown_mm3gb7wm` Industry, `long_text_mm3gj0s8` Draft body, `long_text_mm3g2bp9` Edit notes) are identical to the n8n workflows and `src/app/api/webhooks/monday-blog/route.ts`. Stage is a **dropdown** — patches use `{ "labels": ["Draft ready"] }`, never `{ "label": ... }`.

## How to import

1. make.com → **Scenarios → Create a new scenario → ⋯ (More) → Import Blueprint** → select the JSON file.
2. Repeat per file (4 scenarios).
3. Complete the post-import configuration below, then turn each scenario **ON**.

The blueprints validate against Make's blueprint schema (checked via the Make MCP `validate_blueprint_schema` tool), but Make may still reset unrecognized module parameters on import — open each module once after importing and confirm the mapped fields survived.

## Secrets / placeholders — replace BEFORE import

Make has no n8n-style credential store for plain HTTP modules, and `{{...}}` is also Make's expression syntax, so these placeholders must be find-and-replaced in the JSON **before** importing (or swapped for `{{var.NAME}}` team custom variables if your Make plan has them):

| Placeholder | Where it lives in n8n today | Used by |
|---|---|---|
| `{{CLAUDE_API_KEY}}` | `Anthropic Claude` credential (`x-api-key`) | generate-ideas, draft, revise |
| `{{MONDAY_API_TOKEN}}` | `monday.com` credential (`Authorization`) | generate-ideas, draft, revise |
| `{{GEMINI_API_KEY}}` | `Gemini` credential (`x-goog-api-key`) | draft |
| `{{SUPABASE_URL}}` | — (n8n connected to Postgres directly) | generate-ideas, draft. `https://<project-ref>.supabase.co` of the brain project |
| `{{SUPABASE_SERVICE_ROLE_KEY}}` | — (n8n used the `Supabase brain` Postgres credential) | generate-ideas, draft. Service-role key, since PostgREST replaces the direct DB connection |
| `{{SANITY_PROJECT_ID}}` / `{{SANITY_DATASET}}` | same placeholders in n8n | draft, revise. If the dataset is private, also add an `Authorization: Bearer <token>` header to the voice-guide HTTP modules |
| `{{AYRSHARE_API_KEY}}` | `Ayrshare API` credential | publish-social |
| `{{MARKETA_DRAFT_HOOK_ID}}` / `{{MARKETA_REVISE_HOOK_ID}}` / `{{MARKETA_PUBLISH_SOCIAL_HOOK_ID}}` | n8n webhook paths | Webhook IDs — you don't hand-edit these; Make prompts you to create/select a webhook on import (see below) |

Secrets end up embedded in scenario module fields, not in a vaulted credential — consider marking the scenarios **confidential** (scenario settings) so run logs don't retain header values.

## Post-import configuration

### 1. Webhooks (draft / revise / publish-social)

On import Make asks you to attach a webhook to each `Custom webhook` module — create a new one (name it `marketa-draft`, `marketa-revise`, `marketa-publish-social`). Make generates opaque URLs like `https://hook.eu1.make.com/abc123...`; there is no path-based naming like n8n's `/webhook/marketa-draft`.

Copy the generated URLs into `.env.local` / Vercel env, replacing the n8n URLs (the env var names stay the same — `src/app/api/webhooks/monday-blog/route.ts` and `slack-blog/route.ts` read them):

```
N8N_MARKETA_DRAFT_WEBHOOK_URL=https://hook.eu1.make.com/<draft-hook>
N8N_MARKETA_REVISE_WEBHOOK_URL=https://hook.eu1.make.com/<revise-hook>
```

The publish-social webhook URL only matters if you point the Slack interactivity route's publish step at it (it is an optional alternative path, same as in n8n).

In each webhook's settings set **Data structure: determined automatically**, then send one sample POST (e.g. `{"pulseId": "123", "title": "t", "brief": "b", "target_keyword": "k", "industry": "SaaS"}`) so Make learns the payload fields — the downstream mappings reference `pulseId`, `title`, `brief`, `target_keyword`, `industry` (draft), `pulseId` (revise), and the Ayrshare fields (publish-social).

### 2. Schedule (generate-ideas)

Blueprints don't carry schedules, so set it in the scenario's **Schedule** panel after import:

- Run scenario: **Every day**, **09:00**
- Scenario/organization **timezone: Australia/Sydney** (Make evaluates the time in the org timezone — n8n carried `timezone: Australia/Sydney` inside the workflow; here it's an account/scenario setting)

Equivalent API scheduling object (validates against Make's scheduling schema): `{"type": "daily", "time": "09:00"}`.

### 3. Scenario settings

For draft and revise, enable **Allow storing of incomplete executions** (scenario settings) — the `Break` (Retry) error handlers need it; without it a failed Claude/monday call just errors out instead of parking the run for retry. Also note the **maximum execution time**: 5 min on Free, 40 min on paid plans. An 8000-token Opus draft with web search can approach the 5-minute cap — run these scenarios on a paid Make plan (as the n8n Railway box effectively had no cap).

### 4. Response behavior (intentional differences kept faithful to n8n)

- **draft**: responds `200 {ok, accepted, pulseId}` right after normalizing, *before* the slow embed→RAG→Claude chain — mirrors n8n's `responseMode: onReceived` so the Vercel route never blocks on generation.
- **revise**: responds only at the end with `{ok, pulseId}` — mirrors n8n's `responseNode`. Missing draft/edit notes now returns a clean `422` instead of n8n's thrown error (which surfaced as a 500).
- **publish-social**: responds `200` with the Ayrshare id/status after posting (n8n returned immediately with no body; the callers treat it as fire-and-forget either way).

## Error handling map

| n8n behavior | make.com equivalent in these blueprints |
|---|---|
| Node fails → execution errors, visible in n8n executions list | `Break` (Retry) error handler on every Claude / monday / Supabase / Gemini / Ayrshare HTTP call → failed runs park as *incomplete executions* for auto/manual retry |
| One bad idea kills the remaining monday creates (generate-ideas) | `Ignore` handler on the per-item monday create — a failed item is skipped, the other 4 still get created |
| Draft workflow proceeds without voice guide only if node succeeds | `Resume` handler on both Sanity voice-guide fetches substitutes `"(no voice guide)"` and keeps going |
| `throw new Error('no existing draft…')` in revise | Router guard route → `422` webhook response |
| Claude returns non-JSON in generate-ideas → thrown error | `Parse JSON` module errors → run fails visibly in Make's execution log (same net effect) |

## Migration gaps (things that don't carry over 1:1)

1. **No direct Postgres access.** Make's HTTP-only path replaces n8n's Postgres nodes with Supabase PostgREST: `GET /rest/v1/content_chunks` (recent blogs), `POST /rest/v1/rpc/match_content_chunks` (RAG), `POST /rest/v1/blog_drafts?on_conflict=monday_item_id` with `Prefer: resolution=merge-duplicates` (full-draft upsert, `updated_at` set explicitly to `now`). Requires the service-role key. Make *does* have a PostgreSQL app if you'd rather keep direct SQL — swap the three HTTP modules and create a Make Postgres connection with the `MARKETA_PG_*` values.
2. **Recent-blogs query was already a TODO in n8n** (`{{ SUPABASE_BRAIN_TABLE }}`, and it selected a `title` column that `content_chunks` doesn't have). The Make port queries `content_chunks` per the fixed brain schema and reads `title`/`industry` from `metadata`, falling back to `source_path` — verify the ingest actually writes `metadata.title`, or adjust the `select=` in module 1.
3. **Revise voice guide now comes from Sanity GROQ**, not the n8n workflow's stale `SELECT … WHERE source_type='voice_guide'` (the brain intentionally never contained the voice guide, so that n8n query returned nothing). This is a fix, not a regression — it matches the draft workflow and `n8n/README.md`.
4. **Webhook URLs are opaque** (`hook.eu1.make.com/<random>`); you can't keep the `/webhook/marketa-draft` paths. Only the env var values change, not the app code.
5. **No code nodes.** All JS from n8n became Make functions: `map()/first()` for monday column lookup, `ifempty()` fallback chains for the webhook-body-vs-monday race, `join(map(content; "text"; "type"; "text"))` to concatenate Claude text blocks around web_search blocks, `replace()` regexes for ```json fence stripping, and double `Transform to JSON` for monday's stringified `column_values`. The one behavioral nuance: n8n's revise treated whitespace-only draft/notes as missing; Make's `exist` filter only catches null/absent — a draft of `" "` would slip through the guard.
6. **[Source N] numbering** uses an `Increment` module inside the chunk iteration. It resets per scenario run — if you ever change the flow so two iterators share the run, renumbering starts where the first left off.
7. **Ayrshare optional fields serialize as `null`** instead of being omitted (n8n's code node dropped the keys). Ayrshare ignores null fields, but if it ever complains, either enable the webhook's *JSON pass-through* and send the raw payload, or split the HTTP call behind a router keyed on which optional fields exist.
8. **Timezone lives in account/scenario settings**, not the blueprint — if the Make org isn't set to Australia/Sydney, the daily 09:00 schedule fires in the wrong timezone.
9. **Execution-time cap** (5 min Free / 40 min paid) has no n8n equivalent — long Opus drafts need a paid plan (see §3 above).
10. **Ops-based billing:** one draft run consumes ~20 operations (modules × chunk iterations). At Free-plan 1,000 ops/month this supports only ~40–50 drafts plus the daily ideas runs (~11 ops/day, ~330/month on their own) — budget accordingly.
