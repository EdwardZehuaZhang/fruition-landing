import type { Metadata } from "next"
import { Poppins, Montserrat } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import NavigationProgress from "@/components/NavigationProgress"
import { getSiteSettings } from "@/sanity/queries"

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

export const metadata: Metadata = {
  title: "Fruition Services | monday.com Platinum Partners",
  description: "Expert monday.com implementation, consulting, and training. Fruition is your trusted monday.com Platinum Partner.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const siteSettings = await getSiteSettings()

  return (
    <html lang="en">
      <body className={`${poppins.variable} ${montserrat.variable} antialiased`}>
        <NavigationProgress />
        <Navbar siteSettings={siteSettings} />
        <main>{children}</main>
        <Footer siteSettings={siteSettings} />
      </body>
    </html>
  )
}
