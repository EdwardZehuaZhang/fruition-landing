import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fruition Internal",
  robots: { index: false, follow: false },
}

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-16"
      style={{
        background:
          "radial-gradient(ellipse at top, rgba(128, 21, 232, 0.18) 0%, rgba(255, 255, 255, 0) 55%), linear-gradient(180deg, var(--surface-subtle) 0%, var(--surface) 100%)",
      }}
    >
      {children}
    </div>
  )
}
