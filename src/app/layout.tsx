import type { Metadata } from "next"
import { Poppins, Montserrat } from "next/font/google"
import { headers } from "next/headers"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import NavigationProgress from "@/components/NavigationProgress"
import { getSiteSettings } from "@/sanity/queries"

// EU/EEA + UK country codes. RB2B identifies US visitors only, so blocking
// here costs zero data and avoids GDPR exposure.
const EU_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", "IS", "LI", "NO", "GB",
])

const REB2B_LOADER = `!function(key){if(window.reb2b)return;window.reb2b={loaded:true};var s=document.createElement("script");s.async=true;s.src="https://ddwl4m2hdecbv.cloudfront.net/b/"+key+"/"+key+".js.gz";document.getElementsByTagName("script")[0].parentNode.insertBefore(s,document.getElementsByTagName("script")[0]);}("9NMMZHR9W0NW");`

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

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings()
  return {
    title: s?.defaultSeoTitle,
    description: s?.defaultSeoDescription,
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const siteSettings = await getSiteSettings()
  const country = (await headers()).get("x-vercel-ip-country") ?? ""
  const allowRb2b = !EU_COUNTRIES.has(country.toUpperCase())

  return (
    <html lang="en">
      <head>
        {allowRb2b ? (
          <script dangerouslySetInnerHTML={{ __html: REB2B_LOADER }} />
        ) : null}
      </head>
      <body className={`${poppins.variable} ${montserrat.variable} antialiased`}>
        <NavigationProgress />
        <Navbar siteSettings={siteSettings} />
        <main>{children}</main>
        <Footer siteSettings={siteSettings} />
      </body>
    </html>
  )
}
