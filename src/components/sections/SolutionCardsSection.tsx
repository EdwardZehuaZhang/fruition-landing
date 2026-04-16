"use client"

import Link from "next/link"
import { urlFor } from "@/sanity/image"
import type { SanityImageRef } from "./types"

interface SolutionCard {
  _key?: string
  eyebrow?: string
  heading?: string
  body?: string
  ctaLabel?: string
  ctaUrl?: string
  image?: SanityImageRef
}

interface SolutionCardsSectionProps {
  cards?: SolutionCard[]
}

function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try { return urlFor(ref).url() } catch { return null }
}

export default function SolutionCardsSection({
  cards = [],
}: SolutionCardsSectionProps) {
  if (cards.length === 0) return null

  return (
    <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
        <div className="flex flex-col" style={{ gap: 60 }}>
          {cards.map((card, i) => {
            const imageSrc = safeImageUrl(card.image)
            const isEven = i % 2 === 0
            return (
              <div
                key={card._key || i}
                className="flex items-start"
                style={{
                  gap: 48,
                  flexDirection: isEven ? "row" : "row-reverse",
                }}
              >
                <div style={{ flex: 1 }}>
                  {card.eyebrow && (
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#8015e8",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      {card.eyebrow}
                    </p>
                  )}
                  {card.heading && (
                    <h3
                      style={{
                        fontSize: 28,
                        fontWeight: 600,
                        color: "#2b074d",
                        marginTop: card.eyebrow ? 8 : 0,
                      }}
                    >
                      {card.heading}
                    </h3>
                  )}
                  {card.body && (
                    <p
                      style={{
                        fontSize: 16,
                        lineHeight: "25.6px",
                        color: "black",
                        marginTop: 20,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {card.body}
                    </p>
                  )}
                  {card.ctaLabel && card.ctaUrl && (
                    <Link
                      href={card.ctaUrl}
                      className="inline-flex items-center justify-center font-bold text-white"
                      style={{
                        height: 53,
                        paddingLeft: 32,
                        paddingRight: 32,
                        borderRadius: 100,
                        background: "linear-gradient(to right, #8015e8, #ba83f0)",
                        fontSize: 16,
                        marginTop: 24,
                      }}
                    >
                      {card.ctaLabel}
                    </Link>
                  )}
                </div>
                {imageSrc && (
                  <div
                    className="rounded-card overflow-hidden shadow-whisper"
                    style={{ flex: 1, aspectRatio: "16 / 10" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageSrc}
                      alt={card.heading || ""}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
