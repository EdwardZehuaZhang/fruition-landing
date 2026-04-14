"use client"

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

export default function TestimonialsGrid({
  heading = "What our customers say about us 🙌",
  ctaLabel = "🚀 Start Your Transformation",
  ctaUrl = "https://calendly.com/global-calendar-fruitionservices",
  statCardValue = "500+",
  statCardSubtitle = "have maximised their workflows with our monday.com expert support",
  statCardCtaLabel = "Read our case studies",
  statCardCtaUrl = "/customer-testimonials",
  caseStudies = [],
}: TestimonialsGridProps) {
  return (
    <section className="bg-white py-[80px] px-4">
      <div className="mx-auto max-w-[1343px]">
        <div className="flex items-center justify-center gap-[89px] mb-[58px] w-full">
          <h2 className="text-[48px] text-black leading-[67.2px] w-[919px] shrink-0">{heading}</h2>
          <Link
            href={ctaUrl}
            className="shrink-0 flex items-center justify-center h-[53px] w-[330px] rounded-[100px] bg-gradient-to-r from-[#8015e8] to-[#ba83f0] text-white text-[16px] font-bold tracking-[0.32px] hover:opacity-90 transition"
          >
            {ctaLabel}
          </Link>
        </div>
        <div className="flex flex-wrap gap-x-[16px] gap-y-[18px]">
          {/* Stat card */}
          <div className="relative w-full max-w-[437px] bg-[#10003a] rounded-[24px] shadow-[0px_1px_17px_0px_rgba(0,0,0,0.2)] flex flex-col px-[38px]">
            <div className="pt-[23px] pb-[30px]">
              <p className="font-semibold text-[40px] text-[#ba83f0] leading-[60px]">{statCardValue}</p>
              <p className="font-light text-[24px] text-white leading-[36px]" style={{ whiteSpace: "pre-line" }}>
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
          {caseStudies.map((t, i) => {
            const name = t.clientName ?? ""
            const role = t.clientRole && t.clientCompany
              ? `${t.clientRole}, ${t.clientCompany}`
              : t.clientRole || t.clientCompany || ""
            const logoSrc = safeImageUrl(t.logo)
            return (
              <div key={t._id || `${name}-${i}`} className="relative flex flex-col bg-white rounded-[24px] border border-[#e8e6e6] w-full max-w-[437px] min-h-[300px]">
                <div className="flex items-start justify-between px-[38px] pt-[29px] pb-[18px]">
                  <div>
                    <p className="font-semibold text-[20px] text-[#2b074d] leading-[30px]">{name}</p>
                    <p className="font-light text-[14px] text-[#595959] leading-[21px]">{role}</p>
                  </div>
                  {logoSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoSrc} alt={`${name} logo`} className="w-[57px] h-[53px] rounded-full object-contain shrink-0 ml-4" />
                  ) : (
                    <div className="w-[57px] h-[53px] rounded-full bg-[#e8e6e6] shrink-0 ml-4" />
                  )}
                </div>
                <div className="px-[38px] flex-1">
                  <p className="text-[15px] text-black leading-[22.5px]">{t.quote}</p>
                </div>
                <div className="flex gap-[2px] px-[38px] pb-[35px] pt-4">
                  {[...Array(5)].map((_, si) => (
                    <svg key={si} className="w-[23px] h-[21px]" viewBox="0 0 23 21" fill="#8015E8">
                      <path d="M11.5 0L14.09 7.36H22.06L15.49 11.92L18.08 19.28L11.5 14.72L4.92 19.28L7.51 11.92L0.94 7.36H8.91L11.5 0Z" />
                    </svg>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
