# Handover — Site-wide Design Suite (2026-07-17 → 2026-07-18)

Continuation doc for the full-site design unification of fruitionservices.io.
Read together with **PRODUCT.md** (strategy) and **DESIGN.md** (visual spec) at the
repo root — those two files are the system of record; every agent/session that
touches UI must load them first (see AGENTS.md → Design Context).

## What shipped in this program

### Phase 0 — Design system extracted
- **North star: "The Consultant's Terminal"** — white worksheet, 1px hairlines,
  JetBrains Mono metadata layer, one voltage-purple accent. Anchor page:
  `/ai-capability-assessment`.
- `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json` (live-panel sidecar),
  `.impeccable/live/config.json`. Impeccable skill lives in `.claude/skills/impeccable`.

### Phase 1 — Shared CSS layer (`src/app/globals.css`)
- All class CSS wrapped in `@layer` (unlayered rules were beating Tailwind
  utilities — cause of the historical double sticky-CTA button).
- Semantic tokens only: `brand / brand-light / brand-dark / brand-soft /
  surface-dark(-2) / body / muted / ui` + radius/shadow scales. Raw hex in a
  component is a defect (DESIGN.md "Semantic Token Rule").
- Fonts: **Poppins + JetBrains Mono only** (Montserrat removed; mono loaded via
  next/font as `--font-jetbrains` → Tailwind `font-mono`).
- Type roles (`.text-display` 48/32, `.text-section-h2` 44/28, etc.) carry the
  one-step-down mobile scale; body roles are declared *before* heading roles in
  the layer so `text-section-h2 text-body` combos resolve to heading metrics.
- Purple-family hovers only; legacy blue #4674FB/#579bfc eliminated.
- Canonical `.form-field` (white fill, hairline, 12px radius, brand focus ring,
  `[aria-invalid]` error border).

### Phases 2–4 — Templates, sections, bespoke pages
- All templates (Practice ×38, AiPartner ×8, Universal, Blog, Author), all 40
  `sections/*` components, Navbar/Footer/StickyCtaBar, and all 27 bespoke
  `*Content.tsx` pages converted to tokens + responsive classes.
- Fixed en route: undefined CSS vars (IndustryTabs/EcosystemGrid/IndustryCaseStudy
  dark sections were silently broken), 16px-H2 collision, empty-`src` crash on
  cabinetry, AboutModern rainbow → purple family.

### Breakpoints — THE LAW (Edward's spec, fully normalized 2026-07-18)
- **Mobile ≤767 · Tablet 768–1023 (`md:`) · Desktop ≥1024 (`lg:`)** — nothing else.
- 177 `sm:`→`md:` remaps; all `xl:`/`2xl:` retired (gutter ladders →
  `px-4 md:px-16 lg:px-24`); AiPartnerTemplate custom 900/480px queries → 1023/767.
- Verified 6 routes × 4 widths: zero overflow; nav flips burger→desktop at 1024.
- Exempt: internal portal (`/internal`, `components/ui`, app-sidebar/chart-*/
  nav-user/section-cards) and fluid `clamp()` values.

### Element unification (the "FAQ treatment": one component + Sanity store + page-key tagging)
| Element | Component | Sanity store | Notes |
|---|---|---|---|
| FAQs | `sections/FaqAccordion` (renders FAQPage JSON-LD, `#faq` anchor) | `faqItem` docs, `pages[]` keys | 354 migrated + 40-item FAQ Bank seeded (`faqItem-bank-*`); `/faqs` search covers all. `getFaqItemsForPageStrict` = no curated fallback |
| Closing CTA | `sections/ClosingCtaSection` (dark gradient banner, optional stats row) | `closingCta` docs, `pages[]`; NO site default by design | Page-specific doc > page's built-in copy (fallback prop). Practice cluster covered by `closingCta-practice-default` |
| Testimonials (quotes) | existing renderers, central data | `caseStudy` (extended: industry/platform/pages/order/headline) | 13 consolidated from page-field arrays; page.tsx override pattern (central wins, page field = fallback) |
| Proof stats | — | `proofStats` singleton (_id `proofStats`) | 500+ implementations · 4.9 · 6 markets · 180k+ · Platinum ×2 · Rising Star ×2. `getProofStats()` always returns complete object |
| Forms | `.form-field` class | croSections.leadForm (existing) | ContactSection + LeadForm share it |

Page keys everywhere = route path minus leading slash (e.g.
`partnerships/aws-partner`, `ai-consulting/n8n`).

## Gotchas that WILL bite again
1. **Sanity doc ids must be dot-free** — ids containing `.` are namespaced/private
   ("reason":"permission" on public queries). Use hyphens.
2. **Legacy Wix image refs are malformed** (`image-a280a5_…~mv2-png`) — `urlFor()`
   **throws**. Always guard (see `safePhotoUrl` in the 3 testimonial page.tsx files).
3. **Turbopack persistent cache serves stale globals.css** — CSS chunk name is not
   content-hashed; if a new class doesn't appear, `rm -rf .next` and restart.
4. The app's read client is CDN-cached (`useCdn: true`) — freshly-written Sanity
   docs can lag a minute in dev.
5. Migration scripts convention: `scripts/sanity-migrate/*` with `writeClient`
   from `./lib`, **create-only** (`createIfNotExists`, deterministic ids), rerun-safe.
   Recent: `central-faqs`, `faq-bank`, `closing-cta`, `central-testimonials`, `proof-stats`.

## Verification harness
- `node <scratchpad>/verify-page.mjs /route …` (Playwright: overflow/error-overlay/
  h1-h2 sizes at 375/768/1280) — recreate from memory if the scratchpad is gone; it
  launches `chromium_headless_shell-1228` via explicit `executablePath` because the
  repo-pinned 1208 download stalls on this machine.
- `npm run typecheck` after every batch.

## Open items / next candidates
1. **Case-study cards** on `/customer-testimonials` (`page.caseStudyCards` +
   `TestimonialFilterGrid`) — separate species from quote testimonials; could join
   the `caseStudy` store with a `kind` field.
2. **TestimonialCtaBanner blue-black artwork** — last One-Accent-Rule violation;
   needs Edward's design call before re-theming.
3. **FAQ questions as real `<h3>`** — bank spec asks for H3 semantics; accordion
   currently uses spans in buttons (one-line change if wanted).
4. **Solar page "Trusted by 300+ businesses"** (`trustedByCaption` in Sanity) —
   flagged vs the 500+ canonical; possibly intentional vertical truth. Edward decides.
5. Renderer-level testimonial card visual unification (6 renderers share data,
   not yet one card design).
6. Sets 1/2/5 of the FAQ bank are each tagged to two pages (pre-existing),
   technically violating the bank's one-set-per-page rule.

## Session memory
The Claude Code auto-memory for this project mirrors all of the above
(`site-redesign-conventions` memory) — a fresh session will recall it automatically.
