import Link from 'next/link'

const CALENDLY_URL = 'https://calendly.com/global-calendar-fruitionservices'
const PHONE = '+61 483 955 931'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Fruition</h3>
            <p className="text-sm text-gray-400 mb-4">
              monday.com Platinum Partners helping teams work smarter.
            </p>
            <a href={`tel:${PHONE}`} className="text-sm hover:text-white">
              {PHONE}
            </a>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/implementation-packages" className="hover:text-white">Implementation Packages</Link></li>
              <li><Link href="/monday-training" className="hover:text-white">monday.com Training</Link></li>
              <li><Link href="/monday-crm-consulting" className="hover:text-white">CRM Consulting</Link></li>
              <li><Link href="/ai-strategy-and-execution" className="hover:text-white">AI Strategy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about-us" className="hover:text-white">About Us</Link></li>
              <li><Link href="/fruition-team" className="hover:text-white">Our Team</Link></li>
              <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link href="/consulting-blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/faqs" className="hover:text-white">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Get Started</h4>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors mb-4"
            >
              Book a Consultation
            </a>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms-and-conditions" className="hover:text-white">Terms & Conditions</Link></li>
              <li><Link href="/data-privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-500 text-center">
          {new Date().getFullYear()} Fruition Services. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
