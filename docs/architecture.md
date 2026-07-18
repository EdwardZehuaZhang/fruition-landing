# Architecture

System architecture for the Fruition (Flourishion) website. This covers the repository layout, the
front-end / back-end split, the content and auth models, and the key data flows. For hosting, build,
and deploy specifics see [`cloud.md`](./cloud.md).

---

## 1. System overview

A single **Next.js 16 (App Router)** application, deployed as **one Cloudflare Worker** via OpenNext.
The one app currently contains several logically distinct concerns:

- **Public marketing site** — industry, partner, solution, and blog pages (many Sanity-driven via a
  block-based page builder).
- **Embedded Sanity Studio** at `/studio` (self-hosted editing UI).
- **Internal portal** at `/internal` — auth-gated staff tooling (onboarding today; blog CMS planned).
- **API + webhooks** — contact form, leads, Sanity ingest, and Monday/Slack/RB2B webhooks.
- **Marketa** — the AI content-generation pipeline (two verified blog pipelines + a Supabase RAG
  "brain"). **Currently runs in this app, slated to move to `marketa-monorepo` — see §8.**

Content lives in the **remote Sanity content lake** (project `bt6nb58h`). Operational/editorial data
lives in **Supabase**. Everything else (Monday, Slack, Google, Resend) is integrated via server-side
clients in `src/lib/`.

```
                        ┌──────────────────────────────────────────┐
   Visitors ───────────▶│   Cloudflare Worker (Next.js via OpenNext)│
                        │                                            │
                        │  (marketing) FE  ─── reads ──▶ Sanity CDN  │──▶ Sanity content lake (bt6nb58h)
                        │  /studio (Studio) ── writes ─▶ Sanity API  │
                        │  (portal) /internal ─ writes via ONE token │
                        │  /api/* webhooks                           │
                        └───────┬───────────────┬──────────┬────────┘
                                │               │          │
                          Supabase (portal)  Monday     Slack / Resend / Google
                          Supabase (brain)   .com       / RB2B / n8n
```

---

## 2. Front-end vs Back-end

The site is one deployable Worker, but the code separates cleanly into two surfaces:

- **Front-end (FE)** — the public marketing site. Server components that **read** from Sanity (via the
  CDN client, `useCdn: true`) and render pages. No privileged access.
- **Back-end (BE)** — the internal portal (`/internal`) + API routes (`/api/*`) + the server-only
  library clients (`src/lib/*`). These hold **privileged tokens** (Sanity write, Supabase service role,
  Monday, Slack) and perform all mutations. They are never exposed to the browser.

The planned monorepo restructure (see §7) formalises this: FE = `(marketing)` route group, BE = the
`(portal)` route group + `api/` + server-only workspace packages.

---

## 3. Content model & the CMS-portal write model

### Where content lives
All published content lives in the **remote Sanity content lake** (`bt6nb58h`, dataset `production`).
The live site reads it; it cannot be replaced by a "local copy".

### Sanity Studio is self-hosted (free)
The Studio (editing UI) is open-source and **embedded in this app at `/studio`**
(`src/app/studio/[[...tool]]/page.tsx`, config in `src/sanity/config.ts`). Hosting it costs nothing.

### The seat problem, and how the portal solves it
Sanity bills **per project member (seat)**. To avoid paying a seat per blog writer / SEO specialist,
the internal portal writes to Sanity through **one shared service token** (`SANITY_WRITE_TOKEN`):

```
Writer ──login (Google SSO)──▶ Portal (/internal) ──server-side──▶ SANITY_WRITE_TOKEN ──▶ Content lake
```

Sanity only ever sees that **one** token, regardless of how many writers use the portal. Only the owner
+ boss keep real Sanity seats (for schema/structural work in `/studio`). This write path already exists
in `src/lib/sanityWriteClient.ts` (`upsertBlogPost`, `uploadImageAsset`, `createTeamMember`).

### Blog authoring flow (Markdown → Portable Text)
The `blogPost` body is **Portable Text** (`src/sanity/schemas/blogPost.ts`). Writers author in
**Markdown**; on publish it is converted to Portable Text via `bodyToPortableText()` in
`sanityWriteClient.ts`, so portal-authored posts render identically to existing ones through
`src/components/BlogPostTemplate.tsx` (`@portabletext/react`).

```
Markdown editor ─▶ bodyToPortableText() ─▶ upsertBlogPost() ─▶ Sanity ─▶ /post/[slug] (BlogPostTemplate)
```

### Author profiles
`blogPost.author` is a free-text string; author pages (`/author/[slug]`) match that name to a Sanity
`teamMember` document to show photo/role/bio (`src/components/AuthorProfileTemplate.tsx`). The portal's
onboarding flow (`src/app/api/internal/onboarding/route.ts`) already creates `teamMember` docs +
uploads photos, so it doubles as author-profile management.

### Portal UI rule: shadcn/ui ONLY — never hand-rolled components

**Every interactive element in `/internal` MUST be a shadcn/ui component from
`src/components/ui/` (style `base-nova`, built on `@base-ui/react`). Never hand-roll a
`<select>`, `<table>`, dropdown, dialog, checkbox, or styled `<button>`/`<input>` with bespoke
Tailwind classes.** Hand-rolled controls have repeatedly shipped broken (the raw `<select>` on
`/internal/team` being the canonical example) because they miss the theming, focus/keyboard
handling, and portal/z-index behaviour the shadcn components already solve.

Concretely:

- **Lists of records** → `DataTable` (`src/components/internal/DataTable.tsx`): a shared
  shadcn table with search, dropdown facet filters, sortable columns and pagination. All
  `/internal` list views (blog posts, team, invoices) use it or the `ui/table` primitives.
- **Dropdowns** → `ui/select` (single choice) or `ui/dropdown-menu` (actions).
- **Confirmations** → `ui/alert-dialog`. Modals → `ui/dialog`.
- **Forms** → `ui/input`, `ui/textarea`, `ui/label`, `ui/checkbox`, `ui/button`.
- A missing component gets added via `npx shadcn@latest add <name>` (never written from
  scratch). NOTE: the CLI may try to overwrite existing `ui/` files — review the diff and keep
  local customisations (e.g. `button.tsx`'s `render`/`nativeButton` handling).
- `Button` supports `render={<Link href=… />}` for link-styled buttons — use that instead of a
  styled `<a>`/`<Link>`.

---

## 4. Authentication

**Current:** the portal is gated by a **shared password** — an HMAC-signed cookie
(`src/lib/internalAuth.ts`, `INTERNAL_ONBOARDING_PASSWORD` + `INTERNAL_AUTH_SECRET`). Server components
verify the token and `redirect('/internal/login')` when absent.

**Planned:** replace with **Supabase Auth + Google SSO**, locked to the **`@fruitionservices.io`**
Google Workspace domain. Because Supabase's Google provider does not natively filter by domain, the
domain is enforced **server-side** after sign-in (reject any email not on `@fruitionservices.io`;
prefer verifying Google's `hd` hosted-domain claim). Auth + author-profile + editorial-draft data lives
in a **new dedicated portal Supabase project** (separate from the Marketa "brain" project). The
server-side redirect gate pattern stays the same — only the backing session changes.

---

## 5. Data flows & integrations

Server-side clients live in `src/lib/`:

- **`sanityWriteClient.ts`** — HTTP writes to Sanity (blog posts, team members, image assets).
- **`mondayClient.ts` / `slackClient.ts` / `googleDocs.ts` / `claudeClient.ts` / `leadNotify.ts`** —
  integration clients for the webhooks and the Marketa pipeline.
- **`marketa/brain.ts`** — Gemini embeddings + Supabase pgvector (the RAG "brain").

API routes (`src/app/api/`):

- **`contact`** — contact form → Resend email.
- **`leads`** / **`webhooks/rb2b`** — lead capture + de-anonymisation → Monday/Slack enrichment.
- **`sanity-ingest`** — HMAC webhook feeding content into the Marketa brain.
- **`webhooks/monday`** — native monday webhook for the Team Onboarding board (create_item →
  teamMember doc in Sanity). No make.com relay any more.
- **`internal/blog/generate`, `webhooks/monday-blog`, `webhooks/slack-blog`,
  `internal/slack-admin`** — the Marketa blog pipeline routes (see §8 for the full flows and the
  planned extraction). Long drafts are stored in `portal_drafts` (+ brain `blog_drafts`) to sidestep
  Monday's ~2,000-char long-text cap.

---

## 6. Block-Based Page Builder

Marketing pages are composed from reusable content blocks managed in Sanity and rendered by a generic
`BlockRenderer`.

### Document Types
- **homePage** — singleton with a `contentBlocks` array.
- **siteSettings** — global config (phone, calendly link, logo, etc.).
- Existing document types (`blogPost`, `solutionPage`, `locationPage`, etc.) remain unchanged.

### Block Objects
Each block is a Sanity object type with a `_type`, a hidden `blockType` string, and its own fields.

| Block | Purpose |
|-------|---------|
| `heroBlock` | Page hero with heading, subheading, CTA |
| `richTextBlock` | Portable text / rich content |
| `ctaBlock` | Call-to-action with heading, body, link |
| `featureListBlock` | List of features with icon/title/description |
| `testimonialBlock` | Single testimonial quote |
| `logoCloudBlock` | Grid of logos with images |
| `postListBlock` | Auto-fetches recent blog posts |
| `faqBlock` | Question/answer pairs |

### Page composition & rendering
A page document has a `contentBlocks` array that accepts any block type. Editors add/reorder/configure
blocks in the Studio.

1. **Studio** — editors compose `contentBlocks` on the document.
2. **Loader** (`src/features/content/loaders.ts`) — `getHomePage()` fetches the doc with all blocks.
3. **Page** (`src/app/page.tsx`) — server component passes blocks to `BlockRenderer`.
4. **BlockRenderer** (`src/features/page-builder/BlockRenderer.tsx`) — maps `_type` → view component.
5. **Block view** — renders the block's content.

If no `homePage` document exists, the homepage falls back to site settings with a prompt to create it.

### Adding a new block type
1. Create the schema in `src/sanity/schemas/objects/myNewBlock.ts` (include a hidden `blockType`).
2. Register it in `src/sanity/schemas/index.ts`.
3. Add `defineArrayMember({ type: 'myNewBlock' })` to the document's `contentBlocks`.
4. Create the view in `src/features/page-builder/blocks/MyNewBlockView.tsx`.
5. Add a `case 'myNewBlock':` in `BlockRenderer.tsx`.

### Adding a new page type
1. Create a document schema in `src/sanity/schemas/documents/` with a `contentBlocks` field.
2. Register it in the schemas index.
3. Add a loader in `src/features/content/loaders.ts`.
4. Create a route in `src/app/` that uses the loader + `BlockRenderer`.

### Conventions
- **Schemas**: camelCase names matching filenames (`heroBlock.ts` → `name: 'heroBlock'`).
- **Views**: PascalCase with `View` suffix (`HeroBlockView.tsx`).
- **Loaders**: `get` prefix (`getHomePage()`).
- All files TypeScript.

---

## 7. Planned monorepo restructure (target)

The repo is named a "monorepo" but is currently one flat package. The target is a real **pnpm +
Turborepo workspace** that still deploys as **one Cloudflare Worker** (only `apps/web` is built):

```
apps/web/                    # the single deployable Next.js app → one Worker
  src/app/(marketing)/       # PUBLIC FE
  src/app/(portal)/internal/ # INTERNAL BE/CMS (auth-gated)
  src/app/studio/            # embedded Studio
  src/app/api/               # webhooks + internal API
packages/
  sanity/                    # schemas, client, queries, image, structure
  cms/                       # write client + markdown→portable-text + ingest
  auth/                      # supabase + Google Workspace SSO + session guard
  integrations/              # monday / slack / google / resend / claude clients
  ui/                        # shared components + design tokens (incremental)
services/marketa/            # marketa-harness + n8n + brain (NOT in the web deploy)
supabase/                    # migrations (portal + brain)
tooling/scripts-archive/     # the ~90 one-off scripts, archived
docs/                        # architecture.md, cloud.md
```

FE = `(marketing)`; BE/CMS = `(portal)` + `api/` + the server-only packages. One app / one Worker, with
a clean seam to later promote `(portal)` into its own Worker (`portal.fruitionservices.io`) if desired.

The full proposal, phasing, and verification steps live in the approved plan:
`Internal CMS Portal + Monorepo Restructure`.

---

## 8. Marketa blog pipeline — current state & planned extraction (2026-07-18)

Two production pipelines, both verified end-to-end. **The code currently lives — and RUNS — in this
repo** (deployed with the site on the `fruition-landing` Worker), but its long-term home is
**[`marketa-monorepo`](https://github.com/Fruition-Service/marketa-monorepo)**, where every file is
already mirrored byte-identically (see that repo's `docs/MIGRATION-STATUS.md` for the cutover
checklist).

### Pipeline 1 — daily auto-blog (09:00 SGT)
```
make.com 6575457 (daily cron) ─▶ POST /api/internal/blog/generate  (Bearer INTERNAL_API_KEY)
  └▶ generate (OpenRouter chain → Gemini fallback; voiceGuide + brain RAG + web search)
     ─▶ portal_drafts ─▶ Google Docs (blog + LinkedIn) ─▶ monday item (Website Blogs, "Drafting")
     ─▶ Zernio social draft (X + Google Business, isDraft) ─▶ Slack #website-blogs (5 buttons)
```

### Pipeline 2 — Slack topic intake (Josh's flow)
```
Top-level message in #website-blogs ─▶ /api/webhooks/slack-blog ─▶ monday item + "Queued" reply
  ─▶ make.com 6574831 webhook ─▶ POST generate {pulseId,…} (monday mode)
  ─▶ portal_drafts + brain blog_drafts + monday patch "Draft ready"
  ─▶ monday webhook ─▶ /api/webhooks/monday-blog ─▶ Google Docs + Zernio + threaded
     "Draft ready" reply (portal / blog doc / LinkedIn doc / social / monday buttons)
```

### Grounding
Generation injects the Sanity `voiceGuide` document at run time (content team edits style in Sanity —
no deploy), retrieves chunks from the brain (Supabase pgvector, project `wucrgqdfyaiccacvxvpq` —
free tier, **re-pauses after ~7 idle days**; if RAG returns 0 chunks check the project is up), and
uses provider web search so stats/links are verified live. Prompts encode the human editor's style
rules (`docs/marketa-blog-style-spec.md`).

### Marketa file inventory in this repo (everything mirrored to marketa-monorepo)
- Routes: `api/internal/blog/generate`, `api/webhooks/slack-blog`, `api/webhooks/monday-blog`,
  `api/internal/slack-admin`.
- Libs: `lib/googleDocs.ts` (fetch + WebCrypto — google-auth-library breaks on Workers),
  `lib/marketa/{brain,blogSlackBlocks,marketaLinkedIn,zernio,socialVariants}.ts`,
  plus shared `mondayClient` / `slackClient` / `sanityWriteClient` / `claudeClient`.
- Portal bridge: `/internal/blog/monday/[pulseId]/edit` resolves monday items to portal drafts.

### Extraction rule (until the runtime cutover)
**This repo is the runtime. Make pipeline changes HERE first (this is what deploys), then mirror the
file(s) to marketa-monorepo.** The cutover itself (deploy marketa-monorepo, move ~15 secrets, repoint
the Slack app Events URL, two monday webhooks, and two make.com scenario URLs) is documented in
marketa-monorepo `docs/MIGRATION-STATUS.md`; the portal pages stay here either way.
