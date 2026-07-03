import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { INTERNAL_COOKIE, verifyToken } from "@/lib/internalAuth"
import OnboardingForm from "./OnboardingForm"

export const REGION_OPTIONS = [
  { value: "APAC", label: "APAC 🌏" },
  { value: "IN", label: "India 🇮🇳" },
  { value: "UK", label: "United Kingdom 🇬🇧" },
  { value: "US", label: "United States 🇺🇸" },
] as const

export default async function OnboardingPage() {
  // Auth gate (replaces the former proxy/middleware, which Next 16 forces onto
  // the Node.js runtime and the Cloudflare OpenNext adapter cannot deploy).
  const token = (await cookies()).get(INTERNAL_COOKIE)?.value
  if (!verifyToken(token)) {
    redirect(`/internal/login?next=${encodeURIComponent("/internal/onboarding")}`)
  }
  return (
    <div className="w-full max-w-2xl">
      <div
        className="rounded-card bg-surface-raised p-8 sm:p-10 dark:border dark:border-ui dark:shadow-none"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--purple-primary)]">
            Welcome to Fruition
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-body">
            Add yourself to the team
          </h1>
          <p className="mt-2 text-sm text-muted">
            Fill this in once. You’ll appear on{" "}
            <span className="font-medium text-body">fruitionservices.com/fruition-team</span>{" "}
            and the regional partner pages within a minute, and a new pulse will be created on the
            internal monday.com board.
          </p>
        </header>
        <OnboardingForm regionOptions={[...REGION_OPTIONS]} />
      </div>
    </div>
  )
}
