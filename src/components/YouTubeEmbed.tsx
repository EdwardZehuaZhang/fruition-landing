"use client"

import { useState } from "react"

interface YouTubeEmbedProps {
  /** Full YouTube URL or embed URL. videoId extracted automatically. */
  url?: string
  /** Direct video id (overrides url). */
  videoId?: string
  title?: string
  className?: string
  style?: React.CSSProperties
}

function extractVideoId(input?: string): string | null {
  if (!input) return null
  try {
    const u = new URL(input)
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace(/^\//, "") || null
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) {
        return u.pathname.replace("/embed/", "") || null
      }
      return u.searchParams.get("v")
    }
  } catch {
    return null
  }
  return null
}

/**
 * High-quality YouTube facade. Renders a sharp maxresdefault.jpg poster
 * until the user clicks play, then swaps to the iframe. Avoids the
 * blurry default YouTube preview thumbnail.
 */
export default function YouTubeEmbed({ url, videoId, title, className, style }: YouTubeEmbedProps) {
  const id = videoId || extractVideoId(url)
  const [playing, setPlaying] = useState(false)
  if (!id) return null
  const posterMax = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
  const posterHq = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
        title={title || "YouTube video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={className}
        style={{ border: 0, width: "100%", height: "100%", ...style }}
      />
    )
  }

  return (
    <button
      type="button"
      aria-label={title ? `Play ${title}` : "Play video"}
      onClick={() => setPlaying(true)}
      className={`relative w-full h-full block group ${className ?? ""}`}
      style={{ padding: 0, border: 0, cursor: "pointer", background: "black", ...style }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterMax}
        onError={(e) => {
          const img = e.currentTarget
          if (img.src !== posterHq) img.src = posterHq
        }}
        alt={title || "Video thumbnail"}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center transition-opacity group-hover:opacity-90"
      >
        <span
          className="flex items-center justify-center rounded-full"
          style={{
            width: 72,
            height: 72,
            background: "rgba(0,0,0,0.7)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  )
}
