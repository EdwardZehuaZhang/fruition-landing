import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { Poppins, Montserrat } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import NavigationProgress from "@/components/NavigationProgress"
import CookieNotice from "@/components/CookieNotice"
import SiteFrame from "@/components/SiteFrame"
import { ThemeProvider } from "@/components/ThemeProvider"
import { getSiteSettings } from "@/sanity/queries"
import { urlFor } from "@/sanity/image"



// RB2B loader. Disclosure of B2B visitor identification lives in
// /data-privacy and /terms-and-conditions. RB2B handles region-level
// suppression server-side per the account's compliance settings.
//
// Opt-out gate: visitors who clicked "Decline" in <CookieNotice /> get a
// "declined" value under this localStorage key, which suppresses the loader on
// every later visit. Keep the key in sync with src/components/CookieNotice.tsx.
const REB2B_LOADER = `(function(){try{if(window.localStorage.getItem("fruition-visitor-consent")==="declined")return;}catch(e){}!function(key){if(window.reb2b)return;window.reb2b={loaded:true};var s=document.createElement("script");s.async=true;s.src="https://ddwl4m2hdecbv.cloudfront.net/b/"+key+"/"+key+".js.gz";document.getElementsByTagName("script")[0].parentNode.insertBefore(s,document.getElementsByTagName("script")[0]);}("9NMMZHR9W0NW");})();`

// Google Tag Manager. Loaded via next/script so it injects after hydration
// while still firing as early as possible. Container ID: GTM-PF6XWTL6.
const GTM_ID = "GTM-PF6XWTL6"
const GTM_LOADER = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
})

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

// Light-only: declaring a single scheme also stops browsers (notably mobile
// Chrome/Android) from auto-inverting the page.
export const viewport: Viewport = {
  colorScheme: "light",
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings()
  const ogTitle =
    "Fruition | monday.com Platinum Partners | monday CRM Experts"
  const ogDescription =
    "monday.com Partner certified - Fruition is an expert in Monday implementation and integration. Our monday.com consultants partners with you to integrate and automate Sales, Projects & Operations"
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fruitionservices.io",
    ),
    title: s?.defaultSeoTitle,
    description: s?.defaultSeoDescription,
    openGraph: {
      type: "website",
      siteName: "Fruition",
      locale: "en_US",
      title: ogTitle,
      description: ogDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: {
      google: [
        "h7rPggK-qoBgzjiEXeiHKaKsYbQI2LjippLHnlizyp8",
        "SNyBhKEoT5fNsGG4BxYuy2XLiTubLFfvDvVbZwwpb8c",
        "jyOeWAMmPK3KH3Fwf4vm55PLSK-wBwKarqv_BG5xHbk",
      ],
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const siteSettings = await getSiteSettings()

  const BASE =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fruitionservices.io"
  const socials = Array.isArray(siteSettings?.socialLinks)
    ? (siteSettings.socialLinks as Array<{ href?: string }>)
        .map((l) => l?.href)
        .filter((h): h is string => Boolean(h))
    : []
  let logoUrl = `${BASE}/og-image.png`
  try {
    if (siteSettings?.logo) logoUrl = urlFor(siteSettings.logo).width(512).url()
  } catch {
    logoUrl = `${BASE}/og-image.png`
  }
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BASE}/#organization`,
        name: "Fruition",
        url: BASE,
        logo: logoUrl,
        description:
          "monday.com Partner certified. Fruition is an expert in monday.com implementation, integration and automation.",
        ...(socials.length ? { sameAs: socials } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${BASE}/#website`,
        name: "Fruition",
        url: BASE,
        publisher: { "@id": `${BASE}/#organization` },
      },
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Script
          id="gtm-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: GTM_LOADER }}
        />
        <script dangerouslySetInnerHTML={{ __html: REB2B_LOADER }} />
      </head>
      <body className={`${poppins.variable} ${montserrat.variable} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <NavigationProgress />
          <SiteFrame
            header={<Navbar key="site-header" siteSettings={siteSettings} />}
            footer={<Footer key="site-footer" siteSettings={siteSettings} />}
            cookie={<CookieNotice key="site-cookie" />}
          >
            {children}
          </SiteFrame>
        </ThemeProvider>
      </body>
    </html>
  )
}
