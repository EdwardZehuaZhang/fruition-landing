"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Rocket } from "lucide-react"
import TestimonialBlockView from "./TestimonialBlockView"

interface TestimonialBlockData {
  _key: string
  _type: string
  quote?: string
  authorName?: string
  authorRole?: string
  company?: string
  profilePhoto?: { asset?: { _ref?: string } }
}

interface HomeTestimonialsGridProps {
  testimonials: TestimonialBlockData[]
  perPage?: number
  autoScrollMs?: number
}

export default function HomeTestimonialsGrid({
  testimonials,
  perPage = 5,
  autoScrollMs = 6000,
}: HomeTestimonialsGridProps) {
  const pages: TestimonialBlockData[][] = []
  for (let i = 0; i < testimonials.length; i += perPage) {
    pages.push(testimonials.slice(i, i + perPage))
  }
  const totalPages = pages.length
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    if (totalPages <= 1) return
    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages)
    }, autoScrollMs)
    return () => clearInterval(timer)
  }, [totalPages, autoScrollMs])

  if (totalPages === 0) return null

  return (
    <section className="bg-surface py-[80px] px-4">
      <div className="mx-auto max-w-[1343px]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-6 lg:gap-[89px] mb-10 lg:mb-[58px] w-full">
          <h2 className="text-[32px] leading-[40px] lg:text-[48px] lg:leading-[67.2px] text-ink w-full lg:w-[919px] lg:shrink-0">
            What our customers say about us
          </h2>
          <Link
            href="/customer-testimonials"
            className="shrink-0 flex items-center justify-center gap-2 h-[53px] w-full lg:w-[330px] rounded-[100px] bg-gradient-to-r from-[var(--purple-primary)] to-[var(--purple-light)] text-white text-[16px] font-bold tracking-[0.32px] hover:opacity-90 transition"
          >
            <Rocket size={18} aria-hidden /> Start Your Transformation
          </Link>
        </div>

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
                <div className="relative w-full max-w-[437px] bg-[var(--navy-900)] rounded-card shadow-card flex flex-col px-[38px]">
                  <div className="pt-[23px] pb-[30px]">
                    <p className="font-semibold text-[40px] text-brand-light leading-[60px]">500+</p>
                    <p className="font-light text-[24px] text-white leading-[36px]">
                      have maximised their<br />
                      workflows with our<br />
                      monday.com expert support
                    </p>
                  </div>
                  <div className="pb-[30px]">
                    <Link
                      href="/customer-testimonials"
                      className="inline-flex items-center justify-center rounded-[100px] border border-white/40 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
                    >
                      Read our case studies
                    </Link>
                  </div>
                </div>

                {pageItems.map((block) => (
                  <TestimonialBlockView
                    key={block._key}
                    quote={block.quote}
                    authorName={block.authorName}
                    authorRole={block.authorRole}
                    company={block.company}
                    profilePhoto={block.profilePhoto}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className="w-3 h-3 rounded-full transition-colors"
                style={{
                  backgroundColor: i === currentPage ? "var(--brand)" : "var(--line)",
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
