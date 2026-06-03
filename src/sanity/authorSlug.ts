/**
 * Turn a free-text blog author name into a URL slug.
 *
 * Blog posts store `author` as a plain string (no Sanity slug), so the same
 * function has to run in the route, the queries, and the bylines to keep the
 * `/author/[slug]` URLs consistent. Mirrors the slugify shape in scripts/helpers.ts.
 */
export function authorSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}
