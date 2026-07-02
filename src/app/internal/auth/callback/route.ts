import { NextResponse } from "next/server"
import { getPortalClient, isAllowedEmail, ensureAuthorProfile } from "@/lib/portalAuth"

export const runtime = "nodejs"

/**
 * OAuth redirect target. Exchanges the code for a session (sets cookies), then
 * enforces the @fruitionservices.io domain lock server-side. A non-workspace
 * account is signed out immediately and bounced to the login page.
 */
export async function GET(req: Request) {
  const requestUrl = new URL(req.url)
  const origin = requestUrl.origin
  const code = requestUrl.searchParams.get("code")
  const nextParam = requestUrl.searchParams.get("next")
  const next = nextParam && nextParam.startsWith("/") ? nextParam : "/internal"

  if (!code) {
    return NextResponse.redirect(new URL("/internal/login?error=Missing+auth+code", origin))
  }

  const supabase = await getPortalClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(
      new URL(`/internal/login?error=${encodeURIComponent(error.message)}`, origin),
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!isAllowedEmail(user?.email)) {
    // Reject anyone outside the Workspace domain and clear the session.
    await supabase.auth.signOut()
    return NextResponse.redirect(
      new URL("/internal/login?error=Use+your+%40fruitionservices.io+account", origin),
    )
  }

  try {
    if (user) await ensureAuthorProfile(user)
  } catch {
    // Non-fatal — the author row is also ensured lazily elsewhere.
  }

  return NextResponse.redirect(new URL(next, origin))
}
