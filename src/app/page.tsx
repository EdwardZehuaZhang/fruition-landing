import type { Metadata } from 'next'
import { getHomePage, getHomeSectionData } from '@/features/content/loaders'
import { buildOgMetadata } from '@/lib/metadata'
import HeroNetwork from '@/components/home/HeroNetwork'
import ServicesGrid from '@/components/home/ServicesGrid'
import ByTheNumbers from '@/components/home/ByTheNumbers'
import ClientsGrid, { type ClientLogo } from '@/components/home/ClientsGrid'
import MethodTimeline from '@/components/home/MethodTimeline'
import WhereWeWork, { type Office } from '@/components/home/WhereWeWork'
import TestimonialsRoll, { type HomeTestimonial } from '@/components/home/TestimonialsRoll'
import IndustriesHub from '@/components/home/IndustriesHub'
import PlatformsCertified from '@/components/home/PlatformsCertified'
import AiCapability from '@/components/home/AiCapability'
import InsightsGrid, { type HomePost } from '@/components/home/InsightsGrid'
import FaqSplit from '@/components/home/FaqSplit'
import BookingCta from '@/components/home/BookingCta'

const FALLBACK_EMAIL = 'contact@fruitionservices.io'

interface HomeData {
  settings?: {
    contactEmail?: string
    phone?: string
    calendlyLink?: string
    offices?: Office[]
    carouselLogos?: ClientLogo[]
  }
  testimonials?: HomeTestimonial[]
  posts?: HomePost[]
}

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getHomePage()
  const title = homePage?.seoTitle ?? "Fruition | monday.com Platinum Partners | monday CRM Experts"
  const description = homePage?.seoDescription ?? "monday.com Partner certified — Fruition is an expert in Monday implementation and integration."
  return {
    alternates: { canonical: '/' },
    title,
    description,
    ...buildOgMetadata({
      title,
      description,
      path: "/",
    }),
  }
}

export default async function Home() {
  const data: HomeData = (await getHomeSectionData()) ?? {}
  const settings = data.settings ?? {}

  const contactEmail = settings.contactEmail || FALLBACK_EMAIL
  // Last-resort link inside BookingSection if the availability API is down —
  // the section itself is the booking destination, so on-page CTAs scroll to it.
  const calendlyUrl = settings.calendlyLink || ''
  const bookingHref = '#book'

  const offices = settings.offices ?? []
  const hq = offices.find((office) => /head office/i.test(office.label ?? '')) ?? offices[0]

  return (
    <>
      <HeroNetwork bookingHref={bookingHref} />
      <ServicesGrid />
      <ByTheNumbers />
      <ClientsGrid logos={settings.carouselLogos ?? []} />
      <MethodTimeline />
      <WhereWeWork offices={offices} />
      <TestimonialsRoll testimonials={data.testimonials ?? []} bookingHref={bookingHref} />
      <IndustriesHub />
      <PlatformsCertified />
      <AiCapability bookingHref={bookingHref} />
      <InsightsGrid posts={data.posts ?? []} />
      <FaqSplit contactEmail={contactEmail} />
      {/* Books through Calendly's own widget for now — see BookingCta. */}
      {calendlyUrl && (
        <BookingCta
          calendlyUrl={calendlyUrl}
          contactEmail={contactEmail}
          phone={hq?.phone}
          phoneTel={hq?.phoneTel}
          phoneLabel={(hq?.city ?? '').split(',')[0].trim() || undefined}
        />
      )}
    </>
  )
}
