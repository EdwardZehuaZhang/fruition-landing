import { NextResponse } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"
import { getPortalClient, isAllowedEmail, ensureAuthorProfile } from "@/lib/portalAuth"

export const runtime = "nodejs"

/**
 * Email magic-link landing endpoint (token-hash flow). The Supabase email
 * template links here with `token_hash` + `type`; we verify the OTP to mint a
 * session, re-assert the @fruitionservices.io domain lock, then redirect into
 * the portal. Unlike the OAuth code-exchange callback, this needs no PKCE
 * verifier cookie, so the link also works when opened on another device.
 */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const origin = url.origin
  const tokenHash = url.searchParams.get("token_hash")
  const type = url.searchParams.get("type") as EmailOtpType | null
  const nextParam = url.searchParams.get("next")
  const next = nextParam && nextParam.startsWith("/") ? nextParam : "/internal"

  const fail = (msg: string) =>
    NextResponse.redirect(
      new URL(`/internal/login?error=${encodeURIComponent(msg)}`, origin),
    )

  if (!tokenHash || !type) {
    return fail("Invalid or expired sign-in link")
  }

  const supabase = await getPortalClient()
  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
  if (error) {
    return fail(error.message)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!isAllowedEmail(user?.email)) {
    await supabase.auth.signOut()
    return fail("Use your @fruitionservices.io account")
  }

  try {
    if (user) await ensureAuthorProfile(user)
  } catch {
    // Non-fatal — the author row is also ensured lazily elsewhere.
  }

  return NextResponse.redirect(new URL(next, origin))
}
