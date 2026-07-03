import type { CSSProperties, ReactNode } from 'react'

/**
 * Wrap light-background media (screenshots, client/partner logos, CMS images)
 * so they don't glare on dark surfaces.
 *
 * - Light mode: transparent pass-through, no visual change.
 * - Dark mode: renders a soft light, rounded, bordered card behind the media
 *   so it reads as an intentional card instead of a bright rectangle.
 *
 * Only apply to assets with baked-in light/white backgrounds. Transparent
 * PNGs/SVGs and decorative illustrations usually don't need it.
 */
export default function FramedMedia({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={`dark:bg-white/90 dark:rounded-xl dark:p-2 dark:ring-1 dark:ring-white/10 ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
