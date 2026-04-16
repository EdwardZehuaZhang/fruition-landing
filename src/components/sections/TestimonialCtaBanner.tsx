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
  primaryCtaLabel = "Start Your Transformation",
  primaryCtaUrl = "https://calendly.com/global-calendar-fruitionservices",
  secondaryCtaLabel = "Get Started with monday.com",
  secondaryCtaUrl = "https://calendly.com/global-calendar-fruitionservices",
  testimonial,
}: TestimonialCtaBannerProps) {
  const photoSrc = safeImageUrl(testimonial?.profilePhoto)
  const role = testimonial?.clientCompany || testimonial?.clientRole || ""

  return (
    <section className="bg-white py-[80px]">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: dark gradient CTA */}
          <div
            className="relative flex min-h-[340px] flex-col justify-center overflow-hidden rounded-card p-8 md:p-12"
            style={{
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
              className="relative text-section-h2 max-w-[26ch] text-white"
            >
              <span>{headingPart1}</span>
              <span style={{ color: "#ba83f0" }}>{headingAccent}</span>
              <span>{headingPart2}</span>
            </h2>
            <div
              className="relative mt-8 flex w-full max-w-[340px] flex-col gap-3.5"
            >
              {primaryCtaLabel && primaryCtaUrl && (
                <Link
                  href={primaryCtaUrl}
                  className="ui-cta-btn ui-cta-btn-primary"
                >
                  {primaryCtaLabel}
                </Link>
              )}
              {secondaryCtaLabel && secondaryCtaUrl && (
                <Link
                  href={secondaryCtaUrl}
                  className="ui-cta-btn ui-cta-btn-secondary"
                >
                  {secondaryCtaLabel}
                </Link>
              )}
            </div>
          </div>

          {/* Right: testimonial card */}
          <div
            className="ui-surface-panel-strong relative flex min-h-[340px] flex-col p-8 md:p-12"
          >
            <div className="relative flex-1">
              <p
                className="text-body-lead text-black"
                style={{
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
              className="mt-6 flex items-center gap-3.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoSrc || "/images/default-avatar.svg"}
                alt={testimonial?.clientName || ""}
                width={53}
                height={53}
                className="h-[53px] w-[53px] shrink-0 rounded-full object-cover"
                style={{
                  backgroundColor: "#e8e6e6",
                }}
              />
              <div>
                <p className="text-[18px] font-semibold leading-[1.4] text-[#2b074d]">
                  {testimonial?.clientName ?? ""}
                </p>
                {role && (
                  <p className="text-caption font-normal text-[#595959]">
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
