"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

/**
 * Light/dark toggle. Renders a stable placeholder until mounted so SSR and the
 * first client render match (theme isn't known on the server).
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`flex items-center justify-center w-[36px] h-[32px] rounded-[7px] text-ink hover:bg-surface-subtle transition-colors ${className}`}
    >
      {/* Suppress hydration warning: icon depends on theme, unknown on the server */}
      <span suppressHydrationWarning>
        {mounted && isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
      </span>
    </button>
  )
}
