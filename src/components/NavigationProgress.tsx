"use client"
import { useEffect, useState, useRef } from "react"
import { usePathname } from "next/navigation"

export default function NavigationProgress() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prevPathRef = useRef(pathname)

  // Navigation complete — fill to 100% then fade out
  useEffect(() => {
    if (pathname === prevPathRef.current) return
    prevPathRef.current = pathname
    if (timerRef.current) clearInterval(timerRef.current)
    setProgress(100)
    const hide = setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 300)
    return () => clearTimeout(hide)
  }, [pathname])

  // Intercept internal link clicks to start the bar immediately
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a")
      if (!anchor) return
      const href = anchor.getAttribute("href")
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("tel:") ||
        href.startsWith("mailto:") ||
        anchor.getAttribute("target") === "_blank"
      )
        return
      if (href === prevPathRef.current) return

      // Internal navigation — start progress
      setVisible(true)
      setProgress(20)

      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        setProgress((p) => (p >= 85 ? p : p + (90 - p) * 0.1))
      }, 300)
    }

    document.addEventListener("click", handleClick, true)
    return () => {
      document.removeEventListener("click", handleClick, true)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  if (!visible && progress === 0) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 300ms" }}
    >
      <div
        className="h-full bg-gradient-to-r from-[#8015e8] to-[#ba83f0]"
        style={{
          width: `${progress}%`,
          transition: progress === 0 ? "none" : "width 300ms ease-out",
        }}
      />
    </div>
  )
}
