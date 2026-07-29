"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import PaperPlaneIcon from '@/components/common/icons/PaperPlaneIcon'
import { NavIcon } from '@/components/common/icons/NavIcons'

interface NavLink {
  label?: string
  href?: string
  description?: string
  icon?: string
  featured?: boolean
}

interface NavSubSection {
  heading?: string
  items?: NavLink[]
  columns?: number
  highlight?: boolean
  badge?: string
}

interface NavItem {
  label?: string
  href?: string
  layout?: 'stacked' | 'columns'
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
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null)
  const pathname = usePathname()

  const closeMobile = () => {
    setMobileOpen(false)
    setMobileExpanded(null)
    setMobileExpandedSection(null)
  }

  const calendlyUrl = siteSettings?.calendlyLink || ''
  const phoneAu = siteSettings?.phone
  const navItems: NavItem[] = siteSettings?.navigation || []
  const ctaLabel = siteSettings?.navbarCtaLabel || ''

  const isNavItemActive = (item: NavItem) =>
    item.sections?.some((s) => s.items?.some((link) => link.href && pathname === link.href)) ?? false

  return (
    <nav className="bg-surface dark:shadow-none sticky top-0 z-50 shadow-sm" onMouseLeave={() => setOpenMenu(null)}>
      <div className="mx-auto max-w-[1348px] px-4 w-full">
        <div className="flex justify-between items-center gap-4 h-[85px]">
          {/* Logo — black on light, white in dark mode (prefers-color-scheme) */}
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
          <div className="hidden lg:flex items-center gap-3">
            {navItems.map((item) => {
              const active = isNavItemActive(item)
              // Direct-link tab (e.g. Contact): a plain link, no dropdown.
              if (item.href && !item.sections?.length) {
                const linkActive = pathname === item.href
                return (
                  <div key={item.label} onMouseEnter={() => setOpenMenu(null)}>
                    <Link
                      href={item.href}
                      className={`block font-medium text-sm py-1.5 px-3 transition-colors border border-transparent whitespace-nowrap ${
                        linkActive
                          ? 'text-brand dark:text-brand-light'
                          : 'text-body hover:text-brand dark:hover:text-brand-light'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </div>
                )
              }
              return (
                <div
                  key={item.label}
                  onMouseEnter={() => setOpenMenu(item.label || null)}
                >
                  <button
                    className={`font-medium text-sm py-1.5 px-3 transition-colors border whitespace-nowrap ${
                      openMenu === item.label
                        ? 'text-body border-body rounded-[4px]'
                        : active
                          ? 'text-brand dark:text-brand-light border-transparent'
                          : 'text-body border-transparent hover:text-brand dark:hover:text-brand-light'
                    }`}
                  >
                    {item.label}
                  </button>
                </div>
              )
            })}

            {/* Phone icon + CTA (partner badges removed from nav — they crowded
                the six-tab row and overlapped the Contact tab) */}
            <div className="flex items-center gap-2 border-l border-ui pl-3" onMouseEnter={() => setOpenMenu(null)}>
              {/* Phone icon */}
              {phoneAu && (
                <a
                  href={`tel:${phoneAu.replace(/\s/g, '')}`}
                  className="flex items-center justify-center w-[36px] h-[32px] rounded-[7px] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  aria-label="Call us"
                >
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand">
                    <path d="M17.22 22.167h-.047a15.633 15.633 0 0 1-6.803-2.987 15.388 15.388 0 0 1-4.678-5.133A15.517 15.517 0 0 1 3.85 7.583a3.395 3.395 0 0 1 .77-2.753A4.667 4.667 0 0 1 6.44 3.5h1.633c.98-.01 1.84.647 2.1 1.587.18.72.432 1.42.747 2.093a2.333 2.333 0 0 1-.525 2.567l-.688.688a11.667 11.667 0 0 0 5.858 5.858l.688-.688a2.333 2.333 0 0 1 2.567-.525c.673.316 1.373.567 2.093.747a2.18 2.18 0 0 1 1.587 2.147v1.633a2.333 2.333 0 0 1-2.333 2.333 3.267 3.267 0 0 1-.467.035l-.48-.007Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              )}

              {/* CTA */}
              {ctaLabel && calendlyUrl && (
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 whitespace-nowrap bg-gradient-to-r from-brand to-brand-light hover:bg-brand-dark hover:bg-none text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-md"
                >
                  <PaperPlaneIcon size={16} />
                  {ctaLabel}
                </a>
              )}
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-body"
            onClick={() => (mobileOpen ? closeMobile() : setMobileOpen(true))}
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
          <div className="lg:hidden py-2 border-t border-ui max-h-[80vh] overflow-y-auto">
            {navItems.map((item) => {
              const expanded = mobileExpanded === item.label
              const active = isNavItemActive(item)
              // Direct-link tab (e.g. Contact): a plain row, no accordion.
              if (item.href && !item.sections?.length) {
                return (
                  <div key={item.label} className="border-b border-ui last:border-b-0">
                    <Link
                      href={item.href}
                      onClick={closeMobile}
                      className={`block px-2 py-3 text-[15px] font-semibold ${
                        pathname === item.href ? 'text-brand' : 'text-body hover:text-brand'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </div>
                )
              }
              return (
                <div key={item.label} className="border-b border-ui last:border-b-0">
                  {/* Level 1: category header (tap to expand) */}
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => {
                      setMobileExpanded(expanded ? null : item.label || null)
                      setMobileExpandedSection(null)
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-2 py-3 text-left transition-colors ${
                      expanded || active ? 'text-brand' : 'text-body hover:text-brand'
                    }`}
                  >
                    <span className="text-[15px] font-semibold">{item.label}</span>
                    <svg
                      className={`shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {/* Level 2: sub-sections as their own accordions */}
                  {expanded && (
                    <div className="pb-2">
                      {item.sections?.map((section, sIdx) => {
                        const sectionKey = `${item.label}-${section.heading}-${sIdx}`
                        const sectionOpen = !section.heading || mobileExpandedSection === sectionKey
                        return (
                        <div key={`${section.heading}-${sIdx}`} className="mb-1">
                          {section.heading && (
                            <button
                              type="button"
                              aria-expanded={sectionOpen}
                              onClick={() =>
                                setMobileExpandedSection(
                                  mobileExpandedSection === sectionKey ? null : sectionKey,
                                )
                              }
                              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left"
                            >
                              <span className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-2">
                                {section.heading}
                                {section.badge && (
                                  <span className="inline-flex items-center rounded-full ring-1 ring-ui text-muted text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 whitespace-nowrap">
                                    {section.badge}
                                  </span>
                                )}
                              </span>
                              <svg
                                className={`shrink-0 text-muted transition-transform duration-200 ${sectionOpen ? 'rotate-180' : ''}`}
                                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                              >
                                <path d="M6 9l6 6 6-6" />
                              </svg>
                            </button>
                          )}
                          {sectionOpen && section.items?.map((sub) => {
                            const isActive = sub.href && pathname === sub.href
                            return (
                              <Link
                                key={sub.href}
                                href={sub.href || '#'}
                                className={`flex items-start gap-3 pl-4 pr-2 py-2 rounded-md transition-colors ${
                                  isActive ? 'bg-black/5 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'
                                }`}
                                onClick={closeMobile}
                              >
                                {sub.icon && (
                                  <div className={`shrink-0 mt-0.5 w-7 h-7 rounded-md ring-1 ring-ui bg-surface-raised flex items-center justify-center ${isActive ? 'text-brand' : 'text-body'}`}>
                                    <NavIcon iconKey={sub.icon} className="h-4 w-4" />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <div className={`text-sm font-medium ${isActive ? 'text-brand dark:text-brand-light' : 'text-body'}`}>
                                    {sub.label}
                                  </div>
                                  {sub.description && (
                                    <div className="mt-0.5 text-xs text-muted leading-snug">
                                      {sub.description}
                                    </div>
                                  )}
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
            {ctaLabel && calendlyUrl && (
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 mx-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand to-brand-light hover:bg-brand-dark hover:bg-none text-white text-center px-6 py-2.5 rounded-full text-sm font-semibold transition-colors"
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
        const columnsLayout = activeItem.layout === 'columns'
        return (
          <div className="hidden lg:block absolute left-0 right-0 top-full border-t border-ui bg-surface-raised shadow-lg z-50">
            <div className="max-w-[1348px] mx-auto px-4 py-8">
              <div className={columnsLayout ? 'flex flex-row items-stretch gap-6' : 'flex flex-col gap-6'}>
                {activeItem.sections.map((section, sIdx) => {
                  const cols = section.columns ?? (columnsLayout ? 1 : 3)
                  return (
                    <div
                      key={`${section.heading}-${sIdx}`}
                      className={`min-w-0 ${columnsLayout ? 'flex-1' : ''}`}
                    >
                      {section.heading && (
                        <p
                          className={`text-xs pb-3 border-b mb-3 flex items-center gap-2 text-muted border-ui ${
                            columnsLayout ? 'font-semibold uppercase tracking-wider' : 'font-medium'
                          }`}
                        >
                          {section.heading}
                          {section.badge && (
                            <span className="inline-flex items-center rounded-full ring-1 ring-ui text-muted text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 whitespace-nowrap">
                              {section.badge}
                            </span>
                          )}
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
                                isActive
                                  ? 'bg-black/5 dark:bg-white/10'
                                  : sub.featured
                                    ? 'bg-surface-raised ring-1 ring-ui shadow-sm hover:ring-brand dark:hover:ring-brand-light'
                                    : 'hover:bg-black/5 dark:hover:bg-white/5'
                              }`}
                              onClick={() => setOpenMenu(null)}
                            >
                              <div
                                className={`shrink-0 mt-0.5 w-8 h-8 rounded-md ring-1 ring-ui bg-surface-raised flex items-center justify-center transition-colors ${
                                  isActive
                                    ? 'text-brand'
                                    : 'text-body group-hover:text-brand group-hover:ring-brand/30'
                                }`}
                              >
                                {sub.icon ? (
                                  <NavIcon iconKey={sub.icon} className="h-[18px] w-[18px]" />
                                ) : (
                                  <span className="block h-2 w-2 rounded-full bg-gray-300" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div
                                  className={`text-sm font-semibold leading-tight ${
                                    isActive
                                      ? 'text-brand dark:text-brand-light'
                                      : 'text-body group-hover:text-brand'
                                  }`}
                                >
                                  {sub.label}
                                </div>
                                {sub.description && (
                                  <div className="mt-1 text-xs text-muted leading-snug">
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
