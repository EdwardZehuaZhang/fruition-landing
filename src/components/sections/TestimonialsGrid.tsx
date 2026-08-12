"use client"

import { BOOKING_ANCHOR, bookingHref } from "@/lib/bookingLink"
import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { urlFor } from "@/sanity/image"
import CtaLabel from "@/components/CtaLabel"
import type { CaseStudy, SanityImageRef } from "./types"

interface TestimonialsGridProps {
  heading?: string
  ctaLabel?: string
  ctaUrl?: string
  statCardValue?: string
  statCardSubtitle?: string
  statCardCtaLabel?: string
  statCardCtaUrl?: string
  caseStudies?: CaseStudy[]
}

function safeImageUrl(ref: SanityImageRef): string | null {
  if (!ref?.asset?._ref) return null
  try { return urlFor(ref).url() } catch { return null }
}

const TESTIMONIALS_PER_PAGE = 5

export default function TestimonialsGrid({
  heading = "What our customers say about us \uD83D\uDE4C",
  ctaLabel = "Start Your Transformation",
  ctaUrl = BOOKING_ANCHOR,
  // Default mirrors the proofStats singleton (Sanity, _id "proofStats") - the
  // canonical entity-signal registry. Keep in sync via getProofStats/PROOF_STATS_DEFAULTS.
  statCardValue = "500+",
  statCardSubtitle = "have maximised their workflows with our monday.com expert support",
  statCardCtaLabel = "Read our case studies",
  statCardCtaUrl = "/customer-testimonials",
  caseStudies = [],
}: TestimonialsGridProps) {
  // Build testimonial cards from case studies, then paginate into groups of 5.
  // Case studies without a quote (e.g. project write-ups with no testimonial)
  // are dropped - they'd otherwise render as blank panels.
  // Memoized so the React Compiler can preserve downstream memoization.
  const pages = useMemo(() => {
    const testimonials = caseStudies
      .map((t) => ({
        name: t.clientName ?? "",
        role: t.clientRole && t.clientCompany
          ? `${t.clientRole}, ${t.clientCompany}`
          : t.clientRole || t.clientCompany || "",
        quote: (t.quote ?? "").trim(),
        photo: safeImageUrl(t.profilePhoto) ?? undefined,
        id: t._id,
      }))
      .filter((t) => t.quote.length > 0)
    const out: typeof testimonials[] = []
    for (let i = 0; i < testimonials.length; i += TESTIMONIALS_PER_PAGE) {
      out.push(testimonials.slice(i, i + TESTIMONIALS_PER_PAGE))
    }
    // Always render at least one page so the stat card shows even when no
    // case study carries a quote.
    return out.length > 0 ? out : [[]]
  }, [caseStudies])
  const totalPages = pages.length
  const [currentPage, setCurrentPage] = useState(0)

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }, [totalPages])

  useEffect(() => {
    if (totalPages <= 1) return
    const timer = setInterval(nextPage, 6000)
    return () => clearInterval(timer)
  }, [totalPages, nextPage])

  return (
    <section className="bg-surface py-[80px] px-4">
      <div className="mx-auto max-w-[1343px]">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-6 lg:gap-[89px] mb-10 lg:mb-[58px] w-full">
          <h2 className="text-section-h2 w-full lg:w-[919px] lg:shrink-0">{heading}</h2>
          <Link
            href={bookingHref(ctaUrl)}
            className="ui-cta-btn ui-cta-btn-secondary h-[53px] w-full lg:w-[330px] lg:shrink-0"
          >
            <CtaLabel label={ctaLabel} />
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {pages.map((pageItems, pageIdx) => (
              <div
                key={pageIdx}
                className="flex flex-wrap gap-x-[16px] gap-y-[18px] w-full shrink-0"
              >
                {/* Stat card (repeats on every page) */}
                <div className="relative flex w-full max-w-none lg:max-w-[437px] flex-col rounded-card bg-surface-dark px-[38px] shadow-card">
                  <div className="pt-[23px] pb-[30px]">
                    <p className="font-semibold text-[32px] md:text-[40px] text-brand-light leading-[1.2]">{statCardValue}</p>
                    <p className="font-normal text-white text-[19px] md:text-[24px] leading-[1.4] whitespace-pre-line">
                      {statCardSubtitle}
                    </p>
                  </div>
                  <div className="pb-[30px]">
                    <Link
                      href={statCardCtaUrl}
                      className="cta-btn cta-btn-on-dark-outline"
                    >
                      <CtaLabel label={statCardCtaLabel} />
                    </Link>
                  </div>
                </div>

                {/* Testimonial cards */}
                {pageItems.map((t, ti) => (
                  <div
                    key={t.id || `${t.name}-${ti}`}
                    className="ui-surface-panel relative flex w-full max-w-none lg:max-w-[437px] min-h-[300px] flex-col"
                  >
                    <div className="flex items-start justify-between px-[38px] pt-[29px] pb-[18px]">
                      <div>
                        <p className="font-semibold text-[20px] text-body leading-[30px]">{t.name}</p>
                        <p className="text-caption font-normal text-muted">{t.role}</p>
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.photo || "/images/default-avatar.svg"}
                        alt={t.name}
                        width={53}
                        height={53}
                        className="w-[53px] h-[53px] rounded-full object-cover shrink-0 ml-4 bg-ui"
                      />
                    </div>
                    <div className="px-[38px] flex-1">
                      <p className="text-body-sm text-body">{t.quote}</p>
                    </div>
                    <div className="flex gap-[2px] px-[38px] pb-[35px] pt-4">
                      {[...Array(5)].map((_, si) => (
                        <svg key={si} className="w-[23px] h-[21px] text-brand" viewBox="0 0 23 21" fill="currentColor">
                          <path d="M11.5 0L14.09 7.36H22.06L15.49 11.92L18.08 19.28L11.5 14.72L4.92 19.28L7.51 11.92L0.94 7.36H8.91L11.5 0Z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Page dots */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-3 h-3 rounded-full transition-colors ${i === currentPage ? "bg-brand" : "bg-ui"}`}
                aria-label={`Go to testimonial page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
