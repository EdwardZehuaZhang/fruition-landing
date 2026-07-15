# Deployed Make.com scenarios — 2026-07-15

Imported via Make MCP into org **My Organization** (7154194, eu1, Free plan), team **My Team** (1388225), account **edward@fruitionservices.io**. All four are **OFF** — see "Remaining steps".

| Scenario | ID | Webhook |
|---|---|---|
| Marketa — generate blog ideas (daily) | 6574794 | — (scheduled: daily, 09:00) |
| Marketa — draft blog | 6574831 | `https://hook.eu1.make.com/xyc8c1b69i6r86b63si7c5zpov2b3cfb` (hook 3397272, `marketa-draft`) |
| Marketa — revise blog | 6574808 | `https://hook.eu1.make.com/0nfnajqiuei2w5vu6ejbvmrpq3x05wci` (hook 3397274, `marketa-revise`) |
| Marketa: publish social (Ayrshare) | 6574779 | `https://hook.eu1.make.com/qo7klgk5ytn6roe9hdunxmocf1cfp5kp` (hook 3397276, `marketa-publish-social`) |

Already filled in during import (diff vs the blueprints in this folder):

- Webhook hook IDs attached to all three `Custom webhook` modules.
- `SUPABASE_URL` → `https://wucrgqdfyaiccacvxvpq.supabase.co` (brain project, per docs/marketa.md §note)
- `SANITY_PROJECT_ID` / `SANITY_DATASET` → `bt6nb58h` / `production`

## Remaining steps (blocked on secrets / plan)

1. **Paste secrets into the module fields** (they are still `{{PLACEHOLDER}}` expressions that resolve to empty): `CLAUDE_API_KEY`, `MONDAY_API_TOKEN`, `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (brain project), `AYRSHARE_API_KEY`. Sources: Doppler on the n8n Railway box / Vercel env. Then mark the scenarios **confidential** so run logs don't retain headers.
2. **Plan limit:** the org is on Make **Free** — max **2 active scenarios** and a **5-minute execution cap** (the draft scenario's 8000-token Opus + web_search run can exceed it, per README §3). Upgrade before activating all four.
3. Set org/scenario **timezone to Australia/Sydney** (org is currently Asia/Singapore) or the daily 09:00 ideas run fires 2–3 h early.
4. Enable **Allow storing of incomplete executions** on draft + revise (needed by the Break/retry error handlers).
5. Send one sample POST to each webhook so Make learns the payload structure (see README §1).
6. Update Vercel/.env: `N8N_MARKETA_DRAFT_WEBHOOK_URL` / `N8N_MARKETA_REVISE_WEBHOOK_URL` → the URLs above.
7. Activate: `scenarios_activate` on 6574831 / 6574808 (and the rest once the plan allows).
