# Fruition website

Next.js 16 (App Router) + React 19, content from Sanity, deployed as a **single Cloudflare
Worker** via OpenNext. ~115 marketing pages, an auth-gated staff portal at `/internal`, and
webhook/API routes for monday.com, Slack, RB2B and Calendly.

Full map: [docs/architecture.md](docs/architecture.md).

## Commands

```bash
npm run dev          # localhost:3000
npm test             # vitest — 96 tests, ~3s. Run this.
npm run typecheck    # tsc against tsconfig.ci.json — CI gate
npm run lint         # eslint — CI gate, must stay at 0 errors
npm run build        # next build (needs live Sanity access, see below)
npm run preview      # OpenNext build + local Workers runtime
```

**Verify with `npm test && npm run typecheck && npm run lint`** before saying a change is done.
All three are fast; `npm run build` takes ~2min and is only needed for build-shape changes
(next.config, deps, route structure).

## Gotchas that cost real time

- **`production` is the mainline branch. There is no `main`.** Branch from it, PR into it,
  squash-merge. Feature branches drift behind fast — rebase before you assume a conflict is real.
- **`npm run build` fetches live Sanity data.** `getaddrinfo ENOTFOUND *.apicdn.sanity.io` is a
  network failure, not your code. Retry before debugging.
- **Never hand-edit `src/redirects.ts`** — 892 auto-generated Wix redirects. New redirects go in
  `auditRedirects` in `next.config.ts`.
- **Unknown `/partnerships/<slug>` returns 200 with an empty shell, not a 404.** Link checkers
  cannot catch nav links pointing at pages that do not exist. Verify page files exist by hand.
- **Never call `headers()` or `cookies()` in `src/app/layout.tsx`.** A dynamic API in the root
  layout opts *every* route out of static rendering — it held the whole site at `no-store` with
  1.4-2.3s TTFB until 2026-08-21. Check the build's static/dynamic counts after layout changes.
- This repo no longer contains the Marketa blog pipeline — it lives in `marketa-monorepo`. Ignore
  any older doc that says otherwise.

## Non-negotiables

Any UI work follows [DESIGN.md](DESIGN.md) and [PRODUCT.md](PRODUCT.md). The short version, enforced
by a hook on every edit under `src/`:

- Semantic tokens from `src/app/globals.css` only — no raw hex, no inline `style` for layout or type.
- Exactly three breakpoints: base, `md:` (768px), `lg:` (1024px).
- Poppins and JetBrains Mono only.
- Never rewrite page copy or Sanity content during visual work.

The internal portal (`/internal`) uses **shadcn/ui components only** — never hand-rolled equivalents.

## Where to look

| Task | Skill |
|---|---|
| Any UI or styling change | `/design-system` |
| Adding or editing a marketing page | `/page-authoring` |
| Sanity schemas, GROQ, cache revalidation | `/sanity-content` |
| Deploying, Workers runtime, KV bindings | `/cloudflare-deploy` |
| monday.com, Slack, RB2B, Supabase, Calendly | `/integrations` |
