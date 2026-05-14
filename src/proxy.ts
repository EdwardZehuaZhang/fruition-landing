import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { INTERNAL_COOKIE, verifyToken } from "@/lib/internalAuth"

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  if (pathname === "/internal/login" || pathname === "/api/internal/login") {
    return NextResponse.next()
  }
  const token = req.cookies.get(INTERNAL_COOKIE)?.value
  if (verifyToken(token)) return NextResponse.next()
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  const url = req.nextUrl.clone()
  url.pathname = "/internal/login"
  url.search = `?next=${encodeURIComponent(pathname + search)}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/internal/:path*", "/api/internal/:path*"],
}
