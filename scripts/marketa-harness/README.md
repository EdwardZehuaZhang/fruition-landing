# Marketa harness (CLI + local webhook server)

Lightweight stand-in for the eventual n8n + Supabase brain stack. Lets you test the monday → blog draft → revise flow today, before Yash's Marketa is live.

**What's stubbed / missing vs production:**

- ❌ No RAG retrieval (no brain yet). Drafts written from Brief + voice guide + Claude's general knowledge only.
- ❌ No Voyage embeddings.
- ❌ Voice guide is hardcoded in `lib/voice-guide.ts` (replace with Sanity GROQ fetch once `voiceGuide` doc type ships).
- ✅ All monday interactions are real (creates ideas, patches drafts, flips stages).
- ✅ Sanity publish flow unchanged — handled by `/api/webhooks/monday-blog` route.

## Setup

Env vars required (already in `.env.local`):
- `CLAUDE_API_KEY`
- `MONDAY_API_TOKEN`

Optional:
- `MARKETA_HARNESS_PORT` (defaults to `4242`)

## Run

Three CLI scripts + one local Express listener.

```bash
# 1) Generate 5 ideas → monday board
pnpm marketa:ideas

# 2) Draft a blog for a specific monday item (pulseId from URL)
pnpm marketa:draft -- 1234567890

# 3) Revise a draft after reviewer adds Edit notes
pnpm marketa:revise -- 1234567890

# 4) Run local Express listener (mirrors n8n webhooks)
pnpm marketa:listen
```

## Manual test flow (no listener)

1. `pnpm marketa:ideas` → 5 new monday items appear with Stage `Idea proposed`
2. Pick one in the board UI, flip Stage to `Idea approved`
3. Copy pulseId from the item URL
4. `pnpm marketa:draft -- <pulseId>` → draft appears in Draft body, Stage → `Draft ready`
5. Add edit notes in the Edit notes column, flip Stage to `Edits requested`
6. `pnpm marketa:revise -- <pulseId>` → revised draft, Stage → `Draft ready`
7. Reviewer flips Stage to `Approved to publish` → `/api/webhooks/monday-blog` (deployed) publishes to Sanity

## Automated test flow (with listener + ngrok)

1. `pnpm marketa:listen` (terminal 1)
2. `ngrok http 4242` (terminal 2) — copy the public URL
3. Set in `.env.local`:
   ```
   N8N_MARKETA_DRAFT_WEBHOOK_URL=https://<ngrok>/webhook/marketa-draft
   N8N_MARKETA_REVISE_WEBHOOK_URL=https://<ngrok>/webhook/marketa-revise
   ```
4. Deploy the Next.js webhook route (or run `pnpm dev` + tunnel that too)
5. Configure monday webhooks pointing at the deployed `/api/webhooks/monday-blog` route
6. Now every Stage flip in monday triggers the harness automatically

## Swapping the harness for Yash's n8n

When Yash's n8n workflows go live:

1. Replace the env vars `N8N_MARKETA_DRAFT_WEBHOOK_URL` / `N8N_MARKETA_REVISE_WEBHOOK_URL` with his n8n production webhook URLs.
2. Stop the harness server (`Ctrl+C`).
3. Delete `scripts/marketa-harness/` if you want it gone, or keep it as a local dev fallback.

Nothing else changes — the webhook route is agnostic to whether it's hitting the harness or n8n.

## Files

| File | Purpose |
|---|---|
| `generate-ideas.ts` | One-shot: query recent published titles, ask Claude for 5 new ideas, create monday items |
| `draft.ts <pulseId>` | One-shot: fetch monday item, draft via Claude, patch Draft body, flip Stage |
| `revise.ts <pulseId>` | One-shot: fetch draft + notes, revise via Claude, patch + clear notes, flip Stage |
| `server.ts` | Express listener on `:4242` — receives `/webhook/marketa-draft` and `/webhook/marketa-revise`, spawns the matching CLI script |
| `lib/claude.ts` | Anthropic SDK wrapper: `generateIdeas`, `writeDraft`, `reviseDraft` |
| `lib/monday.ts` | monday GraphQL helpers tied to board `5028637584` with all column IDs |
| `lib/voice-guide.ts` | Hardcoded voice guide stub — swap for Sanity GROQ once `voiceGuide` doc ships |
