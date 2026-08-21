---
name: sanity-content
description: Sanity CMS in this repo — schemas, GROQ queries, the loader layer, the two-source FAQ trap, blog publishing, and ISR cache revalidation. Use when touching src/sanity/, content loaders, blog publishing, or anything that must appear on the live site after an edit.
---

# Sanity content

Project `bt6nb58h`, dataset `production`. Studio is self-hosted at `/studio`.

| Path | Role |
|---|---|
| `src/sanity/schemas/` | Document + object schemas |
| `src/sanity/queries.ts` | GROQ queries |
| `src/features/content/loaders.ts` | Page-level loaders, deduped per render with `cache()` |
| `src/lib/sanityWriteClient.ts` | **All** writes, through one shared service token |

Reads use the CDN client (`useCdn: true`). Writes go through `sanityWriteClient` only — staff
never get Sanity seats, the portal writes on their behalf.

## FAQ JSON-LD: emit it from the component that renders the questions

`FaqAccordion` builds the FAQPage JSON-LD from the exact `tabs` it renders. Do not add a
second, route-level emitter. Two rules, both learned the hard way (2026-08-21):

1. **Structured data must match visible content.** A head-level emitter re-queried Sanity by
   pathname and its `/faqs` fallback put 124 generic questions on 257 pages that show no FAQ —
   a Google FAQPage policy violation. Use `getFaqItemsForPageStrict()` if you ever need the
   no-fallback query.
2. **Never call `headers()` or `cookies()` in the root layout.** It opts *every* route out of
   static rendering. That one call held the whole site at `no-store` with 1.4–2.3s TTFB.

## The FAQ two-source trap

FAQ content exists in **two places** and they do not agree:

1. `faqTabs` **on the page document** — where editors actually edit.
2. Central `faqItem` **documents** — a separate collection.

A loader that falls back to the central `/faqs` collection makes central content always win, so
editors' page-level edits silently vanish. `resolveFaqTabs()` is the correct resolver — use it,
and never reintroduce a bare fallback to the central collection.

## Revalidation — the part that silently no-ops

Publishing from `/internal` must invalidate the KV-backed ISR cache:

- `revalidatePath` only works because **`NEXT_TAG_CACHE_KV` is bound** in `wrangler.jsonc`.
  Without that binding OpenNext falls back to a dummy tag cache and revalidation is a no-op that
  reports success.
- Pass **concrete URLs untyped**: `revalidatePath("/post/my-slug")`. The `"page"` second argument
  is for *route patterns* (`/post/[slug]`); passing it with a concrete URL fails to match.
- Use `src/lib/revalidateSite.ts` rather than calling `revalidatePath` directly.

## Blog publishing

- Markdown → Portable Text on the way in; editor is TipTap
  (`src/components/internal/RichTextEditor.tsx`).
- **Body images must be Sanity-hosted.** A remote `![](url)` publishes as a plain link. Images
  are sideloaded into Sanity on publish — keep that step wired into every publish path.
- A draft links to its Sanity document via `sanity_doc_id`. Editing a published post must update
  the existing document, not fork a second one on the same slug.

## Schema changes

Adding a field: update the schema in `src/sanity/schemas/`, extend the GROQ projection that reads
it, then the consuming component. A field absent from the projection is `undefined` at runtime
with no type error — GROQ results are not type-checked against the schema.
