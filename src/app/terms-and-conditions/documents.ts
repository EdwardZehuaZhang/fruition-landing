/**
 * The two governing documents shown on /terms-and-conditions.
 *
 * This is the single source of truth that ties together:
 *   - `key`   → the `_key` of the matching item in the Sanity `terms-and-conditions`
 *               page `documents[]` array (set in scripts/sanity-migrate/privacy-and-terms.ts).
 *   - `slug`  → the clean, on-domain URL segment. Each PDF is served at
 *               /terms-and-conditions/<slug> instead of a raw cdn.sanity.io hash link.
 *   - `label` → the display name rendered on the page tile.
 *
 * The bytes are still streamed live from whatever file is attached to the matching
 * Sanity item (see ./[file]/route.ts), so editors can swap a PDF in Sanity Studio
 * without the public URL ever changing.
 */
export interface GoverningDoc {
  key: string
  slug: string
  label: string
}

export const GOVERNING_DOCS: GoverningDoc[] = [
  {
    key: "doc-terms",
    slug: "service-agreement-uk.pdf",
    label: "Service Agreement (UK)",
  },
  {
    key: "doc-agreement",
    slug: "service-agreement-apac.pdf",
    label: "Service Agreement (APAC)",
  },
]
