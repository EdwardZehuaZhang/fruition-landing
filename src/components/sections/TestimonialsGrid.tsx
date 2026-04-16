"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { urlFor } from "@/sanity/image"
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
  ctaUrl = "https://calendly.com/global-calendar-fruitionservices",
  statCardValue = "500+",
  statCardSubtitle = "have maximised their workflows with our monday.com expert support",
  statCardCtaLabel = "Read our case studies",
  statCardCtaUrl = "/customer-testimonials",
  caseStudies = [],
}: TestimonialsGridProps) {
  // Build testimonial cards from case studies
  const testimonials = caseStudies.map((t) => ({
    name: t.clientName ?? "",
    role: t.clientRole && t.clientCompany
      ? `${t.clientRole}, ${t.clientCompany}`
      : t.clientRole || t.clientCompany || "",
    quote: t.quote ?? "",
    photo: safeImageUrl(t.profilePhoto) ?? undefined,
    id: t._id,
  }))

  // Paginate into groups of 5
  const pages: typeof testimonials[] = []
  for (let i = 0; i < testimonials.length; i += TESTIMONIALS_PER_PAGE) {
    pages.push(testimonials.slice(i, i + TESTIMONIALS_PER_PAGE))
  }
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
    <section className="bg-white py-[80px] px-4">
      <div className="mx-auto max-w-[1343px]">
        {/* Header */}
        <div className="flex items-center justify-center gap-[89px] mb-[58px] w-full">
          <h2 className="text-section-h2 text-black w-[919px] shrink-0">{heading}</h2>
          <Link
            href={ctaUrl}
            className="ui-cta-btn ui-cta-btn-secondary h-[53px] w-[330px] shrink-0"
          >
            {ctaLabel}
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
                <div className="relative flex w-full max-w-[437px] flex-col rounded-card bg-[#10003a] px-[38px] shadow-card">
                  <div className="pt-[23px] pb-[30px]">
                    <p className="font-semibold text-[40px] text-[#ba83f0] leading-[60px]">{statCardValue}</p>
                    <p className="text-body-lead font-normal text-white" style={{ whiteSpace: "pre-line" }}>
                      {statCardSubtitle}
                    </p>
                  </div>
                  <div className="pb-[30px]">
                    <Link
                      href={statCardCtaUrl}
                      className="inline-flex items-center justify-center rounded-[100px] border border-white/40 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
                    >
                      {statCardCtaLabel}
                    </Link>
                  </div>
                </div>

                {/* Testimonial cards */}
                {pageItems.map((t, ti) => (
                  <div
                    key={t.id || `${t.name}-${ti}`}
                    className="ui-surface-panel relative flex w-full max-w-[437px] min-h-[300px] flex-col"
                  >
                    <div className="flex items-start justify-between px-[38px] pt-[29px] pb-[18px]">
                      <div>
                        <p className="font-semibold text-[20px] text-[#2b074d] leading-[30px]">{t.name}</p>
                        <p className="text-caption font-normal text-[#595959]">{t.role}</p>
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.photo || "/images/default-avatar.svg"}
                        alt={t.name}
                        width={53}
                        height={53}
                        className="w-[53px] h-[53px] rounded-full object-cover shrink-0 ml-4"
                        style={{ backgroundColor: "#e8e6e6" }}
                      />
                    </div>
                    <div className="px-[38px] flex-1">
                      <p className="text-body-sm text-black">{t.quote}</p>
                    </div>
                    <div className="flex gap-[2px] px-[38px] pb-[35px] pt-4">
                      {[...Array(5)].map((_, si) => (
                        <svg key={si} className="w-[23px] h-[21px]" viewBox="0 0 23 21" fill="#8015E8">
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
                className="w-3 h-3 rounded-full transition-colors"
                style={{
                  backgroundColor: i === currentPage ? "#8015e8" : "#e8e6e6",
                }}
                aria-label={`Go to testimonial page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
