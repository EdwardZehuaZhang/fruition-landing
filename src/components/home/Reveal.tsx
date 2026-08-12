"use client"

import { useEffect, useRef, type ElementType, type ReactNode } from "react"

interface RevealProps {
  children: ReactNode
  className?: string
  /** Render as something other than a div (e.g. "section"). */
  as?: ElementType
}

/**
 * Scroll-triggered fade + rise, matching the design's `data-reveal` behaviour.
 *
 * Content is visible by default and only hidden once the effect runs, so a
 * no-JS or crawler render still shows everything. Anything already inside the
 * viewport on mount is left alone rather than being hidden then re-shown, and
 * reduced-motion users skip the whole thing (see `.home-reveal` in globals).
 */
export default function Reveal({ children, className = "", as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    // Already on screen - don't hide it just to animate it back in.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return

    el.dataset.hidden = "true"
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          delete (entry.target as HTMLElement).dataset.hidden
          io.unobserve(entry.target)
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`home-reveal ${className}`.trim()}>
      {children}
    </Tag>
  )
}
