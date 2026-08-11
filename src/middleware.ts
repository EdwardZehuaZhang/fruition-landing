import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// The Cloudflare Worker serves both fruitionservices.io and
// www.fruitionservices.io (see routes in wrangler.jsonc), so without this
// redirect every page is live on two hosts. Google then has to pick a
// canonical host itself and drops the duplicates from the index
// ("Duplicate without user-selected canonical" in Search Console).
//
// This stays a middleware.ts (deprecated in Next 16 in favour of proxy.ts)
// on purpose: proxy.ts always compiles to the Node.js runtime, which
// @opennextjs/cloudflare rejects — only edge middleware is supported.
const CANONICAL_HOST = "www.fruitionservices.io"

export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase()
  if (host === "fruitionservices.io") {
    const url = request.nextUrl.clone()
    url.protocol = "https"
    url.host = CANONICAL_HOST
    url.port = ""
    return NextResponse.redirect(url, 301)
  }
  // Forward x-pathname so server components (e.g. FaqHeadJsonLd) can
  // determine the current route without a client-side bootstrap.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", request.nextUrl.pathname)
  return NextResponse.next({ request: { headers: requestHeaders } })
}
