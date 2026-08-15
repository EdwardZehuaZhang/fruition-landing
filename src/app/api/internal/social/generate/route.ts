import { NextResponse } from "next/server"
import { getPortalApiUser } from "@/lib/portalAuth"
import {
  captionFor,
  generateSocialCaptions,
  platformSpec,
  type PlatformKey,
} from "@/lib/social/zernio"
import { knownKeys } from "@/lib/social/composition"

export const runtime = "nodejs"
export const maxDuration = 120

/**
 * Write captions for a standalone post from a brief — one LLM call covering
 * every selected channel, clamped to each platform's limit.
 *
 * Body: { brief, title?, link?, tone?, cta?, industry?, keys[] }
 * Returns: { platforms: { [key]: { content, title? } } }
 *
 * Nothing is persisted: the composer drops the result into its editors and the
 * writer decides what to keep, so regenerating is free and never overwrites the
 * saved post until they hit save.
 */
export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "AI writing is not configured (OPENROUTER_API_KEY missing)." }, { status: 501 })
  }

  let body: {
    brief?: string
    title?: string
    link?: string
    tone?: string
    cta?: string
    industry?: string
    keys?: unknown
  }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const brief = (body.brief ?? "").trim()
  const title = (body.title ?? "").trim()
  if (!brief && !title) {
    return NextResponse.json({ error: "Say what the post is about first." }, { status: 400 })
  }

  const keys = knownKeys(body.keys)
  if (!keys.length) return NextResponse.json({ error: "Pick at least one channel." }, { status: 400 })

  try {
    const captions = await generateSocialCaptions({
      kind: "idea",
      title: title || brief.slice(0, 90),
      brief,
      blogUrl: body.link?.trim() || undefined,
      tone: body.tone?.trim() || undefined,
      cta: body.cta?.trim() || undefined,
      industry: body.industry?.trim() || undefined,
      // Two Google Business listings share one caption, so de-duplicate the ask.
      only: [...new Set(keys.map((k) => platformSpec(k).captionKey))],
    })

    const platforms: Partial<Record<PlatformKey, { content: string; title?: string }>> = {}
    for (const key of keys) platforms[key] = captionFor(platformSpec(key), captions)
    return NextResponse.json({ platforms })
  } catch (err) {
    return NextResponse.json(
      { error: `Writing failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    )
  }
}
