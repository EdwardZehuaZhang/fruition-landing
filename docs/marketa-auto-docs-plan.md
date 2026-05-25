# Marketa Auto-Docs + Slack Draft Reply — Implementation Plan

Author: Cowork session 2026-05-24, continuing from the slack-blog handover.

## Goal

When the Marketa pipeline transitions a blog item to Stage `Draft ready`, automatically:

1. Generate a LinkedIn post variant of the draft.
2. Create two Google Docs (full blog + LinkedIn post) in a shared "Marketa - Auto Drafts" folder, following the format of Ishani's existing examples.
3. Reply in the **original Slack request thread** (in #fruition-digital) with the title, both Doc links, and word counts.

Also fix the bug where n8n received `undefined` Title/Keyword/Industry for the 2026-05-24 test, producing an off-topic "blank brief" draft for pulse 2714465661.

## Architectural choice (approved)

Implement in the existing `src/app/api/webhooks/monday-blog/route.ts` Stage handler, **not in n8n**. Easier to test in TypeScript, easier to inspect via Vercel logs, and the route already runs on every Stage change.

## Phase 1 — Fix the n8n undefined-input bug

Root cause (suspected): the n8n `Normalize item` node fetches monday via GraphQL after slack-blog ACKs. There's a race where some retries from Slack fire n8n while monday's column writes haven't propagated, or where a separate code path bypasses the fetch.

Fix in two places, both cheap:

### 1a. `src/app/api/webhooks/slack-blog/route.ts`

Update `forwardToMarketaDraft` to pass title/brief/keyword/industry **in the webhook body** instead of just pulseId + boardId, so n8n doesn't have to round-trip to monday.

```ts
body: JSON.stringify({
  action: "draft",
  pulseId,
  boardId: BOARD_ID,
  source: "slack-blog",
  title: idea.title,
  brief: idea.brief,
  target_keyword: idea.targetKeyword,
  industry: idea.industry,
}),
```

### 1b. `n8n/marketa-draft-blog-claude.json`

Update the `Normalize item` node to prefer payload values, fall back to monday columns:

```js
const wh = $('Webhook: /marketa-draft').first().json.body || {};
const item = $input.first().json.data?.items?.[0];
const col = (id) => item?.column_values?.find(c => c.id === id);
const text = (c) => c?.text?.trim() || '';
const title = wh.title || item?.name || '';
const brief = wh.brief || text(col('long_text_mm3grk84'));
if (!brief) throw new Error('Brief column is empty');
return [{ json: {
  pulseId: String(wh.pulseId),
  title,
  brief,
  target_keyword: wh.target_keyword || text(col('text_mm3gzj88')),
  industry: wh.industry || text(col('dropdown_mm3gb7wm')) || 'general'
} }];
```

You'll need to re-import the JSON into n8n and re-activate the workflow.

### 1c. Add event_id dedup to slack-blog (small safety net)

Slack delivered our 2026-05-24 test event 4 times to the route (visible in Vercel logs). Each fire triggered an n8n run. Vercel KV is overkill; a simple in-memory `Set<string>` of recent event_ids with a TTL is enough for this throughput.

## Phase 2 — Pre-flight setup (you, not me)

Things only you can do:

### 2a. Google Cloud setup

1. In GCP console, create or reuse a project.
2. Enable Google Drive API and Google Docs API.
3. Create a Service Account named `marketa-auto-docs`.
4. Create a JSON key for it, download.
5. `base64 -i path/to/key.json | pbcopy` and add to Vercel Production env as `GOOGLE_SERVICE_ACCOUNT_JSON_B64`.

### 2b. Drive folder

1. Create a Drive folder named `Marketa - Auto Drafts` under the Fruition Marketing workspace (alongside Ishani's manual drafts folder so the AI ones are visually separated).
2. Share the folder with the service account email (looks like `marketa-auto-docs@<project>.iam.gserviceaccount.com`) as **Editor**.
3. Copy the folder ID from the URL (the part after `/folders/`) into Vercel Production env as `MARKETA_DRAFTS_FOLDER_ID`.

### 2c. Anthropic API key

If `ANTHROPIC_API_KEY` isn't already in Vercel Production env, add it. Used for the LinkedIn post generation.

### 2d. Monday board changes

DONE 2026-05-24 via monday MCP. Four columns created on board 5028637584:

| Title | Type | Column ID |
|---|---|---|
| LinkedIn post | long_text | `long_text_mm3nwhjg` |
| Blog doc URL | link | `link_mm3nw491` |
| LinkedIn doc URL | link | `link_mm3na3pz` |
| Slack origin | long_text | `long_text_mm3nthd2` |

Wired into `src/app/api/webhooks/monday-blog/route.ts` and `src/app/api/webhooks/slack-blog/route.ts`.

### 2e. Slack channel ID env var

Make sure `SLACK_BLOG_IDEA_CHANNEL_ID=C08VD9R6SGP` is in Vercel Production env (probably already set since the slack-blog route uses it as a default). The auto-docs reply will go there.

### 2f. Slack metadata on slack-originated items

So monday-blog knows which Slack message to reply to, the slack-blog route needs to store the original `(channel, ts, user)` somewhere stable. Two options:

- (A) New column `Slack origin` (long_text) holding JSON `{channel, ts, user}`. Cleaner.
- (B) Parse out of the existing `Source: …` line in the Brief column. Hackier but no new column.

Went with (A). Column `long_text_mm3nthd2`. Format stored:
`{"channel":"C0B4NFVDJKY","ts":"...","user":"U...","team":"T05B4T8UYV8"}`.

## Phase 3 — Implementation (me, after Phase 2 is done)

### 3a. Add `src/lib/googleDocs.ts`

Service-account auth wrapper around the `googleapis` package. Two exports:

- `createDraftDoc(folderId, title, body): Promise<{docId, docUrl}>` — creates a Google Doc, returns the share URL.
- `createSubfolder(parentId, name): Promise<string>` — creates `YYYY-MM-DD — <Title>` subfolder, returns its ID.

Depends on `googleapis` and `google-auth-library`. New package.json deps.

### 3b. Add `src/lib/marketaLinkedIn.ts`

Single function `generateLinkedInPost({title, draft, industry, targetKeyword}): Promise<string>`. Calls Anthropic Messages API with a system prompt that mirrors Ishani's example tone: 150–250 words, emoji bullets, hook → checklist → soft CTA, Fruition voice.

### 3c. Extend `src/app/api/webhooks/monday-blog/route.ts`

In the existing `case STAGE_DRAFT_READY` branch (already there):

1. Read columns: name (title), Draft body, Target keyword, Industry, Slack origin.
2. If Slack origin is set (i.e. item came from slack-blog), then:
   - Generate LinkedIn post via `generateLinkedInPost`.
   - Patch monday: write LinkedIn post to its column.
   - Create `YYYY-MM-DD — <title>` subfolder in `MARKETA_DRAFTS_FOLDER_ID`.
   - Create Doc 1 (full blog) — format: H1 title, "Meta description: <todo>", "AI Checks / Grammarly / Plagiarism — TODO add screenshots before publish", body content from Draft body, `Word Count: N`.
   - Create Doc 2 (LinkedIn) — title, LinkedIn body, `Word Count: N`.
   - Patch monday: write both doc URLs to their columns.
   - Post Slack thread reply in #fruition-digital on `slack_origin.ts`:
     ```
     :memo: Draft ready: *<title>*
     • <doc1_url|Blog draft (N words)>
     • <doc2_url|LinkedIn post (N words)>
     :label: <industry>
     ```
3. If Slack origin is NOT set (i.e. came from the regular monday Stage → Idea approved flow), do **nothing new** — the existing `#fruition-blogs` notification continues as today.

### 3d. Update `src/app/api/webhooks/slack-blog/route.ts`

Write the Slack origin JSON to the new `Slack origin` column at item creation time.

## Phase 4 — Verify

1. Edward sends a top-level test in #fruition-digital.
2. Watch Vercel logs for slack-blog 200 → n8n call → monday-blog Stage transitions.
3. Confirm new monday item has populated: Title, Brief, Keyword, Industry, Stage, LinkedIn post, Blog doc URL, LinkedIn doc URL, Slack origin.
4. Confirm two Docs created in `Marketa - Auto Drafts` subfolder.
5. Confirm Slack thread reply on the original message.

## Estimated effort

- Phase 1: 30 min implementation + n8n re-import (you) + redeploy.
- Phase 2: 30 min for you (GCP + Drive + Vercel env + monday columns).
- Phase 3: 90 min implementation + tests.
- Phase 4: 15 min.

Total ~3 hours, gated on Phase 2 user setup.

## What I'll do next if you say go

Start Phase 1 right now (slack-blog payload, n8n JSON, event_id dedup). Phase 1 doesn't need any setup from you. Then I'll pause and wait for Phase 2 to be done before touching Phase 3.

---

## Status — 2026-05-24 ~13:30 UTC

- **Phase 1**: shipped in commit `77067a6` (Edward pushed).
- **Phase 2a (n8n re-import)**: live workflow `Wtqe7VaAD0P0DDdv` on `fruitionservices.app.n8n.cloud` was patched via the n8n REST API. Verified `wh.title` / `wh.brief` fallback is active.
- **Phase 2d (monday columns)**: DONE via MCP; IDs above.
- **Phase 2 GCP / Drive / Vercel-env**: blocked on Edward — `console.cloud.google.com`, `drive.google.com`, and `vercel.com` are not reachable from the Cowork browser tool. See `docs/phase2-handoff.md` for the click-by-click.
- **Phase 3 code**: DONE in working tree. Files added: `src/lib/googleDocs.ts`, `src/lib/marketaLinkedIn.ts`. Files extended: `src/app/api/webhooks/monday-blog/route.ts` (new `handleDraftReady` dispatcher + `autoDocsForSlackOrigin`), `src/app/api/webhooks/slack-blog/route.ts` (writes Slack origin column at item creation). `package.json` adds `googleapis` + `google-auth-library`. **Run `npm install` after pulling.**
- **Phase 4 smoke test**: blocked on Phase 2 env vars being present in Vercel Production.
