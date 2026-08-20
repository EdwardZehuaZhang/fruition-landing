import { after } from "next/server"
import { registerClick, resolveShortLink } from "@/lib/social/shortLinks"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const SITE_BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.fruitionservices.io").replace(/\/+$/, "")

/**
 * The public end of fruitionservices.io/s/<code>.
 *
 * Every one of these lives in a post someone already published, so the two
 * rules are: never make a reader wait, and never leave one at a dead end.
 * The click is counted in `after()` so it runs once the redirect is already on
 * its way, and a code we can't resolve sends the reader to the homepage rather
 * than a 404 — they clicked a Fruition link in good faith and our bad record
 * shouldn't be their problem.
 *
 * Not indexable: these are duplicates of pages Google already has.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const clean = (code ?? "").replace(/[^A-Za-z0-9]/g, "").slice(0, 32)

  let target: string | null = null
  try {
    target = clean ? await resolveShortLink(clean) : null
  } catch {
    // A database blip must not turn a live marketing link into an error page.
  }

  if (target) {
    after(async () => {
      try {
        await registerClick(clean)
      } catch {
        // A missed click is a missed statistic, nothing more.
      }
    })
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: target ?? `${SITE_BASE}/`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  })
}
