---
name: integrations
description: monday.com, Slack, RB2B, Supabase, Calendly and lead-routing integrations — client locations, API gotchas, and the rules for testing against live boards. Use when touching src/lib integration clients, /api/webhooks, scheduling, or lead handling.
---

# Integrations

All integration clients are **server-only**, in `src/lib/`. They hold privileged tokens and are
never imported into a client component.

| Client | Surface |
|---|---|
| `mondayClient.ts` | monday.com GraphQL |
| `slackClient.ts` | Slack notifications + admin |
| `calendlyClient.ts`, `consultantAvailability.ts` | Scheduling, regional consultant calendars |
| `leadClassify.ts`, `leadNotify.ts` | Inbound lead routing |
| `rb2bColumns.ts`, `rb2bMondayCompany.ts`, `rb2bSlackBlocks.ts` | RB2B de-anonymisation |
| `social/zernio.ts` | Social scheduling + analytics |
| `portalAuth.ts` | Supabase auth for `/internal` |

Webhook routes: `src/app/api/webhooks/{monday,calendly,rb2b}`, plus `api/leads`,
`api/scheduling/*`, `api/contact`.

## Testing against live boards — read this first

These integrations write to **production** monday boards and Slack channels.

- Writing a test item to a live board is acceptable **only if you delete it immediately**.
- **Never leave a real Owner assigned.** Clear the `people` column before deleting, otherwise you
  notify a colleague about a fake item.
- Never post test messages to a customer-facing Slack channel.

## monday.com

- Column values are typed JSON; a wrong shape fails silently or writes an empty cell rather than
  erroring. Read the column type before writing.
- The MCP connector has **no automation-write scope** — `list_automations` reads, but creating or
  editing automations returns `USER_UNAUTHORIZED`/`FORBIDDEN` and must be done in the UI.
- Partner-link CTAs need campaign UTMs; most regions are currently untracked.

## RB2B

The pipeline was dead for three months because **live webhook payload keys differ from the CSV
backfill keys** (`LinkedIn URL` vs `Linked In URL`; `Profile Type` absent on live payloads). When
changing field mapping, verify against a **real live payload**, not a CSV export. Company and
Person are separate tables.

## Outbound sequences

Enrolment succeeding is not the same as the copy being correct. Before a send window, render the
actual emails from live data and exclude own-domain leads.

## Supabase

Two projects: the **portal** (auth, author profiles, drafts, invoices) and the Marketa **brain**
(separate repo). `portalAuth.ts` covers portal access — see `docs/architecture.md` §4. The portal
schema is reachable through the Supabase MCP.
