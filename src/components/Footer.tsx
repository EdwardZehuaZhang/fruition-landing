import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/image'

const FALLBACK_CALENDLY_URL = 'https://calendly.com/global-calendar-fruitionservices'

interface FooterLink {
  label?: string
  href?: string
}

interface Office {
  flag?: string
  city?: string
  label?: string
  href?: string
  address?: string
  addressUrl?: string
  phone?: string
  phoneTel?: string
}

interface SocialLink {
  label?: string
  href?: string
  icon?: unknown
}

interface FooterPartnerLogo {
  name?: string
  image?: unknown
  width?: number
  height?: number
}

interface SiteSettingsProp {
  contactEmail?: string
  phone?: string
  calendlyLink?: string
  logo?: unknown
  logoWhite?: unknown
  offices?: Office[]
  socialLinks?: SocialLink[]
  footerPartnerLogos?: FooterPartnerLogo[]
  footerServicesLinks?: FooterLink[]
  footerDepartmentLinks?: FooterLink[]
  footerIndustryLinks?: FooterLink[]
}

const FALLBACK_OFFICES: Office[] = [
  {
    flag: '\u{1F1E6}\u{1F1FA}',
    city: 'Sydney, Australia',
    label: 'Head Office',
    href: '/monday-partner-australia',
    address: '64 York Street, Sydney NSW 2000 Australia',
    addressUrl: 'https://g.co/kgs/gAajXzG',
    phone: '+61 483 955 931',
    phoneTel: '+61483955931',
  },
]

/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                   */
/* ------------------------------------------------------------------ */

function EnvelopeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-[2px]">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13L2 4" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-[2px]">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  )
}

export default function Footer({ siteSettings }: { siteSettings?: SiteSettingsProp | null }) {
  const calendlyUrl = siteSettings?.calendlyLink || FALLBACK_CALENDLY_URL
  const offices = siteSettings?.offices && siteSettings.offices.length > 0 ? siteSettings.offices : FALLBACK_OFFICES
  const socials = siteSettings?.socialLinks ?? []
  const partnerLogos = siteSettings?.footerPartnerLogos ?? []
  const servicesLinks = siteSettings?.footerServicesLinks ?? []
  const departmentLinks = siteSettings?.footerDepartmentLinks ?? []
  const industryLinks = siteSettings?.footerIndustryLinks ?? []

  const contactEmail = siteSettings?.contactEmail || 'contact@fruitionservices.io'
  const logoSrc = siteSettings?.logoWhite
    ? urlFor(siteSettings.logoWhite).width(640).url()
    : '/images/logo-fruition-white.avif'

  return (
    <footer className="flex flex-col lg:flex-row w-full">
      {/* ============================================================ */}
      {/*  LEFT PANEL - gradient background                            */}
      {/* ============================================================ */}
      <div
        className="w-full lg:w-[530px] shrink-0 py-12 lg:py-16 px-8 sm:px-12 lg:pl-[120px] lg:pr-10 flex flex-col gap-8"
        style={{
          background: 'linear-gradient(-38deg, rgb(128, 21, 232) 0%, rgb(16, 0, 58) 100%)',
        }}
      >
        {/* Logo + CTA row */}
        <div className="flex items-center gap-[15px] flex-wrap">
          <Link href="/">
            <Image
              src={logoSrc}
              alt="Fruition Services"
              width={320}
              height={28}
              className="h-[28px] w-auto"
              unoptimized
            />
          </Link>
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-gradient-to-r from-[#8015e8] to-[#ba83f0] text-white px-6 py-2 rounded-full text-[13px] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Book a Meeting
          </a>
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-[10px]">
          {/* Email */}
          <a
            href={`mailto:${contactEmail}`}
            className="flex items-start gap-2 text-white hover:opacity-80 transition-opacity"
          >
            <EnvelopeIcon />
            <span className="text-[13px] leading-[20px]">{contactEmail}</span>
          </a>

          {/* Phone numbers (one per office) */}
          <div className="flex items-start gap-2">
            <PhoneIcon />
            <div className="flex flex-col text-[13px] leading-[20px] text-white">
              {offices.map((o) => (
                <a
                  key={o.phoneTel || o.phone}
                  href={`tel:${o.phoneTel || (o.phone || '').replace(/\s/g, '')}`}
                  className="hover:opacity-80 transition-opacity"
                >
                  {o.phone}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Partner Expertise */}
        <div>
          <h4 className="text-white font-semibold text-[16px] mb-3">Partner Expertise</h4>
          <div className="grid grid-cols-2 gap-x-[40px] gap-y-[7px]">
            {partnerLogos.map((p, i) => {
              const w = p.width ?? 110
              const h = p.height ?? 38
              const src = p.image ? urlFor(p.image).width(w * 2).height(h * 2).url() : null
              if (!src) return null
              return (
                <div key={`${p.name}-${i}`} className="flex items-center">
                  <Image
                    src={src}
                    alt={p.name || 'Partner logo'}
                    width={w}
                    height={h}
                    className="object-contain"
                    style={{ width: w, height: h }}
                    unoptimized
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-[9px]">
          {socials.map((s, i) => {
            const src = s.icon ? urlFor(s.icon).width(52).height(52).url() : null
            if (!src) return null
            return (
              <a
                key={`${s.label}-${i}`}
                href={s.href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image src={src} alt={s.label || 'Social'} width={26} height={26} className="w-[26px] h-[26px]" unoptimized />
              </a>
            )
          })}
        </div>

        {/* Privacy links */}
        <div className="flex items-center gap-[14px]">
          <Link href="/data-privacy" className="text-white text-[12px] hover:opacity-80 transition-opacity">
            Data Privacy
          </Link>
          <Link href="/terms-and-conditions" className="text-white text-[12px] hover:opacity-80 transition-opacity">
            Terms and Conditions
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-white text-[11px] tracking-[0.55px]">
          &copy; 2025 Fruition Services. All rights reserved.
        </p>
      </div>

      {/* ============================================================ */}
      {/*  RIGHT PANEL - dark background                               */}
      {/* ============================================================ */}
      <div className="flex-1 bg-black py-12 lg:py-16 px-8 sm:px-12 lg:px-16">
        {/* Three link columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8">
          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-[16px] mb-4">Services</h4>
            <div className="flex flex-col">
              {servicesLinks.map((link, i) => (
                <Link
                  key={`${link.href}-${i}`}
                  href={link.href || '#'}
                  className="text-white text-[12px] leading-[28px] hover:opacity-80 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Department Solutions */}
          <div>
            <h4 className="text-white font-semibold text-[16px] mb-4">Department Solutions</h4>
            <div className="flex flex-col">
              {departmentLinks.map((link, i) => (
                <Link
                  key={`${link.href}-${i}`}
                  href={link.href || '#'}
                  className="text-white text-[12px] leading-[28px] hover:opacity-80 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Industry Solutions */}
          <div>
            <h4 className="text-white font-semibold text-[16px] mb-4">Industry Solutions</h4>
            <div className="flex flex-col">
              {industryLinks.map((link, i) => (
                <Link
                  key={`${link.href}-${i}`}
                  href={link.href || '#'}
                  className="text-white text-[12px] leading-[28px] hover:opacity-80 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Our Locations */}
        <div className="mt-12">
          <h4 className="text-white font-semibold text-[16px] mb-5">Our Locations</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offices.map((loc, i) => (
              <div key={`${loc.phoneTel}-${i}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[18px] leading-none">{loc.flag}</span>
                  <Link
                    href={loc.href || '#'}
                    className="text-[#d2acf7] text-[12px] font-medium hover:opacity-80 transition-opacity"
                  >
                    {loc.city}
                  </Link>
                </div>
                <p className="text-white/70 text-[11px] mb-0.5">({loc.label})</p>
                {loc.addressUrl ? (
                  <a
                    href={loc.addressUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-[12px] leading-[18px] hover:opacity-80 transition-opacity block mb-1"
                  >
                    {loc.address}
                  </a>
                ) : (
                  <p className="text-white text-[12px] leading-[18px] mb-1">{loc.address}</p>
                )}
                <a
                  href={`tel:${loc.phoneTel || (loc.phone || '').replace(/\s/g, '')}`}
                  className="text-white text-[12px] hover:opacity-80 transition-opacity"
                >
                  {loc.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
