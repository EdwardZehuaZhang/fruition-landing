/**
 * Tagging other accounts from the composer.
 *
 * The two channels that can be tagged work in completely different ways, and
 * the difference decides the whole design:
 *
 *   X    — "@handle" in the body IS the mention. Nothing to resolve; the only
 *          risk is a typo tagging a stranger, so the picker offers saved
 *          handles and remembers the ones you type.
 *   LinkedIn — plain "@Name" is inert text. A real mention is markup carrying
 *          the account's URN, "@[monday.com](urn:li:organization:2525169)",
 *          which Zernio resolves for us and expands at publish time. The
 *          writer must never see or type that; the editor shows "@monday.com"
 *          and only the wire format carries the URN.
 *
 * Everything here is pure string work so `validate.ts` can measure a caption
 * the way the reader will see it, in the browser and on the server alike.
 */

/** "@[Display Name](urn:li:organization:123)" — Zernio's LinkedIn wire format. */
const LINKEDIN_MENTION = /@\[([^\]]+)\]\((urn:li:(?:person|organization):[^)]+)\)/g

export interface ParsedMention {
  displayName: string
  urn: string
  /** Character offsets of the whole "@[…](…)" run within the source string. */
  start: number
  end: number
}

export function parseMentions(text: string): ParsedMention[] {
  const out: ParsedMention[] = []
  for (const m of text.matchAll(LINKEDIN_MENTION)) {
    out.push({ displayName: m[1], urn: m[2], start: m.index, end: m.index + m[0].length })
  }
  return out
}

export function hasMentionMarkup(text: string): boolean {
  return parseMentions(text).length > 0
}

/** The caption as a reader sees it: mention markup collapsed to "@Name". */
export function renderMentions(text: string): string {
  return text.replace(LINKEDIN_MENTION, (_, name: string) => `@${name}`)
}

/**
 * How long the caption reads, not how long it is on the wire. Only these two
 * differ, and only when a LinkedIn tag is present — every other channel's
 * rendered length is its raw length.
 */
export function renderedLength(text: string): number {
  return renderMentions(text).length
}

/** Build the wire format from a resolved account. */
export function mentionMarkup(displayName: string, urn: string): string {
  return `@[${displayName}](${urn})`
}

/* ------------------------------------------------------------------ */
/*  Handles                                                            */
/* ------------------------------------------------------------------ */

/** Accept "@name", "name", or a full x.com/twitter.com URL; return "name". */
export function normaliseXHandle(input: string): string {
  const trimmed = input.trim()
  const fromUrl = trimmed.match(/^(?:https?:\/\/)?(?:www\.)?(?:x|twitter)\.com\/@?([A-Za-z0-9_]{1,15})/i)
  const raw = fromUrl ? fromUrl[1] : trimmed.replace(/^@/, "")
  return raw.replace(/[^A-Za-z0-9_]/g, "").slice(0, 15)
}

/**
 * Accept a LinkedIn company/profile URL or a bare vanity name. Zernio's
 * resolver takes either, so this only strips the noise people paste along with
 * a URL (tracking params, a trailing slash).
 */
export function normaliseLinkedInTarget(input: string): string {
  return input.trim().split(/[?#]/)[0].replace(/\/+$/, "")
}

/* ------------------------------------------------------------------ */
/*  Starting directory                                                 */
/* ------------------------------------------------------------------ */

export interface TagSuggestion {
  name: string
  /** LinkedIn company/profile URL or vanity name, resolved on pick. */
  linkedin?: string
  /** X handle without the @. */
  x?: string
}

/**
 * The accounts we tag often enough to be worth one click. Deliberately short:
 * anything else is a paste-and-resolve away, and whatever you type is
 * remembered locally, so this list doesn't need to grow to stay useful.
 *
 * LinkedIn entries are vanity names — Zernio resolves them to a URN and hands
 * back the real display name, so a wrong slug fails loudly instead of tagging
 * a stranger.
 */
export const TAG_SUGGESTIONS: TagSuggestion[] = [
  { name: "monday.com", linkedin: "mondaydotcom", x: "mondaydotcom" },
  { name: "Fruition", linkedin: "fruition-services", x: "Fruitionservic" },
  { name: "Atlassian", linkedin: "atlassian", x: "Atlassian" },
  { name: "HubSpot", linkedin: "hubspot", x: "HubSpot" },
]

/** Channels where tagging does anything at all. */
export function supportsTagging(key: string): key is "linkedin" | "twitter" {
  return key === "linkedin" || key === "twitter"
}
