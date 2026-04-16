"use client"

import { urlFor } from "@/sanity/image"
import type { SanityImageRef } from "./types"

interface CaseStudyCard {
  _key?: string
  title?: string
  description?: string
  personName?: string
  personRole?: string
  image?: SanityImageRef
  videoUrl?: string
}

interface CaseStudyCardsSectionProps {
  heading?: string
  cards?: CaseStudyCard[]
}

function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try { return urlFor(ref).url() } catch { return null }
}

function toEmbedUrl(url?: string): string | null {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (match) return `https://www.youtube.com/embed/${match[1]}`
  return url
}

export default function CaseStudyCardsSection({
  heading,
  cards = [],
}: CaseStudyCardsSectionProps) {
  if (cards.length === 0) return null

  return (
    <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
        {heading && (
          <h2
            className="text-section-h2 text-black"
            style={{ marginBottom: 48 }}
          >
            {heading}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 28 }}>
          {cards.map((card, i) => {
            const imageSrc = safeImageUrl(card.image)
            const embedUrl = toEmbedUrl(card.videoUrl)
            return (
              <div
                key={card._key || i}
                className="bg-white rounded-card border border-[#e8e6e6] overflow-hidden flex flex-col shadow-whisper"
              >
                {/* Media: video or image */}
                {embedUrl ? (
                  <div style={{ aspectRatio: "16 / 9" }}>
                    <iframe
                      src={embedUrl}
                      title={card.title || "Case study video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                      style={{ border: 0 }}
                    />
                  </div>
                ) : imageSrc ? (
                  <div style={{ aspectRatio: "16 / 9" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageSrc}
                      alt={card.title || "Case study"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}

                {/* Content */}
                <div style={{ padding: 28, flex: 1 }}>
                  {card.title && (
                    <h3
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: "#2b074d",
                      }}
                    >
                      {card.title}
                    </h3>
                  )}
                  {card.description && (
                    <p
                      style={{
                        fontSize: 15,
                        lineHeight: "22.5px",
                        color: "black",
                        marginTop: 12,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {card.description}
                    </p>
                  )}
                  {card.personName && (
                    <div style={{ marginTop: 16 }}>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#2b074d",
                        }}
                      >
                        {card.personName}
                      </p>
                      {card.personRole && (
                        <p
                          style={{
                            fontSize: 13,
                            color: "#595959",
                          }}
                        >
                          {card.personRole}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
