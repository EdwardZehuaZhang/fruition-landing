import { getSiteSettings } from "@/sanity/queries"
import ContactSection, { type ContactOffice } from "@/components/sections/ContactSection"

const SALES_EMAIL = "contact@fruitionservices.io"

export async function generateMetadata() {
  return {
    alternates: { canonical: "/contact-us" },
    title: "Contact Us | Fruition",
    description:
      "Talk to the Fruition team. Reach sales or support by email, call us, or find the office nearest you across our six locations worldwide.",
  }
}

interface RawOffice {
  city?: string
  country?: string
  flag?: string
  label?: string
  address?: string
  addressUrl?: string
  phone?: string
  phoneTel?: string
}

export default async function ContactPage() {
  const siteSettings = await getSiteSettings()

  const offices: ContactOffice[] = ((siteSettings?.offices as RawOffice[] | undefined) ?? [])
    .filter((o) => o?.city)
    .map((o) => ({
      city: o.city!,
      country: o.country,
      flag: o.flag,
      label: o.label,
      address: o.address,
      addressUrl: o.addressUrl,
      phone: o.phone,
      phoneTel: o.phoneTel,
    }))

  const supportEmail = siteSettings?.contactEmail || "support@fruitionservices.io"
  const firstPhone = offices.find((o) => o.phone)
  const phone = siteSettings?.phone || firstPhone?.phone
  const phoneTel = firstPhone?.phoneTel

  return (
    <ContactSection
      offices={offices}
      salesEmail={SALES_EMAIL}
      supportEmail={supportEmail}
      phone={phone}
      phoneTel={phoneTel}
    />
  )
}
