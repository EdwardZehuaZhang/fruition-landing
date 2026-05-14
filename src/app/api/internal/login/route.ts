import { NextResponse } from "next/server"
import { COOKIE_OPTIONS, INTERNAL_COOKIE, checkPassword, issueToken } from "@/lib/internalAuth"

export const runtime = "nodejs"

export async function POST(req: Request) {
  let body: { password?: string; next?: string }
  try {
    body = (await req.json()) as { password?: string; next?: string }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
  const password = body.password ?? ""
  if (!password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 })
  }
  let ok = false
  try {
    ok = checkPassword(password)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server misconfigured" },
      { status: 500 },
    )
  }
  if (!ok) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 })
  }
  const next = body.next && body.next.startsWith("/") ? body.next : "/internal/onboarding"
  const res = NextResponse.json({ ok: true, redirect: next })
  res.cookies.set(INTERNAL_COOKIE, issueToken(), COOKIE_OPTIONS)
  return res
}
