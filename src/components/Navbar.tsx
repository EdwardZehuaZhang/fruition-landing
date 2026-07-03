"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { urlFor } from '@/sanity/image'
import PaperPlaneIcon from '@/components/common/icons/PaperPlaneIcon'
import { NavIcon } from '@/components/common/icons/NavIcons'
import ThemeToggle from '@/components/ThemeToggle'

interface NavLink {
  label?: string
  href?: string
  description?: string
  icon?: string
}

interface NavSubSection {
  heading?: string
  items?: NavLink[]
  columns?: number
}

interface NavItem {
  label?: string
  sections?: NavSubSection[]
}

interface PartnerBadge {
  name?: string
  image?: unknown
  width?: number
  height?: number
}

interface SiteSettingsProp {
  phone?: string
  calendlyLink?: string
  logo?: unknown
  navigation?: NavItem[]
  navbarPartnerBadges?: PartnerBadge[]
  navbarCtaLabel?: string
}

export default function Navbar({ siteSettings }: { siteSettings?: SiteSettingsProp | null }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const calendlyUrl = siteSettings?.calendlyLink || ''
  const phoneAu = siteSettings?.phone
  const navItems: NavItem[] = siteSettings?.navigation || []
  const partnerBadges: PartnerBadge[] = siteSettings?.navbarPartnerBadges ?? []
  const ctaLabel = siteSettings?.navbarCtaLabel || ''


  const isNavItemActive = (item: NavItem) =>
    item.sections?.some((s) => s.items?.some((link) => link.href && pathname === link.href)) ?? false

  return (
    <nav className="bg-surface sticky top-0 z-50 shadow-sm" onMouseLeave={() => setOpenMenu(null)}>
      <div className="mx-auto max-w-[1348px] px-4 xl:px-0 w-full">
        <div className="flex justify-between items-center gap-4 h-[85px]">
          {/* Logo — black in light theme, white in dark (CSS swap keeps it SSR-safe) */}
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo-fruition-black.svg"
              alt="Fruition Services"
              width={1366}
              height={280}
              className="h-8 w-auto -translate-y-0.5 block dark:hidden"
              priority
              unoptimized
            />
            <Image
              src="/images/logo-fruition-white.svg"
              alt="Fruition Services"
              width={1366}
              height={280}
              className="h-8 w-auto -translate-y-0.5 hidden dark:block"
              priority
              unoptimized
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-6">
            {navItems.map((item) => {
              const active = isNavItemActive(item)
              return (
                <div
                  key={item.label}
                  onMouseEnter={() => setOpenMenu(item.label || null)}
                >
                  <button
                    className={`font-medium text-sm py-1.5 px-3 transition-colors border whitespace-nowrap ${
                      openMenu === item.label
                        ? 'text-ink border-[color:var(--ink)] rounded-[4px]'
                        : active
                          ? 'text-brand border-transparent'
                          : 'text-ink border-transparent hover:text-brand'
                    }`}
                  >
                    {item.label}
                  </button>
                </div>
              )
            })}

            {/* Partner badges + phone icon + CTA */}
            <div className="flex items-center gap-2 xl:gap-[12px] border-l border-line-soft pl-3 xl:pl-4" onMouseEnter={() => setOpenMenu(null)}>
              <div className="hidden xl:flex items-center gap-3">
                {partnerBadges.map((badge, i) => {
                  const h = badge.height ?? 32
                  const src = badge.image
                    ? urlFor(badge.image).height(h * 2).fit('max').url()
                    : null
                  if (!src) return null
                  return (
                    <Image
                      key={`${badge.name}-${i}`}
                      src={src}
                      alt={badge.name || 'Partner badge'}
                      width={h * 4}
                      height={h}
                      className="h-7 w-auto"
                      unoptimized
                    />
                  )
                })}
              </div>

              {/* Theme toggle */}
              <ThemeToggle />

              {/* Phone icon */}
              {phoneAu && (
                <a
                  href={`tel:${phoneAu.replace(/\s/g, '')}`}
                  className="flex items-center justify-center w-[36px] h-[32px] rounded-[7px] hover:bg-surface-subtle transition-colors"
                  aria-label="Call us"
                >
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.22 22.167h-.047a15.633 15.633 0 0 1-6.803-2.987 15.388 15.388 0 0 1-4.678-5.133A15.517 15.517 0 0 1 3.85 7.583a3.395 3.395 0 0 1 .77-2.753A4.667 4.667 0 0 1 6.44 3.5h1.633c.98-.01 1.84.647 2.1 1.587.18.72.432 1.42.747 2.093a2.333 2.333 0 0 1-.525 2.567l-.688.688a11.667 11.667 0 0 0 5.858 5.858l.688-.688a2.333 2.333 0 0 1 2.567-.525c.673.316 1.373.567 2.093.747a2.18 2.18 0 0 1 1.587 2.147v1.633a2.333 2.333 0 0 1-2.333 2.333 3.267 3.267 0 0 1-.467.035l-.48-.007Z" stroke="var(--brand)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              )}

              {/* CTA */}
              {ctaLabel && calendlyUrl && (
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 whitespace-nowrap bg-gradient-to-r from-[var(--purple-primary)] to-[var(--purple-light)] hover:bg-accent-blue hover:bg-none text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-md"
                >
                  <PaperPlaneIcon size={16} />
                  {ctaLabel}
                </a>
              )}
            </div>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle />
            <button
            className="text-ink"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="sr-only">Open menu</span>
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-line-soft max-h-[80vh] overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.label} className="mb-4">
                {item.sections?.map((section, sIdx) => (
                  <div key={`${section.heading}-${sIdx}`} className="mb-3">
                    {section.heading && (
                      <p className="text-xs font-semibold text-brand uppercase tracking-wider px-2 mb-1">
                        {section.heading}
                      </p>
                    )}
                    {section.items?.map((sub) => {
                      const isActive = sub.href && pathname === sub.href
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href || '#'}
                          className={`flex items-start gap-3 px-2 py-2 rounded-md transition-colors ${
                            isActive ? 'bg-surface-tint-2' : 'hover:bg-surface-subtle'
                          }`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {sub.icon && (
                            <div className={`shrink-0 mt-0.5 w-7 h-7 rounded-md ring-1 ring-line-soft bg-surface flex items-center justify-center ${isActive ? 'text-brand' : 'text-ink'}`}>
                              <NavIcon iconKey={sub.icon} className="h-4 w-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className={`text-sm font-medium ${isActive ? 'text-brand' : 'text-ink'}`}>
                              {sub.label}
                            </div>
                            {sub.description && (
                              <div className="mt-0.5 text-xs text-ink-muted leading-snug">
                                {sub.description}
                              </div>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ))}
              </div>
            ))}
            {/* Partner badges mobile */}
            <div className="flex items-center gap-3 px-2 py-3 border-t border-line-soft">
              {partnerBadges.map((badge, i) => {
                const h = Math.round((badge.height ?? 32) * 0.75)
                const src = badge.image
                  ? urlFor(badge.image).height(h * 2).fit('max').url()
                  : null
                if (!src) return null
                return (
                  <Image
                    key={`m-${badge.name}-${i}`}
                    src={src}
                    alt={badge.name || 'Partner badge'}
                    width={h * 4}
                    height={h}
                    className="h-6 w-auto"
                    unoptimized
                  />
                )
              })}
            </div>
            {ctaLabel && calendlyUrl && (
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 mx-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--purple-primary)] to-[var(--purple-light)] hover:bg-accent-blue hover:bg-none text-white text-center px-6 py-2.5 rounded-full text-sm font-semibold transition-colors"
              >
                <PaperPlaneIcon size={16} />
                {ctaLabel}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Desktop mega dropdown */}
      {openMenu && (() => {
        const activeItem = navItems.find((item) => item.label === openMenu)
        if (!activeItem?.sections?.length) return null
        return (
          <div className="hidden lg:block absolute left-0 right-0 top-full border-t border-line-soft bg-surface shadow-lg z-50">
            <div className="max-w-[1348px] mx-auto px-4 xl:px-0 py-8">
              <div className="flex flex-col gap-6">
                {activeItem.sections.map((section, sIdx) => {
                  const cols = section.columns ?? 3
                  return (
                    <div key={`${section.heading}-${sIdx}`} className="min-w-0">
                      {section.heading && (
                        <p className="text-xs font-medium text-ink-muted pb-3 border-b border-line-soft mb-3">
                          {section.heading}
                        </p>
                      )}
                      <div
                        className="grid gap-x-6 gap-y-1"
                        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
                      >
                        {section.items?.map((sub) => {
                          const isActive = sub.href && pathname === sub.href
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href || '#'}
                              className={`group flex items-start gap-3 rounded-lg p-3 transition-colors ${
                                isActive ? 'bg-surface-tint-2' : 'hover:bg-surface-subtle'
                              }`}
                              onClick={() => setOpenMenu(null)}
                            >
                              <div
                                className={`shrink-0 mt-0.5 w-8 h-8 rounded-md ring-1 ring-line-soft bg-surface flex items-center justify-center transition-colors ${
                                  isActive
                                    ? 'text-brand'
                                    : 'text-ink group-hover:text-brand group-hover:ring-[color:var(--line-tint)]'
                                }`}
                              >
                                {sub.icon ? (
                                  <NavIcon iconKey={sub.icon} className="h-[18px] w-[18px]" />
                                ) : (
                                  <span className="block h-2 w-2 rounded-full bg-line-soft" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div
                                  className={`text-sm font-semibold leading-tight ${
                                    isActive
                                      ? 'text-brand'
                                      : 'text-ink group-hover:text-brand'
                                  }`}
                                >
                                  {sub.label}
                                </div>
                                {sub.description && (
                                  <div className="mt-1 text-xs text-ink-muted leading-snug">
                                    {sub.description}
                                  </div>
                                )}
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })()}
    </nav>
  )
}
