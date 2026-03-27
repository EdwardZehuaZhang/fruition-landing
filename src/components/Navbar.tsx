"use client"
import Link from 'next/link'
import { useState } from 'react'

const CALENDLY_URL = 'https://calendly.com/global-calendar-fruitionservices'

const navItems = [
  {
    label: 'What We Offer',
    items: [
      { label: 'monday.com Consulting', href: '/monday-consulting-solutions/monday-project-management' },
      { label: 'Implementation Packages', href: '/implementation-packages' },
      { label: 'monday.com Training', href: '/monday-training' },
      { label: 'monday.com Implementation', href: '/monday-implementation-consultants' },
      { label: 'monday.com CRM Consulting', href: '/monday-crm-consulting' },
      { label: 'AI Strategy & Execution', href: '/ai-strategy-and-execution' },
    ],
  },
  {
    label: 'Partnerships & Locations',
    items: [
      { label: 'monday.com Partner', href: '/partnerships/monday-consulting-partner' },
      { label: 'Make Partners', href: '/partnerships/make-partners' },
      { label: 'ClickUp Partner', href: '/partnerships/certified-clickup-partner' },
      { label: 'Australia', href: '/monday-partner-australia' },
      { label: 'UK', href: '/monday-partner-uk' },
      { label: 'USA', href: '/monday-partner-us' },
      { label: 'Singapore', href: '/monday-partner-singapore' },
    ],
  },
  {
    label: 'Industries',
    items: [
      { label: 'Construction', href: '/monday-for-construction' },
      { label: 'Manufacturing', href: '/monday-for-manufacturing' },
      { label: 'Retail', href: '/monday-for-retail' },
      { label: 'Professional Services', href: '/monday-for-professional-services' },
      { label: 'Government', href: '/monday-for-government' },
      { label: 'Marketing', href: '/monday-for-marketing' },
      { label: 'Real Estate', href: '/monday-for-real-estate' },
    ],
  },
  {
    label: 'About',
    items: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Our Team', href: '/fruition-team' },
      { label: 'Customer Testimonials', href: '/customer-testimonials' },
      { label: 'Blog', href: '/consulting-blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'FAQs', href: '/faqs' },
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
                  <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-[200px] z-50">
                    {item.items.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
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
          <div className="lg:hidden py-4 border-t border-gray-100">
            {navItems.map((item) => (
              <div key={item.label} className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-1">
                  {item.label}
                </p>
                {item.items.map((sub) => (
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
