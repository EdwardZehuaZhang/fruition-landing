"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const CALENDLY_URL = 'https://calendly.com/global-calendar-fruitionservices'
const PHONE_AU = '+61 483 955 931'

interface NavSubSection {
  heading?: string
  items: { label: string; href: string }[]
}

interface NavItem {
  label: string
  sections: NavSubSection[]
}

const navItems: NavItem[] = [
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
      {
        heading: 'Solutions',
        items: [
          { label: 'monday.com Project Management', href: '/monday-consulting-solutions/monday-project-management' },
          { label: 'monday.com Service', href: '/monday-consulting-solutions/monday-service' },
          { label: 'monday.com Finance', href: '/monday-consulting-solutions/monday-for-finance' },
          { label: 'monday.com for Product Management', href: '/monday-consulting-solutions/monday-product-management' },
          { label: 'monday.com HR Solutions', href: '/monday-consulting-solutions/monday-for-hr' },
          { label: 'Solar CRM & Work Management Solution', href: '/monday-consulting-solutions/solar-crm-solution' },
          { label: 'monday.com for Installation & Renovation', href: '/monday-consulting-solutions/monday-for-cabinetry-renovation' },
          { label: 'AI Strategy & Execution', href: '/ai-strategy-and-execution' },
        ],
      },
    ],
  },
  {
    label: 'Partnerships & Locations',
    sections: [
      {
        heading: 'Partnerships',
        items: [
          { label: 'monday.com Expert Consultants', href: '/partnerships/monday-consulting-partner' },
          { label: 'Certified Make Partner', href: '/partnerships/make-partners' },
          { label: 'Certified n8n Partner', href: '/partnerships/n8n-integration-partner' },
          { label: 'Certified ClickUp Partner', href: '/partnerships/certified-clickup-partner' },
          { label: 'Certified Guidde Partner', href: '/partnerships/certified-guidde-partner' },
          { label: 'Certified HubSpot Partner', href: '/partnerships/certified-hubspot-partner' },
          { label: 'Hootsuite Delivery Partner', href: '/partnerships/hootsuite-delivery-partner' },
          { label: 'Certified Aircall Partner', href: '/partnerships/aircall-partner' },
          { label: 'Certified Atlassian Partner', href: '/partnerships/certified-atlassian-partner' },
        ],
      },
      {
        heading: 'Locations',
        items: [
          { label: 'monday.com Partner Australia', href: '/monday-partner-australia' },
          { label: 'monday.com Partner UK', href: '/monday-partner-uk' },
          { label: 'monday.com Partner US', href: '/monday-partner-us' },
          { label: 'monday.com Partner Singapore', href: '/monday-partner-singapore' },
          { label: 'monday.com Partner India', href: '/monday-partner-india' },
        ],
      },
    ],
  },
  {
    label: 'Industries',
    sections: [
      {
        heading: 'Industries',
        items: [
          { label: 'monday.com for Construction', href: '/monday-for-construction' },
          { label: 'monday.com for Manufacturing', href: '/monday-for-manufacturing' },
          { label: 'monday.com for Retail', href: '/monday-for-retail' },
          { label: 'monday.com for Professional Services', href: '/monday-for-professional-services' },
          { label: 'monday.com for Government', href: '/monday-for-government' },
          { label: 'monday.com for Marketing & Creative', href: '/monday-for-marketing' },
          { label: 'monday.com for Real Estate', href: '/monday-for-real-estate' },
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
          { label: 'Careers', href: '/careers' },
          { label: 'Meet The Team', href: '/fruition-team' },
          { label: 'FAQs', href: '/faqs' },
          { label: 'Case Studies', href: '/customer-testimonials' },
          { label: 'Blog', href: '/consulting-blog' },
        ],
      },
    ],
  },
]

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1348px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[85px]">
          {/* Logo */}
          <Link href="/" className="shrink-0 -ml-10">
            <Image
              src="/images/logo-fruition.png"
              alt="Fruition Services"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button className="text-[#242323] hover:text-[#8015e8] font-medium text-sm py-2 transition-colors">
                  {item.label}
                </button>
                {openMenu === item.label && (
                  <div className="absolute top-full left-0 bg-white shadow-lg rounded-xl py-4 z-50 flex gap-6 px-5 min-w-max border border-gray-100">
                    {item.sections.map((section) => (
                      <div key={section.heading} className="min-w-[220px]">
                        {section.heading && (
                          <p className="text-xs font-semibold text-[#8015e8] uppercase tracking-wider mb-2">
                            {section.heading}
                          </p>
                        )}
                        {section.items.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
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
            <div className="flex items-center gap-[12px] border-l border-gray-200 pl-4 -mr-10">
              <div className="flex items-center gap-3">
                <Image src="/images/partner-platinum.png" alt="monday.com Platinum Partner" width={80} height={32} className="h-7 w-auto" />
                <Image src="/images/partner-advanced-delivery.png" alt="Advanced Delivery Partner" width={80} height={32} className="h-7 w-auto" />
                <Image src="/images/partner-make.png" alt="Make Partners" width={60} height={32} className="h-7 w-auto" />
              </div>

              {/* Phone icon */}
              <a
                href={`tel:${PHONE_AU.replace(/\s/g, '')}`}
                className="flex items-center justify-center w-[36px] h-[32px] rounded-[7px] hover:bg-gray-100 transition-colors"
                aria-label="Call us"
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.22 22.167h-.047a15.633 15.633 0 0 1-6.803-2.987 15.388 15.388 0 0 1-4.678-5.133A15.517 15.517 0 0 1 3.85 7.583a3.395 3.395 0 0 1 .77-2.753A4.667 4.667 0 0 1 6.44 3.5h1.633c.98-.01 1.84.647 2.1 1.587.18.72.432 1.42.747 2.093a2.333 2.333 0 0 1-.525 2.567l-.688.688a11.667 11.667 0 0 0 5.858 5.858l.688-.688a2.333 2.333 0 0 1 2.567-.525c.673.316 1.373.567 2.093.747a2.18 2.18 0 0 1 1.587 2.147v1.633a2.333 2.333 0 0 1-2.333 2.333 3.267 3.267 0 0 1-.467.035l-.48-.007Z" stroke="#8015E8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>

              {/* CTA */}
              <a
                href={CALENDLY_URL}
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
                {item.sections.map((section) => (
                  <div key={section.heading} className="mb-3">
                    {section.heading && (
                      <p className="text-xs font-semibold text-[#8015e8] uppercase tracking-wider px-2 mb-1">
                        {section.heading}
                      </p>
                    )}
                    {section.items.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
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
              <Image src="/images/partner-platinum.png" alt="monday.com Platinum Partner" width={60} height={24} className="h-6 w-auto" />
              <Image src="/images/partner-advanced-delivery.png" alt="Advanced Delivery Partner" width={60} height={24} className="h-6 w-auto" />
              <Image src="/images/partner-make.png" alt="Make Partners" width={50} height={24} className="h-6 w-auto" />
            </div>
            <a
              href={CALENDLY_URL}
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
