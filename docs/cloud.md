# Cloud & Hosting

How the Fruition (Flourishion) website is hosted, built, and deployed. Everything runs on
**Cloudflare** — compute, CDN, DNS, and the domain are all managed there. Content and data live in a
handful of **external SaaS** services (Sanity, Supabase, Monday, Slack, Google, Resend).

> This document describes hosting/deploy. For how the code is organised and how data flows through the
> system, see [`architecture.md`](./architecture.md).

---

## 1. Platform at a glance

| Concern | Where | Notes |
|---|---|---|
| Compute | **Cloudflare Workers** | Next.js runs as a single Worker via OpenNext |
| Static assets | **Cloudflare Workers Assets** | `ASSETS` binding → `.open-next/assets` |
| Image optimisation | **Cloudflare Images** | `IMAGES` binding |
| CDN / edge cache | Cloudflare (automatic) | ISR/SSG cache is in-worker today (see §6) |
| DNS + domain | **Cloudflare** | domain and DNS managed in the Cloudflare dashboard |
| Adapter | **OpenNext** (`@opennextjs/cloudflare`) | translates the Next build into a Worker |

**Not Vercel.** The repo still contains a `.vercelignore` and the boilerplate `README.md` mentions
Vercel — these are stale leftovers from `create-next-app`. There is no `vercel.json`; the real deploy
target is Cloudflare only. (The committed `dist/` folder is also stale build cruft, not a deploy target.)

---

## 2. The Worker

Defined in [`wrangler.jsonc`](../wrangler.jsonc):

```jsonc
{
  "main": ".open-next/worker.js",       // built by OpenNext
  "name": "fruition-landing",           // the Worker name in Cloudflare
  "compatibility_date": "2025-03-25",
  "compatibility_flags": [
    "nodejs_compat",                     // Node APIs (crypto, Buffer) used by auth + Sanity writes
    "global_fetch_strictly_public"
  ],
  "assets": { "directory": ".open-next/assets", "binding": "ASSETS" },
  "services": [
    { "binding": "WORKER_SELF_REFERENCE", "service": "fruition-landing" }
  ],
  "images": { "binding": "IMAGES" }
}
```

Key points:
- **`nodejs_compat`** is required — the internal-auth token signing (`node:crypto`) and the Sanity write
  helpers rely on Node built-ins. Keep it on.
- **`WORKER_SELF_REFERENCE`** lets the Worker call back into itself (used by OpenNext for some internal
  routing / revalidation paths).
- Adapter config lives in [`open-next.config.ts`](../open-next.config.ts) — currently
  `defineCloudflareConfig({})` (minimal, default in-worker caching).

---

## 3. Build & deploy

Scripts (from `package.json`):

| Command | What it does |
|---|---|
| `npm run dev` | Local Next dev server, with Cloudflare bindings via `initOpenNextCloudflareForDev()` (wired in `next.config.ts`) |
| `npm run cf-build` | `opennextjs-cloudflare build` — produce the `.open-next/` Worker bundle |
| `npm run preview` | Build + run the Worker locally in the Workers runtime (`opennextjs-cloudflare preview`) |
| `npm run deploy` | Build + `opennextjs-cloudflare deploy` — ship to Cloudflare |
| `npm run upload` | Build + upload a new version without switching traffic |
| `npm run cf-typegen` | `wrangler types` → regenerate `cloudflare-env.d.ts` (typed bindings) |

**Deploy flow:** `deploy` runs the OpenNext build (compiling the Next 16 app into `.open-next/worker.js`
+ `.open-next/assets`), then hands the bundle to `wrangler` which publishes the `fruition-landing`
Worker and syncs assets.

There is currently **no CI deploy pipeline**. The only GitHub Actions workflow
(`.github/workflows/vault-sync.yml`) just mirrors commit metadata to an external notes vault — it does
**not** build or deploy. Deploys are run manually (or should be wired into CI as a follow-up).

---

## 4. Environments & local dev

- **Local:** `npm run dev` runs Next with Cloudflare bindings available. Local secrets go in
  `.dev.vars` (gitignored) — this is how the Workers runtime injects env vars locally.
- **Preview:** `npm run preview` runs the actual built Worker locally for a production-like check.
- **Production:** `npm run deploy`.

---

## 5. Secrets & environment variables

No `.env*` files are committed (all gitignored). Production secrets are set on the Worker via
`wrangler secret put <NAME>` or the Cloudflare dashboard; local ones live in `.dev.vars`. Public values
(`NEXT_PUBLIC_*`) are inlined at build time.

Full inventory, grouped by the service they configure:

**Sanity (CMS content lake)**
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_WRITE_TOKEN` (server-side writes — the one token all portal writers publish through)
- `SANITY_API_READ_TOKEN`, `SANITY_WEBHOOK_SECRET`

**Supabase — portal project (NEW, planned)** — auth + author profiles + editorial drafts
- `PORTAL_SUPABASE_URL`, `PORTAL_SUPABASE_ANON_KEY`, `PORTAL_SUPABASE_SERVICE_ROLE_KEY`
- Google OAuth client is configured inside Supabase Auth (domain-locked to `@fruitionservices.io`)

**Supabase — Marketa "brain" project (existing)** — pgvector RAG for the AI content pipeline
- `MARKETA_SUPABASE_URL`, `MARKETA_SUPABASE_SERVICE_ROLE_KEY`
- `EMBEDDING_MODEL`, `EMBEDDING_DIM`, `EMBED_RPM`, `EMBED_MAX_RETRIES`

**LLMs**
- `OPENROUTER_API_KEY`, `CLAUDE_BOT_MODEL`, `BOT_WEB_SEARCH_MODEL`, `MARKETA_LINKEDIN_MODEL`
- `CLAUDE_API_KEY` (Marketa harness), `GEMINI_API_KEY` (embeddings)

**Monday.com**
- `MONDAY_API_TOKEN`, `MONDAY_READ_TOKEN`, `MONDAY_WEBHOOK_SECRET`
- `MONDAY_LEADS_BOARD_ID`, `MONDAY_LEADS_GROUP_ID`, `MONDAY_LEADS_EMAIL_COLUMN`, `MONDAY_LEADS_NOTES_COLUMN`

**Slack**
- `SLACK_BOT_TOKEN`, `SLACK_USER_TOKEN`, `SLACK_SIGNING_SECRET`, `SLACK_LEADS_CHANNEL_ID`
- `SLACK_BLOG_IDEA_TEAM_ID`, `SLACK_BLOG_IDEA_CHANNEL_ID`, `SLACK_BLOG_IDEA_ALLOWED_USER_IDS`
- `FRUITION_BOT_USER_ID`, `FRUITION_BOT_PERSONALITY`, `BOT_TIMEZONE`

**Email (Resend)**
- `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`

**RB2B / lead enrichment**
- `RB2B_WEBHOOK_SECRET`, `REACHLY_API_KEY`, `BRANDFETCH_CLIENT_ID`

**Google (Docs/Drive for Marketa drafts)**
- `GOOGLE_SERVICE_ACCOUNT_JSON_B64`, `MARKETA_DOC_SHARE_DOMAIN`, `MARKETA_DRAFTS_FOLDER_ID`

**n8n glue**
- `N8N_MARKETA_DRAFT_WEBHOOK_URL`, `N8N_MARKETA_REVISE_WEBHOOK_URL`

**Internal auth (current — being replaced by Supabase/Google SSO)**
- `INTERNAL_AUTH_SECRET`, `INTERNAL_ONBOARDING_PASSWORD`

**Site**
- `NEXT_PUBLIC_SITE_URL`

---

## 6. Caching (current & future)

- **Today:** default in-worker caching (`defineCloudflareConfig({})`). ISR/SSG pages use their
  `revalidate` values (e.g. blog posts revalidate hourly), served from the Worker.
- **Future (documented in `open-next.config.ts`):** move the incremental cache to **R2** for durable
  ISR/SSG caching across Worker instances — create an R2 bucket, add
  `incrementalCache: r2IncrementalCache` in `open-next.config.ts`, and bind `NEXT_INC_CACHE_R2_BUCKET`
  in `wrangler.jsonc`.

---

## 7. External services (roles)

| Service | Role | Billing sensitivity |
|---|---|---|
| **Sanity** | Content lake (blogs, pages, team). Studio self-hosted at `/studio`. | **Per-seat** — see architecture doc; writers publish via the service token, not seats |
| **Supabase (portal)** | Portal auth (Google SSO), author profiles, editorial drafts | New dedicated project |
| **Supabase (brain)** | Marketa RAG vector store, `blog_drafts` | Existing, isolated |
| **Monday.com** | CRM/leads board, team roster, blog pipeline board | — |
| **Slack** | Lead alerts, blog-idea intake, bot | — |
| **Google Workspace** | SSO identity provider (`@fruitionservices.io`); Docs/Drive for Marketa | — |
| **Resend** | Transactional email (contact form) | — |
| **n8n (self-hosted)** | Marketa content pipeline orchestration | External host |

---

## 8. Domain & DNS

The production domain and its DNS records are managed in the **Cloudflare dashboard**, with a route
mapping the domain to the `fruition-landing` Worker. TLS is handled by Cloudflare. When adding the
internal portal, it lives under the same domain at `/internal` (one Worker, one deploy). If it is ever
promoted to its own Worker, it would get a `portal.fruitionservices.io` subdomain and its own route —
see the restructure plan in `architecture.md`.
