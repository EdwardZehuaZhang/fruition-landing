"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { urlFor } from '@/sanity/image'
import PaperPlaneIcon from '@/components/common/icons/PaperPlaneIcon'

// Calendly fallback only used when siteSettings is not yet loaded
const FALLBACK_CALENDLY_URL = 'https://calendly.com/global-calendar-fruitionservices'

/** Override specific partner badges with local dark variants */
const DARK_LOGO_OVERRIDES: Record<string, string> = {
  n8n: '/images/partner-n8n-dark.avif',
  aircall: '/images/partner-aircall-dark.avif',
}

function getDarkBadgeSrc(badge: PartnerBadge, fallbackSrc: string | null): string | null {
  const name = (badge.name || '').toLowerCase()
  for (const [key, darkSrc] of Object.entries(DARK_LOGO_OVERRIDES)) {
    if (name.includes(key)) return darkSrc
  }
  return fallbackSrc
}

interface NavLink {
  label?: string
  href?: string
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
}

export default function Navbar({ siteSettings }: { siteSettings?: SiteSettingsProp | null }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const calendlyUrl = siteSettings?.calendlyLink || FALLBACK_CALENDLY_URL
  const phoneAu = siteSettings?.phone
  const navItems: NavItem[] = siteSettings?.navigation || []
  const partnerBadges: PartnerBadge[] = siteSettings?.navbarPartnerBadges ?? []

  const logoUrl = siteSettings?.logo
    ? urlFor(siteSettings.logo).height(80).fit('max').url()
    : null

  const isNavItemActive = (item: NavItem) =>
    item.sections?.some((s) => s.items?.some((link) => link.href && pathname === link.href)) ?? false

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm" onMouseLeave={() => setOpenMenu(null)}>
      <div className="mx-auto max-w-[1348px] px-4 xl:px-0 w-full">
        <div className="flex justify-between items-center gap-4 h-[85px]">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Fruition Services"
                width={320}
                height={40}
                className="h-10 w-auto"
                priority
                unoptimized
              />
            ) : (
              <span className="font-bold text-lg">Fruition Services</span>
            )}
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
                        ? 'text-[#242323] border-[#242323] rounded-[4px]'
                        : active
                          ? 'text-[#8015e8] border-transparent'
                          : 'text-[#242323] border-transparent hover:text-[#8015e8]'
                    }`}
                  >
                    {item.label}
                  </button>
                </div>
              )
            })}

            {/* Partner badges + phone icon + CTA */}
            <div className="flex items-center gap-2 xl:gap-[12px] border-l border-gray-200 pl-3 xl:pl-4" onMouseEnter={() => setOpenMenu(null)}>
              <div className="hidden xl:flex items-center gap-3">
                {partnerBadges.map((badge, i) => {
                  const h = badge.height ?? 32
                  const cmsSrc = badge.image
                    ? urlFor(badge.image).height(h * 2).fit('max').url()
                    : null
                  const src = getDarkBadgeSrc(badge, cmsSrc)
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

              {/* Phone icon */}
              {phoneAu && (
                <a
                  href={`tel:${phoneAu.replace(/\s/g, '')}`}
                  className="flex items-center justify-center w-[36px] h-[32px] rounded-[7px] hover:bg-gray-100 transition-colors"
                  aria-label="Call us"
                >
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.22 22.167h-.047a15.633 15.633 0 0 1-6.803-2.987 15.388 15.388 0 0 1-4.678-5.133A15.517 15.517 0 0 1 3.85 7.583a3.395 3.395 0 0 1 .77-2.753A4.667 4.667 0 0 1 6.44 3.5h1.633c.98-.01 1.84.647 2.1 1.587.18.72.432 1.42.747 2.093a2.333 2.333 0 0 1-.525 2.567l-.688.688a11.667 11.667 0 0 0 5.858 5.858l.688-.688a2.333 2.333 0 0 1 2.567-.525c.673.316 1.373.567 2.093.747a2.18 2.18 0 0 1 1.587 2.147v1.633a2.333 2.333 0 0 1-2.333 2.333 3.267 3.267 0 0 1-.467.035l-.48-.007Z" stroke="#8015E8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              )}

              {/* CTA */}
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 whitespace-nowrap bg-gradient-to-r from-[#8015e8] to-[#ba83f0] hover:bg-[#579bfc] hover:bg-none text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-md"
              >
                <PaperPlaneIcon size={16} />
                Book a Time
              </a>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-[#242323]"
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

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 max-h-[80vh] overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.label} className="mb-4">
                {item.sections?.map((section, sIdx) => (
                  <div key={`${section.heading}-${sIdx}`} className="mb-3">
                    {section.heading && (
                      <p className="text-xs font-semibold text-[#8015e8] uppercase tracking-wider px-2 mb-1">
                        {section.heading}
                      </p>
                    )}
                    {section.items?.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href || '#'}
                        className={`block px-2 py-1.5 text-sm transition-colors ${
                          sub.href && pathname === sub.href
                            ? 'text-[#8015e8] font-medium'
                            : 'text-[#242323] hover:text-[#8015e8]'
                        }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            ))}
            {/* Partner badges mobile */}
            <div className="flex items-center gap-3 px-2 py-3 border-t border-gray-100">
              {partnerBadges.map((badge, i) => {
                const h = Math.round((badge.height ?? 32) * 0.75)
                const cmsSrc = badge.image
                  ? urlFor(badge.image).height(h * 2).fit('max').url()
                  : null
                const src = getDarkBadgeSrc(badge, cmsSrc)
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
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 mx-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#8015e8] to-[#ba83f0] hover:bg-[#579bfc] hover:bg-none text-white text-center px-6 py-2.5 rounded-full text-sm font-semibold transition-colors"
            >
              <PaperPlaneIcon size={16} />
              Book a Time
            </a>
          </div>
        )}
      </div>

      {/* Desktop mega dropdown */}
      {openMenu && (() => {
        const activeItem = navItems.find((item) => item.label === openMenu)
        if (!activeItem?.sections?.length) return null
        const sectionCount = activeItem.sections.length
        const hasMultipleSections = sectionCount > 1
        return (
          <div className="hidden lg:block absolute left-0 right-0 top-full border-t border-gray-200 bg-white shadow-lg z-50">
            <div className="max-w-[1348px] mx-auto px-4 xl:px-0 py-8">
              <div className="flex gap-16">
                {activeItem.sections.map((section, sIdx) => {
                  const itemCount = section.items?.length ?? 0
                  /* Auto-compute columns when not explicitly set */
                  let cols = section.columns
                  if (!cols) {
                    if (hasMultipleSections) {
                      cols = itemCount >= 6 ? 3 : 1
                    } else {
                      cols = itemCount >= 7 ? 4 : itemCount >= 6 ? 3 : itemCount >= 4 ? 2 : 1
                    }
                  }
                  const isNarrow = cols <= 1
                  return (
                    <div
                      key={`${section.heading}-${sIdx}`}
                      className={
                        hasMultipleSections && isNarrow
                          ? 'min-w-[240px] shrink-0'
                          : 'flex-1'
                      }
                    >
                      {section.heading && (
                        <p className="text-base font-medium text-[#686b82] pb-3 border-b border-gray-200 mb-5">
                          {section.heading}
                        </p>
                      )}
                      <div
                        className={
                          cols > 1
                            ? 'grid gap-y-5'
                            : 'flex flex-col gap-5'
                        }
                        style={cols > 1 ? { gridTemplateColumns: `repeat(${cols}, 1fr)`, columnGap: '3rem' } : undefined}
                      >
                        {section.items?.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href || '#'}
                            className={`text-sm transition-colors whitespace-nowrap ${
                              sub.href && pathname === sub.href
                                ? 'text-[#8015e8] font-medium'
                                : 'text-[#242323] hover:text-[#8015e8]'
                            }`}
                            onClick={() => setOpenMenu(null)}
                          >
                            {sub.label}
                          </Link>
                        ))}
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
