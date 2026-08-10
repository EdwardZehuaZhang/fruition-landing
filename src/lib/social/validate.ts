/**
 * Publishability rules for a single social post, in one place.
 *
 * Deliberately dependency-free and constraint-driven rather than reading the
 * platform registry itself: the composer runs these in the browser as you type
 * (so the blockers are live, not one save behind), and every publish/schedule
 * route runs the same function server-side before touching Zernio. Keeping the
 * rules here rather than in zernio.ts also keeps that module byte-identical to
 * its marketa-monorepo mirror, and keeps account ids out of the client bundle.
 */

export interface PlatformConstraints {
  label: string
  limit: number
  titleLimit?: number
  titleRequired?: boolean
  needsMedia: boolean
  supportsMedia: boolean
}

export interface DraftValues {
  content: string
  title?: string
  /** "" or undefined = no image attached. */
  mediaUrl?: string
}

/**
 * Every reason this post can't go out, in plain English. Empty array = good.
 * Messages are user-facing: they name the channel and say what to do.
 */
export function problemsFor(spec: PlatformConstraints, values: DraftValues): string[] {
  const problems: string[] = []
  const content = values.content?.trim() ?? ""
  const title = values.title?.trim() ?? ""

  // A Reddit post with a title and no body is still a valid post.
  if (!content && !(spec.titleRequired && title)) {
    problems.push(`${spec.label}: the caption is empty.`)
  }
  if (content.length > spec.limit) {
    const over = content.length - spec.limit
    problems.push(`${spec.label}: ${over} character${over === 1 ? "" : "s"} over the ${spec.limit} limit.`)
  }
  if (spec.titleRequired && !title) {
    problems.push(`${spec.label}: a title is required.`)
  }
  if (spec.titleLimit && title.length > spec.titleLimit) {
    const over = title.length - spec.titleLimit
    problems.push(`${spec.label}: the title is ${over} character${over === 1 ? "" : "s"} over the ${spec.titleLimit} limit.`)
  }
  if (spec.needsMedia && !values.mediaUrl) {
    problems.push(`${spec.label}: an image is required.`)
  }
  if (values.mediaUrl && !spec.supportsMedia) {
    problems.push(`${spec.label}: this channel is text-only.`)
  }
  return problems
}
