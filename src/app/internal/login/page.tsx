import { Lock } from "lucide-react"
import LoginForm from "./LoginForm"

interface SearchParams {
  next?: string
  error?: string
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const next = sp.next && sp.next.startsWith("/") ? sp.next : "/internal/onboarding"
  return (
    <div className="w-full max-w-md">
      <div
        className="rounded-card bg-surface-raised p-8 sm:p-10 dark:border dark:border-ui dark:shadow-none"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="mb-6 text-center">
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-pill"
            style={{ backgroundColor: "rgba(128, 21, 232, 0.10)" }}
          >
            <Lock size={24} aria-hidden />
          </div>
          <h1 className="text-2xl font-semibold text-body">Fruition Internal</h1>
          <p className="mt-2 text-sm text-muted">
            Enter the shared password to continue.
          </p>
        </div>
        <LoginForm next={next} initialError={sp.error} />
      </div>
      <p className="mt-4 text-center text-xs text-muted">
        Don’t have the password? Ask your team lead on Slack.
      </p>
    </div>
  )
}
