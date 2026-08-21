# Architecture

System architecture for the Fruition Services website. Repository layout, the front-end /
back-end split, the content and auth models, and the key data flows. For hosting, build and
deploy specifics see [`cloud.md`](./cloud.md).

> **Accuracy contract.** Every claim here was verified against the tree on the date in the
> footer. If you find a statement that no longer matches the code, fix this file in the same
> PR as the code change — a stale architecture doc is the single most expensive thing in this
> repo, because every agent and every new engineer starts here.

---

## 1. System overview

One **Next.js 16 (App Router)** application on **React 19**, deployed as a **single Cloudflare
Worker** via OpenNext. Three logically distinct surfaces share the deployment:

- **Public marketing site** — ~115 pages: industry, partner, solution, location and blog pages.
  Copy is a mix of hand-authored React and Sanity-driven content.
- **Embedded Sanity Studio** at `/studio` — self-hosted editing UI.
- **Internal portal** at `/internal` — Google-SSO-gated staff tooling: blog CMS, social composer,
  invoices, design docs, team/onboarding.
- **API + webhooks** under `/api` — contact, leads, scheduling, and monday/Slack/RB2B/Calendly
  webhooks.

Published content lives in the **remote Sanity content lake** (project `bt6nb58h`, dataset
`production`). Portal/operational data lives in **Supabase**. Everything else (monday.com, Slack,
Resend, Calendly) is reached through server-side clients in `src/lib/`.

```
                        ┌───────────────────────────────────────────┐
   Visitors ───────────▶│  Cloudflare Worker (Next.js via OpenNext)  │
                        │                                           │
                        │  marketing pages ── read ──▶ Sanity CDN   │──▶ Sanity lake (bt6nb58h)
                        │  /studio         ── write ─▶ Sanity API   │
                        │  /internal       ── write via one token   │
                        │  /api/*  webhooks + scheduling            │
                        └──────┬─────────────┬──────────┬───────────┘
                               │             │          │
                          Supabase       monday.com   Slack / Resend
                          (portal)                    / RB2B / Calendly
```

Caching: OpenNext's incremental (ISR) cache and tag cache are both backed by **Cloudflare KV**
(`NEXT_INC_CACHE_KV`, `NEXT_TAG_CACHE_KV` in `wrangler.jsonc`). See §7.

---

## 2. Front-end vs back-end

One deployable Worker, but the code separates cleanly:

- **Front-end** — the public marketing site. Server components that **read** Sanity through the
  CDN client (`useCdn: true`) and render. No privileged access.
- **Back-end** — `/internal` + `/api/*` + the server-only clients in `src/lib/*`. These hold the
  privileged tokens (Sanity write, Supabase service role, monday, Slack) and perform every
  mutation. They are never exposed to the browser.

`src/middleware.ts` runs at the edge and does two things: 301s the apex host to
`www.fruitionservices.io` (the Worker serves both, and without this Google sees duplicates), and
forwards an `x-pathname` header so server components can read the current route.

> It stays a `middleware.ts` — deprecated in Next 16 in favour of `proxy.ts` — deliberately.
> `proxy.ts` always compiles to the Node.js runtime, which `@opennextjs/cloudflare` rejects.

---

## 3. Content model & the CMS-portal write model

### Where content lives
Published content lives in the remote Sanity lake (`bt6nb58h`, dataset `production`). Schemas are
in `src/sanity/schemas/`; read queries in `src/sanity/queries.ts` and `src/features/content/loaders.ts`.

### Sanity Studio is self-hosted
The Studio is mounted at `/studio` inside this app rather than on sanity.io, which keeps it on the
free tier and inside our own auth perimeter.

### The seat problem, and how the portal solves it
Sanity charges per editor seat. Rather than buying a seat per staff member, the internal portal
writes to Sanity through **one shared service token** (`src/lib/sanityWriteClient.ts`), and staff
authenticate against the portal instead. Staff never touch the Studio.

### Blog authoring flow
Markdown → Portable Text on the way in; the editor is TipTap-based
(`src/components/internal/RichTextEditor.tsx`). Body images **must be Sanity-hosted** — a remote
`![](url)` publishes as a plain link, so images are sideloaded into Sanity on publish.

### Portal UI rule: shadcn/ui ONLY
Every portal surface uses shadcn/ui primitives from `src/components/ui/`. Never hand-roll a
button, dialog, table or form control for `/internal`. The portal has its own self-contained
neutral shadcn theme inside `src/app/globals.css`, isolated from the marketing palette.

---

## 4. Authentication

The portal is gated by **Supabase Auth + Google SSO**, restricted to the
`@fruitionservices.io` Google Workspace domain. Implementation is `src/lib/portalAuth.ts`:

- `getPortalClient()` / `getPortalAdmin()` — SSR and service-role Supabase clients.
- `isAllowedEmail()` / `allowedDomain()` — the domain gate. Supabase's Google provider cannot
  filter by domain natively, so it is enforced **server-side after sign-in**.
- `requirePortalUser()` — the guard server components call; redirects to `/internal/login`.
- `getPortalApiUser()` — the equivalent for API route handlers.
- `ensureAuthorProfile()` / `getAuthorProfile()` — links a Supabase user to their author profile.

> The earlier shared-password gate (`internalAuth.ts`, `INTERNAL_ONBOARDING_PASSWORD`) is gone.

---

## 5. Data flows & integrations

Server-side clients in `src/lib/`:

| Client | Purpose |
|---|---|
| `sanityWriteClient.ts` | All Sanity writes — posts, team members, image assets |
| `mondayClient.ts` | monday.com GraphQL |
| `slackClient.ts` | Slack notifications and admin actions |
| `calendlyClient.ts`, `consultantAvailability.ts` | Scheduling and regional consultant calendars |
| `leadClassify.ts`, `leadNotify.ts` | Inbound lead routing (CRM vs enquiries) |
| `rb2bColumns.ts`, `rb2bMondayCompany.ts`, `rb2bSlackBlocks.ts` | RB2B de-anonymisation pipeline |
| `social/zernio.ts` | Social scheduling + analytics |
| `revalidateSite.ts` | On-demand ISR invalidation (see §7) |
| `portalAuth.ts` | Portal auth (§4) |

API routes (`src/app/api/`):

- **`contact`** — contact form → Resend.
- **`leads`**, **`webhooks/rb2b`** — lead capture and de-anonymisation → monday + Slack.
- **`webhooks/monday`** — Team Onboarding board: `create_item` → `teamMember` doc in Sanity.
- **`webhooks/calendly`** — booking lifecycle events.
- **`scheduling/*`** — availability, booking, and lead capture for the in-house scheduler.
- **`internal/*`** — portal APIs: blog, social composer, invoices, design docs, team.

> **The Marketa AI blog pipeline is no longer in this repo.** It runs from `marketa-monorepo`
> on Vercel. `src/lib/marketa/`, `src/lib/googleDocs.ts`, `api/webhooks/monday-blog`,
> `api/webhooks/slack-blog` and `api/sanity-ingest` were all removed. Older handover documents
> that describe the pipeline as living here are historical.

---

## 6. How pages are composed

**Marketing pages are hand-authored React server components.** A page directory under
`src/app/<route>/` holds a `page.tsx` (metadata + data loading) and usually a `<Name>Content.tsx`
client component for the body. Shared building blocks live in `src/components/sections/`.

Sanity supplies the *data* those components render — logos, testimonials, office details, FAQ
tabs, blog posts — through `src/features/content/loaders.ts` and `src/sanity/queries.ts`.

> **There is no generic block renderer.** An earlier `src/features/page-builder/` composed pages
> from Sanity `contentBlocks` via a `BlockRenderer`; it was removed in the repo audit
> (2026-08-21) after going unrendered since July. Some documents (notably `homePage`) still store
> `contentBlocks` in Sanity and the loaders read specific block types out of them — that is a
> **data shape**, not a rendering system. Do not add a "block view" expecting it to render.

### Adding a page
1. Create `src/app/<route>/page.tsx` exporting `metadata` and a default server component.
2. Load content in the server component; keep interactivity in a `"use client"` child.
3. Compose from `src/components/sections/`; follow `DESIGN.md` tokens and the three breakpoints.
4. Add the route to `src/app/sitemap.ts`.
5. If it replaces an old URL, add a redirect to `auditRedirects` in `next.config.ts`.

---

## 7. Caching and revalidation

The Worker serves pages from OpenNext's KV-backed incremental cache. Publishing from `/internal`
must explicitly invalidate:

- `revalidatePath` only works because **`NEXT_TAG_CACHE_KV` is bound** in `wrangler.jsonc`.
  Without that binding the adapter silently falls back to a dummy tag cache and revalidation is a
  no-op that looks successful.
- Pass **concrete URLs untyped** — `revalidatePath("/post/my-slug")`. The `"page"` type argument
  is for *route patterns* (`/post/[slug]`) and passing it with a concrete URL fails to match.
- `src/lib/revalidateSite.ts` wraps this; use it rather than calling `revalidatePath` directly.

---

## 8. Testing and CI

- **`npm test`** — vitest, 96 tests across `src/lib/*.test.ts`, ~3 seconds.
- **`npm run typecheck`** — `tsc --noEmit -p tsconfig.ci.json` (excludes `scripts/`, `supabase/`).
- **`npm run lint`** — eslint; currently 0 errors and ~100 warnings.

CI (`.github/workflows/ci.yml`) runs all three on every PR into `production`. Deploy
(`.github/workflows/deploy.yml`) uploads a preview Worker version per PR and promotes to the live
Worker on push to `production`.

> `npm run build` fetches live Sanity data during static generation. An `ENOTFOUND
> *.apicdn.sanity.io` failure is a network problem, not a code problem.

---

## 9. Repository layout

```
src/
  app/                 # App Router: ~115 marketing routes, /internal, /studio, /api
  components/
    sections/          # Shared marketing sections
    internal/          # Portal components
    ui/                # shadcn/ui primitives (portal)
    home/              # Home page composition + copy
  features/content/    # Sanity loaders (deduped per render pass)
  lib/                 # Server-side integration clients + portal auth
  sanity/              # Schemas, queries, image helpers, Studio config
  data/                # Static content data (team roster, practice pages)
  types/               # Shared TypeScript types
  redirects.ts         # 892 generated Wix redirects — never hand-edit
  middleware.ts        # Canonical host 301 + x-pathname
scripts/               # One-off migrations, Sanity seeds, ops tooling
docs/                  # This file and its siblings
docs/archive/          # Historical handovers, kept for reference only
.claude/               # Agent framework: skills, subagents, hooks, permissions
```

---

*Verified against the tree on 2026-08-21. Sections 4–8 were rewritten in that audit; the
previous version described a shared-password login, a live Marketa pipeline and a block-based
page builder, none of which still existed.*
