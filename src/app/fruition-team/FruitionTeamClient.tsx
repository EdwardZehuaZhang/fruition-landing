"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { urlFor } from "@/sanity/image"
import type { PartnerBadge, SanityImageRef } from "@/components/sections/types"

export interface TeamMember {
  _id: string
  name: string
  role?: string
  emoji?: string
  photo?: SanityImageRef
  bio?: string
  linkedinUrl?: string
  regions?: string[]
  order?: number
}

interface Props {
  members: TeamMember[]
  heroHeading: string
  calendlyUrl: string
  partnerBadges: PartnerBadge[]
  certificationBadge?: SanityImageRef
}

const REGIONS = [
  { value: "AU", label: "Meet the Australia Team", flag: "🇦🇺" },
  { value: "UK", label: "Meet the UK Team", flag: "🇬🇧" },
  { value: "US", label: "Meet the US Team", flag: "🇺🇸" },
] as const

function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).width(560).height(560).fit("crop").url()
  } catch {
    return null
  }
}

function safeBadgeUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).url()
  } catch {
    return null
  }
}

export default function FruitionTeamClient({
  members,
  heroHeading,
  calendlyUrl,
  partnerBadges,
}: Props) {
  const [region, setRegion] = useState<string>("AU")

  const filteredMembers = useMemo(() => {
    return members.filter((m) => Array.isArray(m.regions) && m.regions.includes(region))
  }, [members, region])

  return (
    <div>
      {/* Hero */}
      <section className="bg-white">
        <div
          className="mx-auto flex flex-col items-center"
          style={{
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 80,
            paddingBottom: 60,
            maxWidth: 1100,
          }}
        >
          {partnerBadges.length > 0 && (
            <div className="flex items-center flex-wrap justify-center" style={{ gap: 22 }}>
              {partnerBadges.map((badge, i) => {
                const src = safeBadgeUrl(badge.image)
                if (!src) return null
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={badge._key || `badge-${i}`}
                    src={src}
                    alt={badge.name || "Partner badge"}
                    width={120}
                    height={44}
                    className="h-[44px] w-auto rounded-[5px]"
                  />
                )
              })}
            </div>
          )}

          <h1
            className="text-center font-bold"
            style={{
              fontSize: 48,
              lineHeight: "60px",
              marginTop: partnerBadges.length > 0 ? 36 : 0,
              maxWidth: 920,
              color: "black",
            }}
          >
            {heroHeading}
          </h1>

          <Link
            href={calendlyUrl}
            className="flex items-center justify-center font-bold text-white"
            style={{
              marginTop: 32,
              width: 240,
              height: 53,
              borderRadius: 100,
              background: "linear-gradient(to right, #8015e8, #ba83f0)",
              fontSize: 16,
            }}
          >
            {"\uD83D\uDE80 Book a Meeting"}
          </Link>

          {/* Description */}
          <div
            className="flex flex-col text-center"
            style={{ gap: 20, marginTop: 48, maxWidth: 880 }}
          >
            <p style={{ fontSize: 17, lineHeight: "28px", color: "#222" }}>
              The Fruition team consists of 37 highly talented consultants that are fully certified
              in disciplines such as monday.com, Atlassian, Make, n8n, and Hootsuite.
            </p>
            <p style={{ fontSize: 17, lineHeight: "28px", color: "#222" }}>
              We are globally certified and insured in all regions with the tools we partner proudly
              partner and understand the importance of IP and data security as our core.
            </p>
            <p style={{ fontSize: 17, lineHeight: "28px", color: "#222" }}>
              The Fruition team comes from all walks of life. Our managing director, Josh is an
              ex-monday.com employee with 15 years of experience in software transformation and
              change management, bringing over four years of direct experience from monday.com.
            </p>
            <p
              className="font-bold"
              style={{ fontSize: 22, lineHeight: "30px", color: "#2b074d", marginTop: 8 }}
            >
              The Fruition team&apos;s vision is simple
            </p>
            <p style={{ fontSize: 17, lineHeight: "28px", color: "#222" }}>
              Implement software differently by making the process enjoyable, fast, and transparent.
              We thrive on understanding how your business ticks and finding ways to help you
              streamline and thrive in any business climate.
            </p>
          </div>
        </div>
      </section>

      {/* Region selector tabs */}
      <section className="bg-white">
        <div className="mx-auto px-4" style={{ maxWidth: 1100 }}>
          <div
            className="flex items-center justify-center flex-wrap"
            style={{ gap: 16, paddingTop: 8, paddingBottom: 8 }}
          >
            {REGIONS.map((r) => {
              const active = region === r.value
              return (
                <button
                  key={r.value}
                  onClick={() => setRegion(r.value)}
                  className="cursor-pointer transition-all"
                  style={{
                    padding: "12px 28px",
                    borderRadius: 100,
                    fontSize: 16,
                    fontWeight: 600,
                    ...(active
                      ? {
                          background: "linear-gradient(to right, #8015e8, #ba83f0)",
                          color: "white",
                          boxShadow: "2.83px 2.83px 15px 3px rgba(0,0,0,0.18)",
                          border: "none",
                        }
                      : {
                          backgroundColor: "white",
                          color: "#2b074d",
                          border: "1px solid #e8e6e6",
                        }),
                  }}
                >
                  {r.label} {r.flag}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team grid */}
      <section className="bg-white" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
          {filteredMembers.length === 0 ? (
            <p className="text-center" style={{ color: "#666", fontSize: 16 }}>
              No team members listed for this region yet.
            </p>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              style={{ gap: 28 }}
            >
              {filteredMembers.map((m) => {
                const photo = safeImageUrl(m.photo)
                return (
                  <article
                    key={m._id}
                    className="bg-white rounded-card border border-[#e8e6e6] overflow-hidden flex flex-col shadow-whisper"
                  >
                    <div
                      style={{
                        aspectRatio: "1 / 1",
                        backgroundColor: "#f5f0ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photo}
                          alt={m.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span style={{ fontSize: 80 }}>{m.emoji || "🍎"}</span>
                      )}
                    </div>
                    <div className="flex flex-col" style={{ padding: 24, flex: 1 }}>
                      {m.role && (
                        <p
                          className="font-semibold"
                          style={{
                            fontSize: 13,
                            color: "#8015e8",
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                          }}
                        >
                          {m.role}
                        </p>
                      )}
                      <h3
                        className="font-bold"
                        style={{
                          fontSize: 22,
                          lineHeight: "28px",
                          color: "#2b074d",
                          marginTop: 8,
                        }}
                      >
                        {m.name} {m.emoji && <span>{m.emoji}</span>}
                      </h3>
                      {m.bio && (
                        <p
                          style={{
                            fontSize: 14,
                            lineHeight: "22px",
                            color: "#444",
                            marginTop: 14,
                            flex: 1,
                          }}
                        >
                          {m.bio}
                        </p>
                      )}
                      {m.linkedinUrl && (
                        <Link
                          href={m.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold"
                          style={{
                            marginTop: 16,
                            color: "#8015e8",
                            fontSize: 14,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          LinkedIn →
                        </Link>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
