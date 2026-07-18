<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design Context

Any work that touches UI must follow [PRODUCT.md](PRODUCT.md) (strategy, brand personality, anti-references) and [DESIGN.md](DESIGN.md) (tokens, type scale, components, do's/don'ts). Read both before writing or changing any page or component. Non-negotiables: semantic tokens from `src/app/globals.css` only (no raw hex, no inline `style` for layout/type), three breakpoints (base / `md:` 768 / `lg:` 1024), Poppins + JetBrains Mono only, and never remove or rewrite page copy or Sanity content during visual work.

# Marketa blog pipeline — runtime HERE, long-term home is marketa-monorepo

The Marketa AI blog pipeline (routes `api/internal/blog/generate`, `api/webhooks/slack-blog`, `api/webhooks/monday-blog`, `api/internal/slack-admin`; libs under `src/lib/marketa/` + `googleDocs.ts`) **currently runs from THIS repo** on the `fruition-landing` Worker. Its long-term home is the `marketa-monorepo` repo, where every file is mirrored byte-identically. Until the runtime cutover:

1. **Edit pipeline code here first** (this repo is what deploys), then mirror the changed file(s) to `marketa-monorepo` at the same paths (`diff -r` shows drift).
2. **Never delete the Marketa routes/libs from this repo** before executing the cutover in `marketa-monorepo/docs/MIGRATION-STATUS.md` — the Slack app, monday webhooks, and make.com scenarios all point at fruitionservices.io.
3. Flows + file inventory: [docs/architecture.md §8](docs/architecture.md). Writing style the prompts encode: `docs/marketa-blog-style-spec.md`.
