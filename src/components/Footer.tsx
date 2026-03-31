import Link from 'next/link'

const CALENDLY_URL = 'https://calendly.com/global-calendar-fruitionservices'

const offices = [
  {
    name: 'Sydney, Australia (Head Office)',
    href: '/monday-partner-australia',
    address: '64 York Street, Sydney NSW 2000 Australia',
    addressUrl: 'https://g.co/kgs/gAajXzG',
    phone: '+61 483 955 931',
    phoneTel: '+61483955931',
  },
  {
    name: 'New York, US Office (North America Office)',
    href: '/monday-partner-us',
    address: '205 W 37th St, New York, NY 10018, United States',
    addressUrl: 'https://maps.app.goo.gl/4u1KjFHfUgiXGGta9',
    phone: '+1 302 330 2496',
    phoneTel: '+13023302496',
  },
  {
    name: 'London, UK Office (EMEA Office)',
    href: '/monday-partner-uk',
    address: 'Medius House, 2 Sheraton St, London W1F 8BH, United Kingdom',
    addressUrl: 'https://g.co/kgs/wmakkDU',
    phone: '+44 7822 019548',
    phoneTel: '+447822019548',
  },
]

const services = [
  { label: 'Implementation Packages', href: '/implementation-packages' },
  { label: 'monday.com Training', href: '/monday-training' },
  { label: 'monday.com Implementation Consultants', href: '/monday-implementation-consultants' },
  { label: 'monday CRM Consulting', href: '/monday-crm-consulting' },
]

const departmentSolutions = [
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

const industrySolutions = [
  { label: 'monday.com for Construction', href: '/monday-for-construction' },
  { label: 'monday.com for Manufacturing', href: '/monday-for-manufacturing' },
  { label: 'monday.com for Retail', href: '/monday-for-retail' },
  { label: 'monday.com for Professional Services', href: '/monday-for-professional-services' },
  { label: 'monday.com for Government', href: '/monday-for-government' },
  { label: 'monday.com for Marketing & Creative', href: '/monday-for-marketing' },
  { label: 'monday.com for Real Estate', href: '/monday-for-real-estate' },
]

const quickLinks = [
  { label: 'Implementation Packages', href: '/implementation-packages' },
  { label: 'Solutions', href: '/monday-consulting-solutions' },
  { label: 'Blog', href: '/consulting-blog' },
  { label: 'Partnerships', href: '/partnerships' },
  { label: 'monday CRM Consulting', href: '/monday-crm-consulting' },
  { label: 'About', href: '/about-us' },
  { label: 'Meet The Team', href: '/fruition-team' },
]

const socials = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100092289551680' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/fruition-services' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCF8mr3qiFVwiX0xrcAaKxgA' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      {/* Quick links bar */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Security note */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <p className="text-sm text-gray-400">
            Put security first with monday.com&apos;s worldclass security &amp; locally hosted Data centres (AU, US and EU)
          </p>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Book a Meeting
          </a>
        </div>
      </div>

      {/* Contact row */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
          <a href="mailto:info@fruitionservices.io" className="hover:text-white">info@fruitionservices.io</a>
          <a href="tel:+61483955931" className="hover:text-white">+61 483 955 931</a>
          <a href="tel:+13023302496" className="hover:text-white">+1 302 330 2496</a>
          <a href="tel:+447822019548" className="hover:text-white">+44 7822 019548</a>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-sm">
              {services.map((s) => (
                <li key={s.href}><Link href={s.href} className="hover:text-white transition-colors">{s.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Department Solutions */}
          <div>
            <h4 className="text-white font-semibold mb-3">Department Solutions</h4>
            <ul className="space-y-2 text-sm">
              {departmentSolutions.map((s) => (
                <li key={s.href + s.label}><Link href={s.href} className="hover:text-white transition-colors">{s.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Industry Solutions */}
          <div>
            <h4 className="text-white font-semibold mb-3">Industry Solutions</h4>
            <ul className="space-y-2 text-sm">
              {industrySolutions.map((s) => (
                <li key={s.href + s.label}><Link href={s.href} className="hover:text-white transition-colors">{s.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Offices */}
          <div>
            <h4 className="text-white font-semibold mb-3">Our Locations</h4>
            <div className="space-y-4 text-sm">
              {offices.map((office) => (
                <div key={office.phoneTel}>
                  <Link href={office.href} className="font-medium text-white hover:text-blue-400">{office.name}</Link>
                  <p className="text-gray-400 mt-1">
                    <a href={office.addressUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      {office.address}
                    </a>
                  </p>
                  <p>
                    <a href={`tel:${office.phoneTel}`} className="hover:text-white">{office.phone}</a>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Social + legal */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex gap-4 text-sm">
              {socials.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">{s.label}</a>
              ))}
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/data-privacy" className="hover:text-white">Data Privacy</Link>
              <Link href="/terms-and-conditions" className="hover:text-white">Terms and Conditions</Link>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Fruition Services. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
