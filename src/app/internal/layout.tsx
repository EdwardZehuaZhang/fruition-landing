import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fruition Internal",
  robots: { index: false, follow: false },
}

// Passthrough: authed pages render the sidebar shell (PortalShell); the login
// page renders its own gradient screen. The external site nav/footer are hidden
// on /internal by <SiteFrame> in the root layout.
export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
