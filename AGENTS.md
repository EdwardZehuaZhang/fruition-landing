<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design Context

Any work that touches UI must follow [PRODUCT.md](PRODUCT.md) (strategy, brand personality, anti-references) and [DESIGN.md](DESIGN.md) (tokens, type scale, components, do's/don'ts). Read both before writing or changing any page or component. Non-negotiables: semantic tokens from `src/app/globals.css` only (no raw hex, no inline `style` for layout/type), three breakpoints (base / `md:` 768 / `lg:` 1024), Poppins + JetBrains Mono only, and never remove or rewrite page copy or Sanity content during visual work.

# Marketa blog pipeline — lives in marketa-monorepo, NOT here

The Marketa AI blog pipeline (blog generation, Slack intake bot, monday auto-docs, social publishing) runs from the **`marketa-monorepo`** repo on its own host. This repo no longer contains any pipeline code — do not add Marketa routes or libs here.

What the website keeps (the one seam):
1. **Portal pages** under `src/app/internal/blog/` — the draft dashboard and editors. They read drafts via `src/lib/marketaDrafts.ts` (read-only accessor for the brain Supabase `blog_drafts` table) and their own `api/internal/blog` routes.
2. `claudeClient.ts`, `slackClient.ts`, `mondayClient.ts` stay — they serve website features (design chat, rb2b leads, onboarding), not Marketa.

Pipeline changes go to `marketa-monorepo` directly (see its `CLAUDE.md` and `ARCHITECTURE.md`).
