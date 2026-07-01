# Social Publishing (Ayrshare) — Phase 1 Setup Runbook

**Status:** Phase 1 scaffolded (2026-06-22) · **Owners:** Edward, Nikhil
**Plan:** `docs/social-publishing-plan.md` · **Handover:** `handover-social-publishing.md`

This is the operator runbook for turning the scaffolded code on. The code is
**dormant until you create the Ayrshare account and add the API key** — approval
clicks before then surface a clear "AYRSHARE_API_KEY not set" message instead of
posting anything.

## Decisions locked for v1

- **Channels:** LinkedIn, X, Instagram, YouTube, Pinterest (all five). Text
  channels (LinkedIn, X) work immediately; visual channels (Instagram,
  Pinterest, and YouTube) need the **Phase 2 media step** before they can
  actually publish — they generate text fine but Ayrshare rejects a media post
  with no media.
- **Approval surface:** Slack buttons (Approve / Edit / Skip per channel).
- **Media source (Phase 2):** reuse the blog hero image.
- **Plan tier:** Premium (~$149/mo) — Fruition posts on its own channels (one
  profile, all networks). Confirm against the final channel count at signup.

> Want to launch text-only first? Set `MARKETA_SOCIAL_CHANNELS=linkedin,x` in
> Vercel env. Unset = all five.

## How the flow works

```
monday Stage → "Ready to socialise"
  → /api/webhooks/monday-blog  (existing webhook, new stage handler)
      • pulls the full draft (Supabase blog_drafts, falls back to monday)
      • generates one variant per channel (Fruition voice, OpenRouter)
      • saves variants to Supabase social_variants
      • posts ONE Slack card to #fruition-blogs with Approve/Edit/Skip per channel
  → human clicks Approve on a channel
  → /api/webhooks/slack-interactivity  (new route)
      • re-reads that channel's variant
      • calls Ayrshare /post for that one channel
      • updates the Supabase row + swaps that channel's row in the Slack card
```

Publishing runs in the Next.js route (where Slack button clicks land), matching
the existing auto-docs pattern. `n8n/marketa-publish-social.json` is an
**optional** alternative if you'd rather centralise the Ayrshare call in n8n.

## New / changed files

| File | What |
|---|---|
| `src/lib/marketa/ayrshare.ts` | Ayrshare `/post` client. Dormant without `AYRSHARE_API_KEY`. |
| `src/lib/marketa/socialVariants.ts` | Per-channel variant generators (X/IG/YT/Pinterest); LinkedIn reuses the existing generator. |
| `src/lib/marketa/socialSlackBlocks.ts` | Approval Block Kit (interactive Approve/Edit/Skip). |
| `src/lib/marketa/socialStore.ts` | Read/write `social_variants` (Supabase). |
| `src/app/api/webhooks/monday-blog/route.ts` | New `Ready to socialise` stage handler. |
| `src/app/api/webhooks/slack-interactivity/route.ts` | Handles button clicks → publish. |
| `supabase/migrations/20260622000000_social_variants.sql` | Variant store table. |
| `n8n/marketa-publish-social.json` | Optional n8n publish path. |

## Setup steps (in order)

### 1. Ayrshare account + channels

1. Sign up at https://www.ayrshare.com and choose **Premium**.
2. In the dashboard, link Fruition's channels under **Social Accounts**:
   LinkedIn, Instagram, YouTube, Pinterest (and X, see step 2).
3. Copy the **API Key** from the Developer dashboard → API Key page.

### 2. X / Twitter bring-your-own keys (only if posting to X)

Since 2026-03-31 Ayrshare requires your own X credentials. One X Developer app,
reused for every post:

1. Create an app at https://developer.x.com, get the **API Key (Consumer Key)**
   and **API Key Secret**.
2. Link X in the Ayrshare dashboard, then set `AYRSHARE_X_API_KEY` /
   `AYRSHARE_X_API_SECRET`. Without these, X errors while the other channels
   still publish.

### 3. Environment variables (Vercel + `.env.local`)

```
AYRSHARE_API_KEY=          # from step 1
AYRSHARE_X_API_KEY=        # optional, step 2
AYRSHARE_X_API_SECRET=     # optional, step 2
# MARKETA_SOCIAL_CHANNELS=linkedin,x   # optional: text-only launch
# SOCIAL_SLACK_CHANNEL=                # optional: dedicated approval channel
```

Reuses existing env already in place: `OPENROUTER_API_KEY`, `SLACK_BOT_TOKEN`,
`SLACK_SIGNING_SECRET`, `MARKETA_SUPABASE_URL`,
`MARKETA_SUPABASE_SERVICE_ROLE_KEY`, `MONDAY_API_TOKEN`, `MONDAY_WEBHOOK_SECRET`.

### 4. Supabase migration

Apply `supabase/migrations/20260622000000_social_variants.sql` to the **Marketa**
Supabase project (`wucrgqdfyaiccacvxvpq`), e.g. via the Supabase SQL editor or
`supabase db push`.

### 5. monday board

Add a **`Ready to socialise`** label to the Stage dropdown (`dropdown_mm3jh58b`)
on board `5028637584`. Flipping an item to that stage triggers variant
generation. (No new columns needed — variants live in Supabase.)

### 6. Slack app — enable Interactivity

The approval buttons need an interactivity endpoint:

1. Slack app (Fruition Bot, `A0B3XJFBSAG`) → **Interactivity & Shortcuts** → On.
2. **Request URL:** `https://fruition-landing-wheat.vercel.app/api/webhooks/slack-interactivity`
3. No new scopes needed beyond the existing `chat:write` (used for `chat.update`).

### 7. Smoke test (before paying for Ayrshare)

With `AYRSHARE_API_KEY` **blank**, flip a finished blog item to `Ready to
socialise`. You should get the Slack approval card with generated variants.
Clicking **Approve** replaces that row with a `:lock: not published —
AYRSHARE_API_KEY not set` message — confirming the wiring end-to-end without
spending a cent. Then add the key and re-test with one text channel.

## Phase 2 — media (the hard part)

Instagram and Pinterest require a `mediaUrls` entry; YouTube needs a video. The
handler currently sends empty media (`mediaUrls: []`). To finish visual
channels, implement the hero-image resolver in the `handleReadyToSocialise`
handler (marked with a `Phase 2 media step` comment) to pull the blog's Sanity
hero image URL, and pass it into `upsertVariants` + the publish call. Until then,
keep `MARKETA_SOCIAL_CHANNELS=linkedin,x` to avoid visual-channel publish errors.

## Phase 3 — scheduling & analytics

`publishToAyrshare` already accepts `scheduleDate` (UTC `YYYY-MM-DDThh:mm:ssZ`).
Add a scheduling UI/column and an Ayrshare analytics/history pull-back into
monday for reporting.

## Risks / notes

- **Idempotency:** publish uses key `"<pulseId>:<channel>"`, so a double-click
  won't double-post. To intentionally re-publish a channel, change the variant
  (the `status` guard also short-circuits an already-published channel).
- **Slack 3s timeout:** publishing happens inline; Ayrshare is usually 1–3s. If
  Slack times out the click, the post still completes and `chat.update` reflects
  the result — re-clicking is safe due to idempotency.
- **Channel auth upkeep:** social tokens expire; Ayrshare reconnects most, but
  YouTube/Instagram occasionally need a manual re-auth in the dashboard.
