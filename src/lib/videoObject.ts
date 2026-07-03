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
// video discoverable. See:
// node_modules/next/dist/docs (Metadata) + schema.org/VideoObject.

export type VideoCatalogEntry = {
  /** Human title shown as the VideoObject `name`. Required by Google. */
  name: string
  /** One–two sentence summary. Required by Google; falls back to `name`. */
  description?: string
  /**
   * Publish date in ISO 8601 (e.g. "2024-05-01"). Required by Google for a
   * video to be eligible for video results. Left undefined until the real
   * date is known — the builder omits the field rather than inventing one.
   */
  uploadDate?: string
  /** Runtime in ISO 8601 duration (e.g. "PT4M12S"). Recommended, optional. */
  duration?: string
}

// Known, hardcoded YouTube videos keyed by their video id. Titles mirror what
// already ships in the UI; uploadDate is the real YouTube publish date
// (confirmed against each video's YouTube Studio entry). Add `description`
// per entry to further enrich the markup.
export const VIDEO_CATALOG: Record<string, VideoCatalogEntry> = {
  eoOCR6OjJhI: {
    name: "Everything you need to know to get started with monday CRM",
    uploadDate: "2025-04-02",
  },
  _0MhMjicbIM: {
    name: "monday.com consulting partner overview",
    uploadDate: "2023-08-06",
  },
  g83dt0bCG4I: {
    name: "Improve your HR processes",
    uploadDate: "2020-12-03",
  },
  "7vtrtlfC1Zg": {
    name: "monday CRM Success Story - Star Aviation | Powered by Fruition",
    uploadDate: "2025-11-17",
  },
}

// Titles that call sites pass as a generic placeholder. We refuse to emit a
// VideoObject named one of these — junk `name` values hurt more than they help.
const GENERIC_TITLES = new Set([
  "video",
  "youtube video",
  "case study video",
])

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
 * Build a schema.org VideoObject for a YouTube video, merging any catalog
 * entry with per-call overrides. Returns null when no meaningful name is
 * available (so we never emit placeholder-named markup). Undefined fields are
 * omitted so partial-but-valid markup ships today and completes once the
 * uploadDate/description are filled in.
 */
export function buildVideoObject(input: VideoObjectInput): Record<string, unknown> | null {
  const catalog = VIDEO_CATALOG[input.id]
  const rawName = input.title?.trim() || catalog?.name
  if (!rawName) return null
  // Prefer a catalog name over a generic placeholder passed by a call site.
  const isGeneric = GENERIC_TITLES.has(rawName.toLowerCase())
  const name = isGeneric ? catalog?.name : rawName
  if (!name) return null

  const description = input.description?.trim() || catalog?.description || name
  const uploadDate = input.uploadDate || catalog?.uploadDate
  const duration = input.duration || catalog?.duration

  const obj: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: youTubeThumbnails(input.id),
    embedUrl: youTubeEmbedUrl(input.id),
    contentUrl: youTubeWatchUrl(input.id),
  }
  if (uploadDate) obj.uploadDate = uploadDate
  if (duration) obj.duration = duration
  return obj
}
