import Link from "next/link"

interface Props {
  email?: string | null
  active?: "dashboard" | "new" | "profile"
  children: React.ReactNode
}

const NAV = [
  { key: "dashboard", label: "Dashboard", href: "/internal" },
  { key: "new", label: "New post", href: "/internal/blog/new" },
  { key: "profile", label: "My profile", href: "/internal/onboarding" },
] as const

export default function PortalShell({ email, active, children }: Props) {
  return (
    <div className="w-full max-w-5xl">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold text-[#10003a]">Fruition Internal</span>
          <nav className="flex items-center gap-4 text-sm">
            {NAV.map((n) => (
              <Link
                key={n.key}
                href={n.href}
                className="font-medium transition"
                style={{
                  color: active === n.key ? "var(--purple-primary)" : "var(--color-text-secondary)",
                }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {email && <span className="text-[var(--color-text-secondary)]">{email}</span>}
          <a
            href="/internal/auth/signout"
            className="rounded-pill border px-3 py-1.5 font-medium transition"
            style={{ borderColor: "var(--color-border)", color: "#10003a" }}
          >
            Sign out
          </a>
        </div>
      </header>
      {children}
    </div>
  )
}
