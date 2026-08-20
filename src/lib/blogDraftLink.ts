import { getBlogPostCacheKeys, findBlogPostIdBySlug } from "@/lib/sanityWriteClient"

/**
 * Work out which live Sanity post (if any) a portal draft is the editing copy of.
 *
 * This is the link that used to be missing. The draft editor rendered without a
 * doc id, so it offered "Publish" instead of "Update", and the publish route
 * fell back to the id `blog-portal-<slug>` — a *different* document whenever the
 * live post came from Marketa, monday, a migration or the Studio. The edit
 * landed in a brand-new doc, the live post never changed, and the site ended up
 * with two documents fighting over one slug.
 *
 * Resolution order, most to least trustworthy:
 *   1. `metadata.sanity_doc_id` — written back by the editor on every publish.
 *   2. `blog-portal-<slug>` — the id the portal has always minted.
 *   3. whichever post currently owns the slug — covers posts published by
 *      anything other than this portal.
 */
export async function resolveLiveDocId(
  metadata: Record<string, unknown> | null | undefined,
  slug: string | null | undefined,
): Promise<string | null> {
  const meta = metadata ?? {}
  const recorded = typeof meta.sanity_doc_id === "string" ? meta.sanity_doc_id : null
  if (recorded && (await getBlogPostCacheKeys(recorded).catch(() => null))) return recorded

  if (slug) {
    const conventional = `blog-portal-${slug}`
    if (await getBlogPostCacheKeys(conventional).catch(() => null)) return conventional
    return await findBlogPostIdBySlug(slug).catch(() => null)
  }
  return null
}
