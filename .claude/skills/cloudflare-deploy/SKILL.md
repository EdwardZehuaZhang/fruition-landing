---
name: cloudflare-deploy
description: Build, preview and deploy this app to Cloudflare Workers via OpenNext — wrangler config, KV bindings, the 10MiB worker limit, CI pipeline and preview URLs. Use when changing next.config.ts, open-next.config.ts, wrangler.jsonc, dependencies, or when a deploy fails.
---

# Cloudflare deploy (OpenNext)

The whole app ships as **one Worker**, `fruition-landing`, serving `fruitionservices.io` and
`www.fruitionservices.io`.

```bash
npm run build      # next build only
npm run preview    # OpenNext build + local Workers runtime — use this to reproduce prod
npm run cf-build   # OpenNext build without deploying
npm run deploy     # build + deploy to the live Worker
npm run cf-typegen # regenerate cloudflare-env.d.ts from wrangler.jsonc
```

Prefer `npm run preview` over `npm run dev` when debugging anything runtime-shaped — `next dev`
runs on Node, the Worker does not.

## Bindings (`wrangler.jsonc`)

| Binding | Purpose |
|---|---|
| `NEXT_INC_CACHE_KV` | OpenNext incremental (ISR) page cache |
| `NEXT_TAG_CACHE_KV` | Tag cache — **without it `revalidatePath` silently no-ops** |
| `ASSETS` | Static assets from `.open-next/assets` |
| `IMAGES` | Cloudflare Images binding |
| `WORKER_SELF_REFERENCE` | Self-service binding for internal calls |

D1 would be a better tag cache than KV, but the CI deploy token lacks D1 permissions.
R2 is not enabled on the account.

## Constraints that bite

- **10 MiB Worker limit.** `next.config.ts` sets `experimental.optimizePackageImports` for
  `lucide-react`, `react-icons`, `recharts`, `@sanity/ui`, `@sanity/icons`, `date-fns` to keep
  barrel files out of the server bundle. Adding a heavy dependency can push you over — check the
  bundle after.
- **`middleware.ts`, not `proxy.ts`.** Next 16 deprecates middleware in favour of `proxy.ts`, but
  `proxy.ts` always compiles to the Node runtime and `@opennextjs/cloudflare` rejects it. Keep
  edge middleware.
- **`compatibility_flags` include `nodejs_compat`.** Node built-ins work, but not everything —
  test in `npm run preview`, not just `next dev`.

## CI/CD

- `.github/workflows/ci.yml` — typecheck, lint and tests on every PR into `production`.
- `.github/workflows/deploy.yml` — every PR uploads a **new preview Worker version** and comments
  the URL; push to `production` promotes to live.
- Preview URLs depend on `workers_dev: true` + `preview_urls: true` in `wrangler.jsonc`; these are
  reasserted on every deploy so the dashboard cannot drift.

## Deploy failures

1. `ENOTFOUND *.apicdn.sanity.io` during build → network, not code. Retry.
2. Worker size errors → a new dependency; check `optimizePackageImports`.
3. Revalidation "works" but the page is stale → confirm `NEXT_TAG_CACHE_KV` is still bound.
