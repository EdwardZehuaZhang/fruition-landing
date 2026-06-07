import type { Metadata } from "next"
import { Poppins, Montserrat } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import NavigationProgress from "@/components/NavigationProgress"
import CookieNotice from "@/components/CookieNotice"
import { getSiteSettings } from "@/sanity/queries"

// RB2B loader. Disclosure of B2B visitor identification lives in
// /data-privacy and /terms-and-conditions. RB2B handles region-level
// suppression server-side per the account's compliance settings.
//
// Opt-out gate: visitors who clicked "Decline" in <CookieNotice /> get a
// "declined" value under this localStorage key, which suppresses the loader on
// every later visit. Keep the key in sync with src/components/CookieNotice.tsx.
const REB2B_LOADER = `(function(){try{if(window.localStorage.getItem("fruition-visitor-consent")==="declined")return;}catch(e){}!function(key){if(window.reb2b)return;window.reb2b={loaded:true};var s=document.createElement("script");s.async=true;s.src="https://ddwl4m2hdecbv.cloudfront.net/b/"+key+"/"+key+".js.gz";document.getElementsByTagName("script")[0].parentNode.insertBefore(s,document.getElementsByTagName("script")[0]);}("9NMMZHR9W0NW");})();`

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

  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: REB2B_LOADER }} />
      </head>
      <body className={`${poppins.variable} ${montserrat.variable} antialiased`}>
        <NavigationProgress />
        <Navbar siteSettings={siteSettings} />
        <main>{children}</main>
        <Footer siteSettings={siteSettings} />
        <CookieNotice />
      </body>
    </html>
  )
}
