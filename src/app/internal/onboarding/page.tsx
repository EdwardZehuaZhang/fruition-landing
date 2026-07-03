import { requirePortalUser } from "@/lib/portalAuth"
import PortalShell from "@/components/internal/PortalShell"
import OnboardingForm from "./OnboardingForm"

export const REGION_OPTIONS = [
  { value: "APAC", label: "APAC 🌏" },
  { value: "IN", label: "India 🇮🇳" },
  { value: "UK", label: "United Kingdom 🇬🇧" },
  { value: "US", label: "United States 🇺🇸" },
] as const

export default async function OnboardingPage() {
  // Auth gate — Supabase/Google session (no middleware; OpenNext can't deploy it).
  const user = await requirePortalUser({ next: "/internal/onboarding" })
  return (
    <PortalShell email={user.email} active="team" title="Add member">
      <div className="w-full max-w-2xl">
      <div
        className="rounded-card bg-surface p-8 sm:p-10"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--purple-primary)]">
            Welcome to Fruition
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-ink-heading">
            Add yourself to the team
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Fill this in once. You’ll appear on{" "}
            <span className="font-medium text-ink-heading">fruitionservices.com/fruition-team</span>{" "}
            and the regional partner pages within a minute, and a new pulse will be created on the
            internal monday.com board.
          </p>
        </header>
        <OnboardingForm regionOptions={[...REGION_OPTIONS]} />
      </div>
      </div>
    </PortalShell>
  )
}
