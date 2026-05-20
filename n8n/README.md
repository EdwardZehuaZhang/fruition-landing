# Marketa n8n workflows

Three workflows that drive Marketa's blog pipeline. Live on Yash's n8n instance (self-hosted on the Railway cloud VM, per Brief §4.1). Versioned here so they're code-reviewable and reproducible.

## Files

| File | Trigger | What it does |
|---|---|---|
| `marketa-generate-ideas.json` | Cron — Mon 09:00 Australia/Sydney | RAG over recent published blogs + competitor gaps → calls Claude → creates 5 monday items with Stage `Idea proposed` |
| `marketa-draft-blog.json` | Webhook `POST /webhook/marketa-draft` | Triggered by `/api/webhooks/monday-blog` route when reviewer flips Stage to `Idea approved`. Fetches monday item, retrieves brain chunks by Industry, Claude writes draft, patches monday item with `Draft body` and Stage `Draft ready` |
| `marketa-revise-blog.json` | Webhook `POST /webhook/marketa-revise` | Triggered when Stage → `Edits requested`. Reads draft + edit notes, Claude revises, patches monday, clears edit notes, Stage → `Draft ready` |

## Import

In n8n UI: `Workflows → Import from File → select JSON`.

Each workflow has TODO comments marking spots that need Yash's actual values:

- `{{ SUPABASE_BRAIN_TABLE }}` — exact table name + column shape
- `{{ VOYAGE_EMBEDDING_NODE }}` — Yash's existing embed sub-workflow (don't rewrite)
- `{{ CLAUDE_CREDENTIAL_ID }}` — n8n credential id for Claude API
- `{{ MONDAY_CREDENTIAL_ID }}` — n8n credential id for monday.com API
- `{{ SUPABASE_CREDENTIAL_ID }}` — n8n credential id for Supabase

Replace before activation.

## Credentials required in n8n

| Credential | Type | Stores |
|---|---|---|
| `Anthropic Claude` | HTTP Header Auth or Anthropic node | `x-api-key: $CLAUDE_API_KEY` |
| `Voyage AI` | HTTP Header Auth | `Authorization: Bearer $VOYAGE_API_KEY` |
| `monday.com` | HTTP Header Auth | `Authorization: $MONDAY_API_TOKEN` |
| `Supabase brain` | Postgres | `MARKETA_PG_HOST` / port / db / user / pw |
| `Slack #fruition-blogs` | Slack OAuth2 | bot scopes: `chat:write`, `channels:join` |

Pull secrets via Doppler injection on the n8n container (Brief §4.1).

## Webhook URLs (set in this repo's env)

After importing draft + revise workflows, n8n shows production webhook URLs. Copy into `.env.local` / Vercel env:

```
N8N_MARKETA_DRAFT_WEBHOOK_URL=https://n8n.<railway>.app/webhook/marketa-draft
N8N_MARKETA_REVISE_WEBHOOK_URL=https://n8n.<railway>.app/webhook/marketa-revise
```

`src/app/api/webhooks/monday-blog/route.ts` reads these.

## Board reference

monday board: `5028637584` ("Blogs")

Column IDs hardcoded in the workflows (match `route.ts`):

| Col | ID |
|---|---|
| Stage (driver) | `color_mm3gj287` |
| Tier | `color_mm3gpz9w` |
| Brief | `long_text_mm3grk84` |
| Target keyword | `text_mm3gzj88` |
| Industry | `dropdown_mm3gb7wm` |
| Draft body | `long_text_mm3gj0s8` |
| Edit notes | `long_text_mm3g2bp9` |
| Sanity doc ID | `text_mm3g4ab9` |
| Published URL | `link_mm3gpqq1` |

Stage label IDs (status column uses internal numeric ids):

| Stage | Label ID |
|---|---|
| Idea proposed | 12 |
| Idea approved | 6 |
| Drafting | 7 |
| Draft ready | 1 |
| Edits requested | 8 |
| Approved to publish | 3 |
| Published | 9 |
| Stuck | 2 |

When patching stage via monday API, use either `{"label":"Drafting"}` (string) or `{"index":7}` (label id). String form is more readable; workflows use that.

## Slack channel

`#fruition-blogs` — channel id `C0B4NFVDJKY`. Native monday automation handles notifications on stage changes. n8n workflows post a confirmation message after their work finishes (optional, but useful for debugging).
