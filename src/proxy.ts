import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// The Cloudflare Worker serves both fruitionservices.io and
// www.fruitionservices.io (see routes in wrangler.jsonc), so without this
// redirect every page is live on two hosts. Google then has to pick a
// canonical host itself and drops the duplicates from the index
// ("Duplicate without user-selected canonical" in Search Console).
const CANONICAL_HOST = "www.fruitionservices.io"

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase()
  if (host === "fruitionservices.io") {
    const url = request.nextUrl.clone()
    url.protocol = "https"
    url.host = CANONICAL_HOST
    url.port = ""
    return NextResponse.redirect(url, 301)
  }
  return NextResponse.next()
}
