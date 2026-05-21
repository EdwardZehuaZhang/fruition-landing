# RB2B → Monday + Slack integration

End-to-end visitor identification pipeline. Frontend tag fires for non-EU
traffic, RB2B identifies US B2B visitors, our webhook ingests events and
fans out to Monday + Slack.

## Architecture

```
Visitor (US) ─► <script> in layout ─► RB2B servers
                                          │
                                          ▼
                              POST /api/webhooks/rb2b?key=…
                                          │
                                ┌─────────┴──────────┐
                                ▼                    ▼
                       Monday "Website Leads"   Slack #website0leads
                       (board 5028658425)
```

EU traffic skips the script entirely — `src/app/layout.tsx` reads
`x-vercel-ip-country` and short-circuits the loader for 31 EU/EEA + UK codes.

## Environment

```
SLACK_BOT_TOKEN=xoxb-…          # existing
MONDAY_API_TOKEN=…               # existing
RB2B_WEBHOOK_SECRET=…            # shared secret in webhook URL ?key=
RB2B_MONDAY_BOARD_ID=5028658425
SLACK_LEADS_CHANNEL_ID=C0B4HBBHR35
# REACHLY_API_KEY=…              # TODO: see "Reachly" below
# REACHLY_CAMPAIGN_ID=…
```

Production: set the same vars in Vercel (`vercel env add`).

## RB2B dashboard setup

1. Open RB2B → Destinations → Webhook.
2. URL: `https://www.fruitionservices.com/api/webhooks/rb2b?key=<RB2B_WEBHOOK_SECRET>`
3. Click "Send test event" — expect HTTP 200, a new Monday item, and a Slack post in #website0leads.

## Monday board

Board: [Website Leads](https://fruitionservices.monday.com/boards/5028658425)

Columns are provisioned by `scripts/provision-rb2b-board.ts` (idempotent).
Re-run after manual schema changes to refresh `src/lib/rb2bColumns.ts`.

Dedupe key: Business Email (fallback: LinkedIn URL). Repeat visits append
the captured path to "Pages Viewed" and bump "Last Seen".

Intent is derived from accumulated page paths:
- `/service*` → **High**
- `/contact`, `/pricing` → **Medium**
- anything else → **Low**

The existing **Status** column (Working on it / Done / Stuck) is reserved
for sales pipeline state and is *not* touched by the webhook.

## Slack notifications

Posts to channel `C0B4HBBHR35` (#website0leads). Sent on:
- first sighting of an email/LinkedIn, OR
- when accumulated pages bump intent to High, OR
- **company-only events** (anonymous visitor with Company Name but no
  email/LinkedIn) — posts a separate "Anonymous visit — {Company}" block.
  No Monday write (no dedupe key); every company-only payload posts.

Repeat low/medium person visits are silent to keep the channel
signal-rich. Company-only events depend on RB2B routing its Companies
stream to this webhook URL — if RB2B only sends Contacts via webhook,
enable RB2B's native Slack destination for the Companies feed instead.

## Reachly

`reachly.co` does not publish a self-service add-lead API (as of
2026-05). The webhook logs a `[rb2b-webhook] reachly push not yet
implemented` line on first sighting when `REACHLY_API_KEY` is set.

Options to wire this up:
- If a Reachly API exists, fill in the POST in
  `src/app/api/webhooks/rb2b/route.ts` (search for `Reachly`).
- Swap to a tool with a documented API (Smartlead, Instantly, ReachInbox).
- Or use RB2B's native destinations for outreach + keep our webhook for
  Monday/Slack only.

## Verification

Local:
```
pnpm dev
curl -X POST 'http://localhost:3000/api/webhooks/rb2b?key=…' \
  -H 'Content-Type: application/json' \
  -d '{
    "LinkedIn URL":"https://linkedin.com/in/test",
    "First Name":"RB2B","Last Name":"Test Payload",
    "Title":"VP Engineering","Company Name":"Acme Inc",
    "Business Email":"test+rb2b@acme.example",
    "Website":"https://acme.example","Industry":"SaaS",
    "Employee Count":120,"Estimate Revenue":"$10M-$50M",
    "City":"San Francisco","State":"CA","Zipcode":"94107",
    "Seen At":"2026-05-21T12:00:00Z",
    "Referrer":"https://google.com",
    "Captured URL":"https://www.fruitionservices.com/services/branding",
    "Tags":null,"is_repeat_visit":false
  }'
```

Expected: `200 {"ok":true,"itemId":"…","isNew":true,"intent":"High"}` plus a
Slack notification.

EU block (preview deploy):
```
curl -sIL -H 'x-vercel-ip-country: DE' <preview-url> | grep -c ddwl4m2hdecbv
# expect 0

curl -sIL -H 'x-vercel-ip-country: US' <preview-url> | grep -c ddwl4m2hdecbv
# expect > 0  (the cloudfront URL in the inline script)
```
