/**
 * Zernio social-posting integration for the Marketa blog pipeline.
 *
 * Creates a DRAFT post (isDraft:true → status "draft", never auto-published) on
 * X/Twitter + Google Business so a human can review/edit/publish it from the
 * Zernio dashboard. Activated only when ZERNIO_API_KEY is set; every call is
 * best-effort and must never break the blog pipeline.
 *
 * API: https://docs.zernio.com — POST https://zernio.com/api/v1/posts
 */

const ZERNIO_BASE = "https://zernio.com/api/v1"

// Account IDs for the connected profiles (not secret). Overridable via env in
// case the accounts are reconnected and get new IDs.
const X_ACCOUNT_ID = process.env.ZERNIO_X_ACCOUNT_ID || "6a4f402e3ecd8aa344702cec"
const GBP_ACCOUNT_ID = process.env.ZERNIO_GBP_ACCOUNT_ID || "6a4f41573ecd8aa3447039c0"
const DASHBOARD_URL = process.env.ZERNIO_DASHBOARD_URL || "https://zernio.com/dashboard"

const X_LIMIT = 280

export interface SocialDraft {
  postId: string
  reviewUrl: string
}

/**
 * Compose the social copy: title + short description + link, trimmed to fit X's
 * 280-char limit (the tightest target platform). The human can expand it in the
 * Zernio dashboard before publishing.
 */
export function buildSocialCopy(args: { title: string; excerpt?: string; link?: string }): string {
  const url = (args.link || "https://www.fruitionservices.io").trim()
  const reserve = url.length + 1 // newline before the URL
  const desc = (args.excerpt || "").replace(/\s+/g, " ").trim()
  let text = desc ? `${args.title} — ${desc}` : args.title
  const max = X_LIMIT - reserve
  if (text.length > max) text = `${text.slice(0, Math.max(0, max - 1)).trimEnd()}…`
  return `${text}\n${url}`
}

/**
 * Create a Zernio draft post for X + Google Business. Returns null when the
 * integration isn't configured (no API key). Throws on API errors so the caller
 * can log; callers treat this as best-effort.
 */
export async function createSocialDraft(args: {
  title: string
  excerpt?: string
  link?: string
}): Promise<SocialDraft | null> {
  const apiKey = process.env.ZERNIO_API_KEY
  if (!apiKey) return null

  const platforms: { platform: string; accountId: string }[] = []
  if (X_ACCOUNT_ID) platforms.push({ platform: "twitter", accountId: X_ACCOUNT_ID })
  if (GBP_ACCOUNT_ID) platforms.push({ platform: "googlebusiness", accountId: GBP_ACCOUNT_ID })
  if (!platforms.length) return null

  const res = await fetch(`${ZERNIO_BASE}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: buildSocialCopy(args),
      isDraft: true,
      platforms,
    }),
  })
  if (!res.ok) {
    throw new Error(`Zernio create draft failed (${res.status}): ${(await res.text()).slice(0, 200)}`)
  }
  const data = (await res.json()) as { post?: { _id?: string } }
  const postId = data.post?._id
  if (!postId) throw new Error("Zernio create draft returned no post id")

  return { postId, reviewUrl: DASHBOARD_URL }
}
