import { NextResponse } from "next/server"
import { getPortalClient, allowedDomain } from "@/lib/portalAuth"

export const runtime = "nodejs"

/**
 * Kicks off Google OAuth server-side (PKCE). We generate the provider URL with
 * the Supabase client (which sets the code-verifier cookie) and redirect the
 * browser to Google. `hd` hints the Workspace domain; the hard domain check
 * happens in the callback.
 */
export async function GET(req: Request) {
  const origin = new URL(req.url).origin
  const nextParam = new URL(req.url).searchParams.get("next")
  const next = nextParam && nextParam.startsWith("/") ? nextParam : "/internal"

  const supabase = await getPortalClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/internal/auth/callback?next=${encodeURIComponent(next)}`,
      queryParams: {
        hd: allowedDomain(),
        prompt: "select_account",
      },
    },
  })

  if (error || !data?.url) {
    return NextResponse.redirect(
      new URL(`/internal/login?error=${encodeURIComponent(error?.message ?? "OAuth start failed")}`, origin),
    )
  }
  return NextResponse.redirect(data.url)
}
