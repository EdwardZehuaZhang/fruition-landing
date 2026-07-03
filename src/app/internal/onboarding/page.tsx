import { requirePortalUser } from "@/lib/portalAuth"
import OnboardingForm from "./OnboardingForm"

export const REGION_OPTIONS = [
  { value: "APAC", label: "APAC 🌏" },
  { value: "IN", label: "India 🇮🇳" },
  { value: "UK", label: "United Kingdom 🇬🇧" },
  { value: "US", label: "United States 🇺🇸" },
] as const

export default async function OnboardingPage() {
  // Auth gate — Supabase/Google session (no middleware; OpenNext can't deploy it).
  await requirePortalUser({ next: "/internal/onboarding" })
  return (
    <div className="w-full max-w-2xl">
      <div
        className="rounded-card bg-white p-8 sm:p-10"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--purple-primary)]">
            Welcome to Fruition
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#10003a]">
            Add yourself to the team
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Fill this in once. You’ll appear on{" "}
            <span className="font-medium text-[#10003a]">fruitionservices.com/fruition-team</span>{" "}
            and the regional partner pages within a minute, and a new pulse will be created on the
            internal monday.com board.
          </p>
        </header>
        <OnboardingForm regionOptions={[...REGION_OPTIONS]} />
      </div>
    </div>
  )
}
