"use client"

import Link from "next/link"
import { urlFor } from "@/sanity/image"
import type { CaseStudy, SanityImageRef } from "./types"

interface TestimonialCtaBannerProps {
  headingPart1?: string
  headingAccent?: string
  headingPart2?: string
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  secondaryCtaLabel?: string
  secondaryCtaUrl?: string
  testimonial?: CaseStudy
}

function safeImageUrl(ref?: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try { return urlFor(ref).url() } catch { return null }
}

export default function TestimonialCtaBanner({
  headingPart1 = "Join ",
  headingAccent = "500+ organisations",
  headingPart2 = " that have maximised their workflows with our monday.com expert support",
  primaryCtaLabel = "\u2708\uFE0F Start Your Transformation",
  primaryCtaUrl = "https://calendly.com/global-calendar-fruitionservices",
  secondaryCtaLabel = "\u25B6\uFE0F Get Started with monday.com",
  secondaryCtaUrl = "https://calendly.com/global-calendar-fruitionservices",
  testimonial,
}: TestimonialCtaBannerProps) {
  const photoSrc = safeImageUrl(testimonial?.profilePhoto)
  const role = testimonial?.clientCompany || testimonial?.clientRole || ""

  return (
    <section className="bg-white" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="mx-auto px-4" style={{ maxWidth: 1200 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 24 }}>
          {/* Left: dark gradient CTA */}
          <div
            className="relative overflow-hidden flex flex-col justify-center"
            style={{
              borderRadius: 24,
              padding: 48,
              minHeight: 340,
              background:
                "linear-gradient(135deg, #0a0028 0%, #1a0b52 50%, #10003a 100%)",
            }}
          >
            {/* Decorative glow (top-left) */}
            <div
              aria-hidden
              className="pointer-events-none absolute"
              style={{
                top: -120,
                left: -120,
                width: 340,
                height: 340,
                background:
                  "radial-gradient(circle, rgba(186,131,240,0.45) 0%, rgba(128,21,232,0.15) 45%, transparent 70%)",
                filter: "blur(4px)",
              }}
            />
            <h2
              className="relative font-bold"
              style={{ fontSize: 32, lineHeight: "44px", color: "white" }}
            >
              <span>{headingPart1}</span>
              <span style={{ color: "#ba83f0" }}>{headingAccent}</span>
              <span>{headingPart2}</span>
            </h2>
            <div
              className="relative flex flex-col"
              style={{ gap: 14, marginTop: 32, maxWidth: 320 }}
            >
              {primaryCtaLabel && primaryCtaUrl && (
                <Link
                  href={primaryCtaUrl}
                  className="flex items-center justify-center font-bold hover:opacity-90 transition"
                  style={{
                    height: 53,
                    borderRadius: 100,
                    backgroundColor: "white",
                    color: "#8015e8",
                    fontSize: 16,
                  }}
                >
                  {primaryCtaLabel}
                </Link>
              )}
              {secondaryCtaLabel && secondaryCtaUrl && (
                <Link
                  href={secondaryCtaUrl}
                  className="flex items-center justify-center font-bold text-white hover:opacity-90 transition"
                  style={{
                    height: 53,
                    borderRadius: 100,
                    background:
                      "linear-gradient(to right, #8015e8, #ba83f0)",
                    fontSize: 16,
                  }}
                >
                  {secondaryCtaLabel}
                </Link>
              )}
            </div>
          </div>

          {/* Right: testimonial card */}
          <div
            className="relative bg-white flex flex-col"
            style={{
              borderRadius: 24,
              border: "1px solid #e8e6e6",
              padding: 48,
              minHeight: 340,
              boxShadow: "0px 1px 17px 0px rgba(0,0,0,0.06)",
            }}
          >
            <div className="relative flex-1">
              <p
                className="text-black"
                style={{
                  fontSize: 17,
                  lineHeight: "27px",
                  whiteSpace: "pre-line",
                }}
              >
                {testimonial?.quote ?? ""}
              </p>
              {/* Quote mark */}
              <svg
                aria-hidden
                className="absolute"
                style={{ bottom: 0, right: 0, opacity: 0.9 }}
                width="36"
                height="28"
                viewBox="0 0 36 28"
                fill="#1a0b52"
              >
                <path d="M0 28V16.8C0 12 1.2 7.9 3.6 4.7 6 1.5 9.4 0 13.8 0v5.3c-2.2.4-4 1.4-5.3 3-1.4 1.6-2 3.6-2 6H13.8V28H0zm22.2 0V16.8c0-4.8 1.2-8.9 3.6-12.1C28.2 1.5 31.6 0 36 0v5.3c-2.2.4-4 1.4-5.3 3-1.4 1.6-2 3.6-2 6H36V28H22.2z" />
              </svg>
            </div>
            <div
              className="flex items-center"
              style={{ gap: 14, marginTop: 24 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoSrc || "/images/default-avatar.svg"}
                alt={testimonial?.clientName || ""}
                width={53}
                height={53}
                className="rounded-full object-cover shrink-0"
                style={{
                  width: 53,
                  height: 53,
                  backgroundColor: "#e8e6e6",
                }}
              />
              <div>
                <p
                  className="font-semibold"
                  style={{
                    fontSize: 18,
                    lineHeight: "26px",
                    color: "#2b074d",
                  }}
                >
                  {testimonial?.clientName ?? ""}
                </p>
                {role && (
                  <p
                    className="font-light"
                    style={{
                      fontSize: 14,
                      lineHeight: "21px",
                      color: "#595959",
                    }}
                  >
                    {role}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
