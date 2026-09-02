// VideoObject structured data for YouTube-embedded content videos.
//
// Why this exists: <YouTubeEmbed /> is a click-to-load facade — it renders a
// thumbnail <img> and only injects the YouTube <iframe> after a click. That is
// great for performance, but it means Googlebot never sees a video element on
// the page, so none of our real content videos are eligible for video
// indexing ("Video isn't on a watch page" in Search Console — the only videos
// Google could see were the decorative muted <video> hero loops).
//
// Emitting VideoObject JSON-LD is Google's recommended way to declare a video
// regardless of how it is loaded, and the only way to make a faceted/embedded
// video discoverable. See schema.org/VideoObject and
// developers.google.com/search/docs/appearance/structured-data/video.
//
// The video urls themselves come from Sanity (page docs and blog bodies),
// which carries no upload date — so the dates live in
// videoCatalog.generated.ts, refreshed from YouTube by
// `node scripts/sync-video-catalog.mjs`.

import { GENERATED_VIDEO_CATALOG } from "./videoCatalog.generated"

export type VideoCatalogEntry = {
  /** Human title shown as the VideoObject `name`. Required by Google. */
  name: string
  /** One–two sentence summary. Required by Google; falls back to `name`. */
  description?: string
  /**
   * Publish date in ISO 8601 (e.g. "2020-06-23T01:00:36-07:00"). Required by
   * Google: without it Search Console reports `Missing field "uploadDate"`
   * and the video is not eligible for video results.
   */
  uploadDate: string
  /** Runtime in ISO 8601 duration (e.g. "PT4M12S"). Recommended, optional. */
  duration?: string
}

// Titles that call sites pass as a generic placeholder — UniversalPageTemplate
// falls back to "Video" and BlogPostTemplate numbers them "Video 1", "Video 2".
// We never name a VideoObject one of those; the catalog title is used instead.
const GENERIC_TITLE = /^(youtube |case study )?video( \d+)?$/i

export function youTubeThumbnails(id: string): string[] {
  // maxres first (sharpest), hq as the always-present fallback.
  return [
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  ]
}

export function youTubeEmbedUrl(id: string): string {
  return `https://www.youtube.com/embed/${id}`
}

export function youTubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`
}

export type VideoObjectInput = {
  id: string
  title?: string
  description?: string
  uploadDate?: string
  duration?: string
}

/**
 * Build a schema.org VideoObject for a YouTube video, merging the generated
 * catalog with any per-call overrides.
 *
 * Returns null unless we have both a real name and an uploadDate — a
 * VideoObject missing either is invalid markup that Search Console reports as
 * an error and that can never make the video eligible for video results, so
 * emitting nothing is strictly better. A video that lands here without an
 * entry just needs `node scripts/sync-video-catalog.mjs` re-run.
 */
export function buildVideoObject(input: VideoObjectInput): Record<string, unknown> | null {
  const catalog = GENERATED_VIDEO_CATALOG[input.id]

  const uploadDate = input.uploadDate || catalog?.uploadDate
  if (!uploadDate) return null

  const passedName = input.title?.trim()
  // Prefer the catalog title over a generic placeholder passed by a call site.
  const name = passedName && !GENERIC_TITLE.test(passedName) ? passedName : catalog?.name
  if (!name) return null

  const description = input.description?.trim() || catalog?.description || name
  const duration = input.duration || catalog?.duration

  const obj: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: youTubeThumbnails(input.id),
    embedUrl: youTubeEmbedUrl(input.id),
    contentUrl: youTubeWatchUrl(input.id),
    uploadDate,
  }
  if (duration) obj.duration = duration
  return obj
}
