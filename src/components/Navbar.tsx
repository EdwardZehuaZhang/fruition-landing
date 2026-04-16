"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { urlFor } from '@/sanity/image'

const FALLBACK_CALENDLY_URL = 'https://calendly.com/global-calendar-fruitionservices'
const FALLBACK_PHONE_AU = '+61 483 955 931'

interface NavLink {
  label?: string
  href?: string
}

interface NavSubSection {
  heading?: string
  items?: NavLink[]
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

const FALLBACK_NAV: NavItem[] = [
  {
    label: 'What We Offer',
    sections: [
      {
        heading: 'Services',
        items: [
          { label: 'Implementation Packages', href: '/implementation-packages' },
          { label: 'monday.com Training', href: '/monday-training' },
          { label: 'monday.com Implementation Consultants', href: '/monday-implementation-consultants' },
          { label: 'monday CRM Consulting', href: '/monday-crm-consulting' },
        ],
      },
    ],
  },
  {
    label: 'About',
    sections: [
      {
        heading: 'About',
        items: [
          { label: 'About Us', href: '/about-us' },
          { label: 'Blog', href: '/consulting-blog' },
        ],
      },
    ],
  },
]

export default function Navbar({ siteSettings }: { siteSettings?: SiteSettingsProp | null }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const calendlyUrl = siteSettings?.calendlyLink || FALLBACK_CALENDLY_URL
  const phoneAu = siteSettings?.phone || FALLBACK_PHONE_AU
  const navItems: NavItem[] =
    siteSettings?.navigation && siteSettings.navigation.length > 0 ? siteSettings.navigation : FALLBACK_NAV
  const partnerBadges: PartnerBadge[] = siteSettings?.navbarPartnerBadges ?? []

  const logoUrl = siteSettings?.logo
    ? urlFor(siteSettings.logo).height(80).fit('max').url()
    : '/images/logo-fruition.png'

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1348px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[85px]">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src={logoUrl}
              alt="Fruition Services"
              width={320}
              height={40}
              className="h-10 w-auto"
              priority
              unoptimized
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label || null)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button className="text-[#242323] hover:text-[#8015e8] font-medium text-sm py-2 transition-colors">
                  {item.label}
                </button>
                {openMenu === item.label && (
                  <div className="absolute top-full left-0 bg-white shadow-lg rounded-xl py-4 z-50 flex gap-6 px-5 min-w-max border border-gray-100">
                    {item.sections?.map((section, sIdx) => (
                      <div key={`${section.heading}-${sIdx}`} className="min-w-[220px]">
                        {section.heading && (
                          <p className="text-xs font-semibold text-[#8015e8] uppercase tracking-wider mb-2">
                            {section.heading}
                          </p>
                        )}
                        {section.items?.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href || '#'}
                            className="block py-1.5 text-sm text-[#242323] hover:text-[#8015e8] transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Partner badges + phone icon + CTA */}
            <div className="flex items-center gap-[12px] border-l border-gray-200 pl-4">
              <div className="flex items-center gap-3">
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

              {/* Phone icon */}
              <a
                href={`tel:${phoneAu.replace(/\s/g, '')}`}
                className="flex items-center justify-center w-[36px] h-[32px] rounded-[7px] hover:bg-gray-100 transition-colors"
                aria-label="Call us"
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.22 22.167h-.047a15.633 15.633 0 0 1-6.803-2.987 15.388 15.388 0 0 1-4.678-5.133A15.517 15.517 0 0 1 3.85 7.583a3.395 3.395 0 0 1 .77-2.753A4.667 4.667 0 0 1 6.44 3.5h1.633c.98-.01 1.84.647 2.1 1.587.18.72.432 1.42.747 2.093a2.333 2.333 0 0 1-.525 2.567l-.688.688a11.667 11.667 0 0 0 5.858 5.858l.688-.688a2.333 2.333 0 0 1 2.567-.525c.673.316 1.373.567 2.093.747a2.18 2.18 0 0 1 1.587 2.147v1.633a2.333 2.333 0 0 1-2.333 2.333 3.267 3.267 0 0 1-.467.035l-.48-.007Z" stroke="#8015E8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>

              {/* CTA */}
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[#8015e8] to-[#ba83f0] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
              >
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
                        className="block px-2 py-1.5 text-sm text-[#242323] hover:text-[#8015e8]"
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
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 mx-2 bg-gradient-to-r from-[#8015e8] to-[#ba83f0] text-white text-center px-6 py-2.5 rounded-full text-sm font-semibold"
            >
              Book a Time
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
