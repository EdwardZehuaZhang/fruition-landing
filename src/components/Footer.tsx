import Link from 'next/link'
import Image from 'next/image'

const CALENDLY_URL = 'https://calendly.com/global-calendar-fruitionservices'

const locations = [
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
  {
    flag: '\u{1F1FA}\u{1F1F8}',
    city: 'New York, US Office',
    label: 'North America Office',
    href: '/monday-partner-us',
    address: '205 W 37th St, New York, NY 10018, United States',
    addressUrl: 'https://maps.app.goo.gl/4u1KjFHfUgiXGGta9',
    phone: '+1 302 330 2496',
    phoneTel: '+13023302496',
  },
  {
    flag: '\u{1F1EC}\u{1F1E7}',
    city: 'London, UK',
    label: 'EMEA Office',
    href: '/monday-partner-uk',
    address: 'Medius House, 2 Sheraton St, London W1F 8BH, United Kingdom',
    addressUrl: 'https://g.co/kgs/wmakkDU',
    phone: '+44 7822 019548',
    phoneTel: '+447822019548',
  },
]

const socials = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100092289551680', icon: '/images/social-facebook.png' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/fruition-services', icon: '/images/social-linkedin.png' },
  { label: 'WhatsApp', href: 'https://wa.me/61483955931', icon: '/images/social-whatsapp.png' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCF8mr3qiFVwiX0xrcAaKxgA', icon: '/images/social-youtube.png' },
]

const partnerLogos: { name: string; src: string; w: number; h: number }[] = [
  { name: 'monday.com Platinum Partner', src: '/images/partner-platinum-sm.png', w: 110, h: 38 },
  { name: 'Gold Solution Partner', src: '/images/partner-gold-solution.png', w: 120, h: 41 },
  { name: 'Advanced Delivery Partner', src: '/images/partner-advanced-delivery-sm.png', w: 110, h: 38 },
  { name: 'n8n Partner', src: '/images/partner-n8n.png', w: 104, h: 29 },
  { name: 'Make Partners', src: '/images/partner-make-sm.png', w: 110, h: 26 },
  { name: 'Aircall Partners', src: '/images/partner-aircall.png', w: 89, h: 38 },
  { name: 'Hootsuite Partners', src: '/images/partner-hootsuite.png', w: 126, h: 28 },
  { name: 'Guidde Partner', src: '/images/partner-guidde.png', w: 79, h: 28 },
]

const servicesLinks = [
  { label: 'Implementation Packages', href: '/implementation-packages' },
  { label: 'monday.com Training', href: '/monday-training' },
  { label: 'monday.com Implementation Consultants', href: '/monday-implementation-consultants' },
  { label: 'monday CRM Consulting', href: '/monday-crm-consulting' },
]

const departmentLinks = [
  { label: 'monday.com Project Management', href: '/monday-consulting-solutions/monday-project-management' },
  { label: 'monday.com Service', href: '/monday-consulting-solutions/monday-service' },
  { label: 'monday.com HR Solutions', href: '/monday-consulting-solutions/monday-for-hr' },
  { label: 'monday.com for Marketing & Creative', href: '/monday-for-marketing' },
  { label: 'monday.com Finance', href: '/monday-consulting-solutions/monday-for-finance' },
  { label: 'monday.com for Product Management', href: '/monday-consulting-solutions/monday-product-management' },
  { label: 'Solar CRM & Work Management Solution', href: '/monday-consulting-solutions/solar-crm-solution' },
  { label: 'AI Strategy & Execution', href: '/ai-strategy-and-execution' },
  { label: 'Case Studies', href: '/customer-testimonials' },
]

const industryLinks = [
  { label: 'monday.com for Construction', href: '/monday-for-construction' },
  { label: 'monday.com for Manufacturing', href: '/monday-for-manufacturing' },
  { label: 'monday.com for Retail', href: '/monday-for-retail' },
  { label: 'monday.com for Professional Services', href: '/monday-for-professional-services' },
  { label: 'monday.com for Government', href: '/monday-for-government' },
  { label: 'monday.com for Marketing & Creative', href: '/monday-for-marketing' },
  { label: 'monday.com for Real Estate', href: '/monday-for-real-estate' },
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

export default function Footer() {
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
              src="/images/logo-fruition.png"
              alt="Fruition Services"
              width={147}
              height={28}
              className="h-[28px] w-auto brightness-0 invert"
            />
          </Link>
          <a
            href={CALENDLY_URL}
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
            href="mailto:contact@fruitionservices.io"
            className="flex items-start gap-2 text-white hover:opacity-80 transition-opacity"
          >
            <EnvelopeIcon />
            <span className="text-[13px] leading-[20px]">contact@fruitionservices.io</span>
          </a>

          {/* Phone numbers */}
          <div className="flex items-start gap-2">
            <PhoneIcon />
            <div className="flex flex-col text-[13px] leading-[20px] text-white">
              <a href="tel:+61483955931" className="hover:opacity-80 transition-opacity">+61 483 955 931</a>
              <a href="tel:+13023302496" className="hover:opacity-80 transition-opacity">+1 302 330 2496</a>
              <a href="tel:+447822019548" className="hover:opacity-80 transition-opacity">+44 7822 019548</a>
            </div>
          </div>
        </div>

        {/* Partner Expertise */}
        <div>
          <h4 className="text-white font-semibold text-[16px] mb-3">Partner Expertise</h4>
          <div className="grid grid-cols-2 gap-x-[40px] gap-y-[7px]">
            {partnerLogos.map((p) => (
              <div key={p.name} className="flex items-center">
                <Image
                  src={p.src}
                  alt={p.name}
                  width={p.w}
                  height={p.h}
                  className="object-contain"
                  style={{ width: p.w, height: p.h }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-[9px]">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image src={s.icon} alt={s.label} width={26} height={26} className="w-[26px] h-[26px]" />
            </a>
          ))}
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
              {servicesLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
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
              {departmentLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
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
              {industryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
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
            {locations.map((loc) => (
              <div key={loc.phoneTel}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[18px] leading-none">{loc.flag}</span>
                  <Link
                    href={loc.href}
                    className="text-[#d2acf7] text-[12px] font-medium hover:opacity-80 transition-opacity"
                  >
                    {loc.city}
                  </Link>
                </div>
                <p className="text-white/70 text-[11px] mb-0.5">({loc.label})</p>
                <a
                  href={loc.addressUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-[12px] leading-[18px] hover:opacity-80 transition-opacity block mb-1"
                >
                  {loc.address}
                </a>
                <a
                  href={`tel:${loc.phoneTel}`}
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
