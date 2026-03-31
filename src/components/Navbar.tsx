"use client"
import Link from 'next/link'
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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-700">
            Fruition
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button className="text-gray-700 hover:text-blue-700 font-medium text-sm py-2">
                  {item.label}
                </button>
                {openMenu === item.label && (
                  <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-3 z-50 flex gap-6 px-4 min-w-max">
                    {item.sections.map((section) => (
                      <div key={section.heading} className="min-w-[220px]">
                        {section.heading && (
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            {section.heading}
                          </p>
                        )}
                        {section.items.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block py-1.5 text-sm text-gray-700 hover:text-blue-700"
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
            <a href={`tel:${PHONE_AU}`} className="text-gray-700 hover:text-blue-700 text-sm font-medium">
              Phone
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors"
            >
              Book a Time
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-gray-700"
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
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-1">
                        {section.heading}
                      </p>
                    )}
                    {section.items.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block px-2 py-1.5 text-sm text-gray-700 hover:text-blue-700"
                        onClick={() => setMobileOpen(false)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            ))}
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 bg-blue-700 text-white text-center px-4 py-2 rounded-md text-sm font-medium"
            >
              Book a Time
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
