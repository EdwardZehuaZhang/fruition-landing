/**
 * Which images a channel carries, and in what order.
 *
 * Kept apart from composition.ts because the composer runs this in the browser
 * as images are added, and composition.ts reaches Supabase. Deliberately
 * dependency-free for the same reason validate.ts is.
 */

/**
 * Add one image to a channel's list.
 *
 * A channel that publishes a carousel (Instagram, X) APPENDS: the order images
 * are added is the order they are swiped, and a full carousel refuses the
 * extra rather than dropping a slide at publish time. A single-image channel
 * REPLACES, which is what it has always done and all it can send.
 */
export function withImage(current: string[], url: string, maxMedia: number): string[] {
  if (!url || current.includes(url)) return current
  if (maxMedia <= 1) return [url]
  if (current.length >= maxMedia) return current
  return [...current, url]
}
