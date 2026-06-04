"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"
import { urlFor } from "@/sanity/image"
import CtaButton from "@/components/CtaButton"
import CalendlySection from "@/components/sections/CalendlySection"
import FaqAccordion from "@/components/sections/FaqAccordion"
import type {
  CapabilityCard,
  ComparisonTab,
  FaqTab,
  MethodologyStep,
  PartnerBadge,
  SanityImageRef,
  SiteSettingsData,
  StatItem,
} from "@/components/sections/types"

interface TextSection {
  _key?: string
  heading?: string
  headingAccent?: string
  body?: string
}

interface OfficeEntry {
  _key?: string
  city?: string
  country?: string
  flag?: string
  note?: string
}

interface AboutModernProps {
  heroEyebrow?: string
  heroHeadingPart1?: string
  heroHeadingAccent?: string
  heroHeadingPart2?: string
  heroSubheading?: string
  heroImage?: SanityImageRef
  heroPartnerBadgesLabel?: string
  heroCalloutBadgeLabel?: string
  heroCalloutBadgeText?: string
  heroCalloutOfficesText?: string
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
  partnerBadges?: PartnerBadge[]
  stats?: StatItem[]
  textSections?: TextSection[]
  storyEyebrow?: string
  storyHeading?: string
  storyHeadingAccent?: string
  storyCardEyebrowPrefix?: string
  capabilitiesEyebrow?: string
  capabilitiesHeading?: string
  capabilityCards?: CapabilityCard[]
  methodologyEyebrow?: string
  methodologyStepLabel?: string
  methodologyHeading?: string
  methodologySteps?: MethodologyStep[]
  approachEyebrow?: string
  approachHeading?: string
  approachHeadingAccent?: string
  comparisonTabs?: ComparisonTab[]
  globalPresenceEyebrow?: string
  globalPresenceHeading?: string
  globalPresenceHeadingAccent?: string
  globalPresenceBody?: string
  offices?: OfficeEntry[]
  partnerStackEyebrow?: string
  faqHeading?: string
  faqTabs?: FaqTab[]
  calendlyHeading?: string
  calendlySubheading?: string
  calendlyUrl: string
  closingCtaHeading?: string
  closingCtaBody?: string
  closingCtaPrimaryLabel?: string
  closingCtaSecondaryLabel?: string
  closingCtaSecondaryUrl?: string
  siteSettings?: SiteSettingsData | null
}

function safeUrl(ref: SanityImageRef, width = 1600): string | null {
  if (!ref?.asset?._ref) return null
  try {
    return urlFor(ref).width(width).auto("format").url()
  } catch {
    return null
  }
}

function badgeUrl(b: PartnerBadge): string | null {
  return safeUrl(b.image, 320)
}

function HeroSection({
  eyebrow,
  headingPart1,
  headingAccent,
  headingPart2,
  subheading,
  heroImage,
  primaryCtaLabel,
  primaryCtaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
  partnerBadges = [],
  partnerBadgesLabel,
  calloutBadgeLabel,
  calloutBadgeText,
  calloutOfficesText,
}: {
  eyebrow?: string
  headingPart1?: string
  headingAccent?: string
  headingPart2?: string
  subheading?: string
  heroImage?: SanityImageRef
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
  partnerBadges?: PartnerBadge[]
  partnerBadgesLabel?: string
  calloutBadgeLabel?: string
  calloutBadgeText?: string
  calloutOfficesText?: string
}) {
  const imgUrl = safeUrl(heroImage, 1800)
  const featured = partnerBadges.slice(0, 4)

  return (
    <section className="relative overflow-hidden" style={{ paddingTop: 96, paddingBottom: 96 }}>
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1100px 600px at 12% -10%, rgba(128, 21, 232, 0.18), transparent 60%), radial-gradient(900px 500px at 95% 0%, rgba(70, 116, 251, 0.12), transparent 55%), linear-gradient(180deg, #f7f4ff 0%, #ffffff 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(128, 21, 232, 0.18) 1px, transparent 0)",
          backgroundSize: "28px 28px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 1240 }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center" style={{ gap: 56 }}>
          <div className="lg:col-span-6">
            {eyebrow && (
              <span
                className="inline-flex items-center"
                style={{
                  gap: 8,
                  height: 34,
                  padding: "0 14px",
                  borderRadius: 9999,
                  background: "rgba(128, 21, 232, 0.08)",
                  color: "var(--purple-dark)",
                  border: "1px solid rgba(128, 21, 232, 0.18)",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: 0.4,
                  textTransform: "uppercase",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: 9999, background: "var(--purple-primary)" }} />
                {eyebrow}
              </span>
            )}

            <h1
              className="text-display"
              style={{
                marginTop: 20,
                fontSize: "clamp(32px, 5.4vw, 64px)",
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                color: "var(--dark-bg)",
              }}
            >
              {headingPart1}
              {headingAccent && (
                <>
                  {" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #8015e8 0%, #4674FB 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {headingAccent}
                  </span>
                </>
              )}
              {headingPart2 && <> {headingPart2}</>}
            </h1>

            {subheading && (
              <p
                className="text-body-lead"
                style={{ marginTop: 20, maxWidth: 560, color: "#3f4256" }}
              >
                {subheading}
              </p>
            )}

            <div className="flex flex-wrap" style={{ marginTop: 32, gap: 14 }}>
              {primaryCtaLabel && primaryCtaUrl && (
                <CtaButton href={primaryCtaUrl} label={primaryCtaLabel} variant="primary" />
              )}
              {secondaryCtaLabel && secondaryCtaUrl && (
                <CtaButton href={secondaryCtaUrl} label={secondaryCtaLabel} variant="outline" />
              )}
            </div>

            <div className="flex flex-wrap items-center" style={{ marginTop: 36, gap: 28 }}>
              {partnerBadgesLabel && (
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#686b82" }}>
                  {partnerBadgesLabel}
                </span>
              )}
              <div className="flex flex-wrap items-center" style={{ gap: 22 }}>
                {featured.map((b, i) => {
                  const u = badgeUrl(b)
                  if (!u) return null
                  return (
                    <span key={b._key || i} className="relative inline-block" style={{ height: 28, width: 84 }}>
                      <Image
                        src={u}
                        alt={b.name || ""}
                        fill
                        sizes="84px"
                        style={{ objectFit: "contain", objectPosition: "left center" }}
                      />
                    </span>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <div
                className="absolute"
                style={{
                  inset: -22,
                  borderRadius: 32,
                  background:
                    "linear-gradient(135deg, rgba(128, 21, 232, 0.22), rgba(70, 116, 251, 0.12) 60%, transparent)",
                  filter: "blur(28px)",
                }}
                aria-hidden
              />
              <div
                className="relative overflow-hidden"
                style={{
                  borderRadius: 28,
                  boxShadow: "0 30px 80px -30px rgba(16, 0, 58, 0.45), 0 2px 8px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(128, 21, 232, 0.16)",
                  background: "#fff",
                  aspectRatio: "16 / 11",
                }}
              >
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt="Fruition team"
                    fill
                    sizes="(min-width: 1024px) 640px, 100vw"
                    style={{ objectFit: "cover" }}
                    priority
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg, #2b074d 0%, #10003a 100%)",
                    }}
                  />
                )}
              </div>

              {(calloutBadgeLabel || calloutBadgeText) && (
                <div
                  className="absolute"
                  style={{
                    right: -16,
                    bottom: -22,
                    background: "#ffffff",
                    borderRadius: 18,
                    padding: "14px 18px",
                    boxShadow: "0 18px 40px -12px rgba(16, 0, 58, 0.25)",
                    border: "1px solid rgba(128, 21, 232, 0.18)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 9999,
                      background: "#10b981",
                      boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.16)",
                    }}
                  />
                  <div>
                    {calloutBadgeLabel && (
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#686b82", letterSpacing: 0.6, textTransform: "uppercase" }}>
                        {calloutBadgeLabel}
                      </div>
                    )}
                    {calloutBadgeText && (
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--dark-bg)" }}>
                        {calloutBadgeText}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {calloutOfficesText && (
                <div
                  className="absolute hidden md:flex"
                  style={{
                    left: -22,
                    top: 28,
                    background: "#ffffff",
                    borderRadius: 16,
                    padding: "10px 14px",
                    boxShadow: "0 18px 40px -12px rgba(16, 0, 58, 0.2)",
                    border: "1px solid rgba(0,0,0,0.06)",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", marginRight: 2 }}>
                    {["#8015e8", "#4674FB", "#ec4899"].map((c, i) => (
                      <span
                        key={i}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 9999,
                          background: c,
                          border: "2px solid #fff",
                          marginLeft: i ? -8 : 0,
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dark-bg)" }}>{calloutOfficesText}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsBand({ stats }: { stats: StatItem[] }) {
  if (!stats?.length) return null
  return (
    <section style={{ paddingTop: 16, paddingBottom: 72 }}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 1240 }}>
        <div
          className="grid grid-cols-1 sm:grid-cols-3"
          style={{
            borderRadius: 28,
            background: "linear-gradient(135deg, #10003a 0%, #2b074d 100%)",
            color: "#fff",
            padding: "44px 24px",
            boxShadow: "0 24px 60px -28px rgba(16, 0, 58, 0.55)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(600px 200px at 20% 0%, rgba(128, 21, 232, 0.35), transparent 60%), radial-gradient(500px 200px at 90% 100%, rgba(70, 116, 251, 0.25), transparent 60%)",
            }}
          />
          {stats.map((s, i) => (
            <div
              key={s._key || i}
              className="relative text-center"
              style={{
                padding: "12px 16px",
                borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(38px, 4.6vw, 56px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  background: "linear-gradient(135deg, #ffffff 0%, #ba83f0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 14,
                  letterSpacing: 0.6,
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.75)",
                  fontWeight: 600,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StorySection({
  sections,
  eyebrow,
  heading,
  headingAccent,
  cardEyebrowPrefix,
}: {
  sections: TextSection[]
  eyebrow?: string
  heading?: string
  headingAccent?: string
  cardEyebrowPrefix?: string
}) {
  if (!sections?.length) return null
  return (
    <section style={{ paddingTop: 72, paddingBottom: 72, background: "#fff" }}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 1100 }}>
        <div className="text-center" style={{ marginBottom: 56 }}>
          {eyebrow && (
            <span
              className="inline-flex items-center"
              style={{
                padding: "4px 12px",
                borderRadius: 9999,
                background: "rgba(128, 21, 232, 0.08)",
                color: "var(--purple-dark)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.8,
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </span>
          )}
          {(heading || headingAccent) && (
            <h2 className="text-section-h2" style={{ marginTop: 16, color: "var(--dark-bg)" }}>
              {heading}
              {headingAccent && (
                <>
                  {" "}
                  <span style={{ color: "var(--purple-primary)" }}>{headingAccent}</span>
                </>
              )}
            </h2>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 32 }}>
          {sections.map((s, i) => (
            <article
              key={s._key || i}
              style={{
                position: "relative",
                padding: 32,
                borderRadius: 24,
                background: i % 2 === 0 ? "#ffffff" : "linear-gradient(160deg, #f6f1ff 0%, #ffffff 70%)",
                border: "1px solid rgba(128, 21, 232, 0.12)",
                boxShadow: "0 10px 30px -18px rgba(16, 0, 58, 0.18)",
                overflow: "hidden",
              }}
            >
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 110,
                  height: 110,
                  borderRadius: 9999,
                  background: "rgba(128, 21, 232, 0.08)",
                }}
              />
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  color: "var(--purple-primary)",
                  marginBottom: 14,
                }}
              >
                0{i + 1}
                {cardEyebrowPrefix && <> · {cardEyebrowPrefix}</>}
              </div>
              <h3 className="text-section-h3" style={{ color: "var(--dark-bg)" }}>
                {s.heading}
                {s.headingAccent && (
                  <span style={{ color: "var(--purple-primary)" }}> {s.headingAccent}</span>
                )}
              </h3>
              <div
                style={{
                  marginTop: 16,
                  color: "#3f4256",
                  fontSize: 16,
                  lineHeight: 1.6,
                  whiteSpace: "pre-line",
                }}
              >
                {s.body}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ChallengesBento({
  eyebrow,
  heading,
  cards,
}: {
  eyebrow?: string
  heading?: string
  cards: CapabilityCard[]
}) {
  if (!cards?.length) return null
  const layout = [
    "md:col-span-2",
    "md:col-span-1",
    "md:col-span-1",
    "md:col-span-1",
    "md:col-span-1",
  ]
  const accent = ["#8015e8", "#4674FB", "#ec4899", "#10b981", "#f59e0b"]
  return (
    <section
      style={{
        paddingTop: 96,
        paddingBottom: 96,
        background:
          "linear-gradient(180deg, #fbf9ff 0%, #ffffff 100%)",
      }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 1240 }}>
        <div className="text-center" style={{ marginBottom: 56 }}>
          {eyebrow && (
            <span
              style={{
                padding: "4px 12px",
                borderRadius: 9999,
                background: "rgba(128, 21, 232, 0.08)",
                color: "var(--purple-dark)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.8,
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </span>
          )}
          <h2 className="text-section-h2" style={{ marginTop: 16, color: "var(--dark-bg)" }}>
            {heading}
          </h2>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 20 }}
        >
          {cards.map((c, i) => {
            const isFeature = i === 0
            return (
              <article
                key={c._key || i}
                className={layout[i] ?? "md:col-span-2"}
                style={{
                  position: "relative",
                  padding: isFeature ? 32 : 26,
                  borderRadius: 24,
                  background: isFeature
                    ? "linear-gradient(155deg, #10003a 0%, #2b074d 100%)"
                    : "#ffffff",
                  color: isFeature ? "#fff" : "var(--dark-bg)",
                  border: isFeature ? "none" : "1px solid #ececf2",
                  boxShadow: isFeature
                    ? "0 30px 60px -28px rgba(16, 0, 58, 0.5)"
                    : "0 8px 24px -16px rgba(16, 0, 58, 0.12)",
                  overflow: "hidden",
                  minHeight: 220,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {isFeature && (
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      right: -50,
                      bottom: -60,
                      width: 220,
                      height: 220,
                      borderRadius: 9999,
                      background: "rgba(128, 21, 232, 0.4)",
                      filter: "blur(24px)",
                    }}
                  />
                )}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: isFeature
                      ? "rgba(255,255,255,0.12)"
                      : `${accent[i % accent.length]}14`,
                    color: accent[i % accent.length],
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    border: isFeature ? "1px solid rgba(255,255,255,0.2)" : "none",
                  }}
                >
                  {c.emoji}
                </div>
                <h3
                  className="text-card-title"
                  style={{
                    color: isFeature ? "#fff" : "var(--dark-bg)",
                    marginTop: 4,
                  }}
                >
                  {c.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: isFeature ? "rgba(255,255,255,0.78)" : "#52556b",
                    margin: 0,
                  }}
                >
                  {c.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function MethodologyTimeline({
  eyebrow,
  stepLabel,
  heading,
  steps,
}: {
  eyebrow?: string
  stepLabel?: string
  heading?: string
  steps: MethodologyStep[]
}) {
  if (!steps?.length) return null
  return (
    <section
      style={{
        paddingTop: 96,
        paddingBottom: 96,
        background: "#10003a",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(800px 400px at 0% 0%, rgba(128, 21, 232, 0.3), transparent 60%), radial-gradient(700px 400px at 100% 100%, rgba(70, 116, 251, 0.18), transparent 60%)",
        }}
      />
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 1100 }}>
        <div className="text-center" style={{ marginBottom: 64 }}>
          {eyebrow && (
            <span
              style={{
                padding: "4px 12px",
                borderRadius: 9999,
                background: "rgba(255,255,255,0.1)",
                color: "#ba83f0",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.8,
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </span>
          )}
          <h2 className="text-section-h2" style={{ marginTop: 16 }}>
            {heading}
          </h2>
        </div>

        <ol style={{ position: "relative", listStyle: "none", padding: 0, margin: 0 }}>
          <span
            aria-hidden
            className="hidden md:block"
            style={{
              position: "absolute",
              left: "50%",
              top: 24,
              bottom: 24,
              width: 2,
              background:
                "linear-gradient(180deg, rgba(186, 131, 240, 0.6), rgba(186, 131, 240, 0.05))",
              transform: "translateX(-1px)",
            }}
          />
          {steps.map((step, i) => {
            const left = i % 2 === 0
            return (
              <li
                key={step._key || i}
                className="grid grid-cols-1 md:grid-cols-2"
                style={{
                  gap: 24,
                  marginBottom: 28,
                  alignItems: "center",
                }}
              >
                <div className={left ? "md:order-1" : "md:order-2"}>
                  <article
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 20,
                      padding: 24,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: 1,
                        color: "#ba83f0",
                      }}
                    >
                      {stepLabel} {step.number}
                    </div>
                    <h3
                      className="text-card-title"
                      style={{ marginTop: 6, color: "#fff" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        marginTop: 10,
                        fontSize: 15,
                        lineHeight: 1.6,
                        color: "rgba(255,255,255,0.72)",
                      }}
                    >
                      {step.description}
                    </p>
                  </article>
                </div>

                <div
                  className={`hidden md:flex ${left ? "md:order-2" : "md:order-1"}`}
                  style={{ justifyContent: left ? "flex-start" : "flex-end" }}
                >
                  <span
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 9999,
                      background: "linear-gradient(135deg, #8015e8, #4674FB)",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 22,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 0 6px rgba(128, 21, 232, 0.15)",
                    }}
                  >
                    {step.number}
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

function ApproachTabs({
  tabs,
  eyebrow,
  heading,
  headingAccent,
}: {
  tabs: ComparisonTab[]
  eyebrow?: string
  heading?: string
  headingAccent?: string
}) {
  const [active, setActive] = useState(0)
  if (!tabs?.length) return null
  const current = tabs[active]
  return (
    <section style={{ paddingTop: 96, paddingBottom: 96, background: "#fff" }}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 1240 }}>
        <div className="text-center" style={{ marginBottom: 40 }}>
          {eyebrow && (
            <span
              style={{
                padding: "4px 12px",
                borderRadius: 9999,
                background: "rgba(128, 21, 232, 0.08)",
                color: "var(--purple-dark)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.8,
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </span>
          )}
          {(heading || headingAccent) && (
            <h2 className="text-section-h2" style={{ marginTop: 16, color: "var(--dark-bg)" }}>
              {heading}
              {headingAccent && (
                <>
                  {" "}
                  <span style={{ color: "var(--purple-primary)" }}>{headingAccent}</span>
                </>
              )}
            </h2>
          )}
        </div>

        <div
          className="flex flex-wrap justify-center"
          style={{
            gap: 8,
            padding: 6,
            background: "#f4f0fb",
            borderRadius: 9999,
            margin: "0 auto 40px",
            width: "fit-content",
            maxWidth: "100%",
          }}
        >
          {tabs.map((t, i) => (
            <button
              key={t._key || i}
              onClick={() => setActive(i)}
              style={{
                padding: "10px 22px",
                borderRadius: 9999,
                background: i === active ? "var(--dark-bg)" : "transparent",
                color: i === active ? "#fff" : "var(--dark-bg)",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                border: "none",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 20 }}>
          {(current?.items ?? []).map((item, i) => (
            <article
              key={item._key || i}
              style={{
                padding: 24,
                borderRadius: 20,
                background: "#fff",
                border: "1px solid #ececf2",
                boxShadow: "0 8px 24px -16px rgba(16, 0, 58, 0.12)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  color: "transparent",
                  WebkitTextStroke: "1.5px rgba(128, 21, 232, 0.5)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {item.number}
              </div>
              <h3
                className="text-card-title"
                style={{ marginTop: 12, color: "var(--dark-bg)" }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  marginTop: 10,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#52556b",
                }}
              >
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function GlobalPresence({
  eyebrow,
  heading,
  headingAccent,
  body,
  offices,
}: {
  eyebrow?: string
  heading?: string
  headingAccent?: string
  body?: string
  offices: OfficeEntry[]
}) {
  if (!offices?.length) return null
  return (
    <section style={{ paddingTop: 96, paddingBottom: 96, background: "linear-gradient(180deg, #ecf1fc 0%, #ffffff 100%)" }}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 1240 }}>
        <div className="text-center" style={{ marginBottom: 56 }}>
          {eyebrow && (
            <span
              style={{
                padding: "4px 12px",
                borderRadius: 9999,
                background: "rgba(128, 21, 232, 0.08)",
                color: "var(--purple-dark)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.8,
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </span>
          )}
          {(heading || headingAccent) && (
            <h2 className="text-section-h2" style={{ marginTop: 16, color: "var(--dark-bg)" }}>
              {heading}
              {headingAccent && (
                <>
                  {" "}
                  <span style={{ color: "var(--purple-primary)" }}>{headingAccent}</span>
                </>
              )}
            </h2>
          )}
          {body && (
            <p
              className="text-body-lead"
              style={{ marginTop: 12, color: "#52556b", maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}
            >
              {body}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5" style={{ gap: 16 }}>
          {offices.map((o, i) => (
            <div
              key={o._key || o.city || i}
              style={{
                padding: 22,
                borderRadius: 18,
                background: "#fff",
                border: "1px solid rgba(128, 21, 232, 0.12)",
                boxShadow: "0 8px 24px -18px rgba(16, 0, 58, 0.18)",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: 28 }}>{o.flag}</div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--dark-bg)",
                }}
              >
                {o.city}
              </div>
              <div style={{ fontSize: 13, color: "#686b82", marginTop: 2 }}>
                {o.country}
              </div>
              {o.note && (
                <div
                  style={{
                    marginTop: 10,
                    display: "inline-block",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 0.6,
                    textTransform: "uppercase",
                    color: "var(--purple-primary)",
                    background: "rgba(128, 21, 232, 0.08)",
                    padding: "3px 8px",
                    borderRadius: 9999,
                  }}
                >
                  {o.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PartnerStack({ badges, eyebrow }: { badges: PartnerBadge[]; eyebrow?: string }) {
  if (!badges?.length) return null
  return (
    <section style={{ paddingTop: 64, paddingBottom: 64, background: "#fff" }}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 1240 }}>
        {eyebrow && (
          <div className="text-center" style={{ marginBottom: 32 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: "#686b82",
              }}
            >
              {eyebrow}
            </div>
          </div>
        )}
        <div
          className="flex flex-wrap items-center justify-center"
          style={{
            gap: 36,
            padding: "28px 24px",
            borderRadius: 24,
            background: "#fbf9ff",
            border: "1px solid rgba(128, 21, 232, 0.1)",
          }}
        >
          {badges.map((b, i) => {
            const u = badgeUrl(b)
            if (!u) return null
            return (
              <span
                key={b._key || i}
                className="relative inline-block"
                style={{ height: 44, width: 130 }}
              >
                <Image
                  src={u}
                  alt={b.name || ""}
                  fill
                  sizes="130px"
                  style={{ objectFit: "contain" }}
                />
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ClosingCta({
  calendlyUrl,
  heading,
  body,
  primaryLabel,
  secondaryLabel,
  secondaryUrl,
}: {
  calendlyUrl: string
  heading?: string
  body?: string
  primaryLabel?: string
  secondaryLabel?: string
  secondaryUrl?: string
}) {
  return (
    <section style={{ paddingTop: 96, paddingBottom: 96, background: "#fff" }}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 1100 }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 32,
            padding: "64px 48px",
            background: "linear-gradient(135deg, #8015e8 0%, #4674FB 100%)",
            color: "#fff",
            textAlign: "center",
            boxShadow: "0 30px 80px -30px rgba(70, 116, 251, 0.55)",
          }}
        >
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(500px 200px at 80% 100%, rgba(255,255,255,0.2), transparent 60%)",
            }}
          />
          <div className="relative">
            {heading && (
              <h2
                className="text-section-h2"
                style={{ color: "#fff", maxWidth: 720, margin: "0 auto" }}
              >
                {heading}
              </h2>
            )}
            {body && (
              <p
                className="text-body-lead"
                style={{
                  marginTop: 16,
                  color: "rgba(255,255,255,0.88)",
                  maxWidth: 560,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {body}
              </p>
            )}
            <div className="flex flex-wrap justify-center" style={{ marginTop: 28, gap: 14 }}>
              {primaryLabel && (
                <CtaButton
                  href={calendlyUrl}
                  label={primaryLabel}
                  variant="onDarkPrimary"
                />
              )}
              {secondaryLabel && secondaryUrl && (
                <Link
                  href={secondaryUrl}
                  className="cta-btn cta-btn-on-dark-outline"
                >
                  <span className="cta-btn-icon" aria-hidden>
                    <Play size={18} />
                  </span>
                  <span className="cta-btn-label">{secondaryLabel}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function AboutModern(props: AboutModernProps) {
  const {
    heroEyebrow,
    heroHeadingPart1,
    heroHeadingAccent,
    heroHeadingPart2,
    heroSubheading,
    heroImage,
    heroPartnerBadgesLabel,
    heroCalloutBadgeLabel,
    heroCalloutBadgeText,
    heroCalloutOfficesText,
    primaryCtaLabel,
    primaryCtaUrl,
    secondaryCtaLabel,
    secondaryCtaUrl,
    partnerBadges = [],
    stats = [],
    textSections = [],
    storyEyebrow,
    storyHeading,
    storyHeadingAccent,
    storyCardEyebrowPrefix,
    capabilitiesEyebrow,
    capabilitiesHeading,
    capabilityCards = [],
    methodologyEyebrow,
    methodologyStepLabel,
    methodologyHeading,
    methodologySteps = [],
    approachEyebrow,
    approachHeading,
    approachHeadingAccent,
    comparisonTabs = [],
    globalPresenceEyebrow,
    globalPresenceHeading,
    globalPresenceHeadingAccent,
    globalPresenceBody,
    offices = [],
    partnerStackEyebrow,
    faqHeading,
    faqTabs = [],
    calendlyHeading,
    calendlySubheading,
    calendlyUrl,
    closingCtaHeading,
    closingCtaBody,
    closingCtaPrimaryLabel,
    closingCtaSecondaryLabel,
    closingCtaSecondaryUrl,
    siteSettings,
  } = props

  const allBadges =
    partnerBadges.length > 0
      ? partnerBadges
      : siteSettings?.navbarPartnerBadges || []

  return (
    <div>
      <HeroSection
        eyebrow={heroEyebrow}
        headingPart1={heroHeadingPart1}
        headingAccent={heroHeadingAccent}
        headingPart2={heroHeadingPart2}
        subheading={heroSubheading}
        heroImage={heroImage}
        primaryCtaLabel={primaryCtaLabel}
        primaryCtaUrl={primaryCtaUrl || calendlyUrl}
        secondaryCtaLabel={secondaryCtaLabel}
        secondaryCtaUrl={secondaryCtaUrl}
        partnerBadges={allBadges}
        partnerBadgesLabel={heroPartnerBadgesLabel}
        calloutBadgeLabel={heroCalloutBadgeLabel}
        calloutBadgeText={heroCalloutBadgeText}
        calloutOfficesText={heroCalloutOfficesText}
      />
      <StatsBand stats={stats} />
      <StorySection
        sections={textSections}
        eyebrow={storyEyebrow}
        heading={storyHeading}
        headingAccent={storyHeadingAccent}
        cardEyebrowPrefix={storyCardEyebrowPrefix}
      />
      <ChallengesBento
        eyebrow={capabilitiesEyebrow}
        heading={capabilitiesHeading}
        cards={capabilityCards}
      />
      <MethodologyTimeline
        eyebrow={methodologyEyebrow}
        stepLabel={methodologyStepLabel}
        heading={methodologyHeading}
        steps={methodologySteps}
      />
      <ApproachTabs
        tabs={comparisonTabs}
        eyebrow={approachEyebrow}
        heading={approachHeading}
        headingAccent={approachHeadingAccent}
      />
      <GlobalPresence
        eyebrow={globalPresenceEyebrow}
        heading={globalPresenceHeading}
        headingAccent={globalPresenceHeadingAccent}
        body={globalPresenceBody}
        offices={offices}
      />
      <PartnerStack badges={allBadges} eyebrow={partnerStackEyebrow} />
      {faqTabs.length > 0 && faqHeading && (
        <FaqAccordion
          heading={faqHeading}
          tabs={faqTabs}
        />
      )}
      <CalendlySection
        heading={calendlyHeading}
        subheading={calendlySubheading}
        calendlyUrl={calendlyUrl}
      />
      <ClosingCta
        calendlyUrl={calendlyUrl}
        heading={closingCtaHeading}
        body={closingCtaBody}
        primaryLabel={closingCtaPrimaryLabel}
        secondaryLabel={closingCtaSecondaryLabel}
        secondaryUrl={closingCtaSecondaryUrl}
      />
    </div>
  )
}
