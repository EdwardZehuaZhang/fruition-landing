/**
 * Google Drive + Docs wrapper for the Marketa auto-docs flow.
 *
 * Authenticates with a service account whose JSON key is provided
 * base64-encoded in `GOOGLE_SERVICE_ACCOUNT_JSON_B64`. The SA must be added
 * as Editor on the Drive folder `MARKETA_DRAFTS_FOLDER_ID`.
 *
 * See docs/marketa-auto-docs-plan.md (Phase 3a). Setup steps for the env
 * vars live in docs/phase2-handoff.md.
 */
// Auth + API calls use `fetch` + Web Crypto (both native to the Cloudflare
// Workers runtime) instead of `google-auth-library`/`@googleapis/*`. Those
// libraries do their OAuth token exchange over Node's `http`, and OpenNext's
// `unenv` polyfill doesn't implement `http.validateHeaderName` on the Worker —
// so token fetch throws "[unenv] http.validateHeaderName is not implemented".
// Docs worked on Vercel (real Node) but silently failed after the CF migration
// for this exact reason. The REST calls below avoid node:http entirely.

const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/documents",
]

interface ServiceAccountKey {
  client_email: string
  private_key: string
}

function parseServiceAccountKey(): ServiceAccountKey {
  // Docs are created by the DEDICATED `marketa-auto-docs` service account, read
  // from GOOGLE_SERVICE_ACCOUNT_JSON_B64 — NOT the GA4 `analytics-reader` SA in
  // GOOGLE_SA_KEY_B64 (that one has no Drive storage quota and cannot create
  // Docs). Keep these separate: falling back to the analytics key would fail
  // with a confusing "storage quota exceeded" instead of a clear "key missing".
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64
  if (!raw) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON_B64 missing")
  }
  let parsed: { client_email?: string; private_key?: string }
  try {
    const json = Buffer.from(raw, "base64").toString("utf8")
    parsed = JSON.parse(json)
  } catch (err) {
    throw new Error(
      `GOOGLE_SERVICE_ACCOUNT_JSON_B64 is not valid base64-encoded JSON: ${
        err instanceof Error ? err.message : String(err)
      }`,
    )
  }
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON_B64 missing client_email or private_key",
    )
  }
  return { client_email: parsed.client_email, private_key: parsed.private_key }
}

function base64UrlEncode(input: string | ArrayBuffer): string {
  let bin = ""
  if (typeof input === "string") {
    bin = input
  } else {
    const bytes = new Uint8Array(input)
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  }
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function pemToPkcs8(pem: string): ArrayBuffer {
  const body = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "")
  const bin = atob(body)
  const buf = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i)
  return buf.buffer
}

let cachedToken: { token: string; exp: number } | null = null

/**
 * Mint (and cache) a Google OAuth access token for the service account using
 * the JWT-bearer grant — signed with Web Crypto (RS256), exchanged over fetch.
 */
async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  if (cachedToken && cachedToken.exp - 60 > now) return cachedToken.token

  const { client_email, private_key } = parseServiceAccountKey()
  const header = { alg: "RS256", typ: "JWT" }
  const claim = {
    iss: client_email,
    scope: SCOPES.join(" "),
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }
  const unsigned = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(
    JSON.stringify(claim),
  )}`
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToPkcs8(private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsigned),
  )
  const assertion = `${unsigned}.${base64UrlEncode(sig)}`

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }).toString(),
  })
  if (!res.ok) {
    throw new Error(`Google token exchange failed (${res.status}): ${await res.text()}`)
  }
  const json = (await res.json()) as { access_token?: string; expires_in?: number }
  if (!json.access_token) throw new Error("Google token exchange returned no access_token")
  cachedToken = { token: json.access_token, exp: now + (json.expires_in ?? 3600) }
  return cachedToken.token
}

/** Authenticated JSON fetch against a Google REST endpoint. */
async function googleFetch(
  url: string,
  init: { method: string; body?: unknown },
): Promise<Record<string, unknown>> {
  const token = await getAccessToken()
  const res = await fetch(url, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`Google API ${init.method} ${url} failed (${res.status}): ${text.slice(0, 400)}`)
  }
  return text ? (JSON.parse(text) as Record<string, unknown>) : {}
}

export interface CreatedDoc {
  docId: string
  docUrl: string
}

export interface CreateDocInput {
  folderId: string
  title: string
  body: string
}

/**
 * Create a new Google Doc with the given title and body, parented in the
 * given Drive folder. Returns the doc id and a public-style edit URL.
 *
 * The body is inserted as a single batchUpdate. Newlines are preserved.
 * Markdown is NOT rendered — the doc is plain text with the markdown
 * source intact so a human reviewer can convert/format as needed.
 */
export async function createDraftDoc({
  folderId,
  title,
  body,
}: CreateDocInput): Promise<CreatedDoc> {
  if (!folderId) throw new Error("createDraftDoc: folderId required")
  if (!title) throw new Error("createDraftDoc: title required")

  // Create the file directly in the target folder. Using Drive's files.create
  // (not Docs' documents.create) so we can set `parents` in one call instead
  // of creating then moving.
  const created = await googleFetch(
    "https://www.googleapis.com/drive/v3/files?fields=id&supportsAllDrives=true",
    {
      method: "POST",
      body: {
        name: title,
        mimeType: "application/vnd.google-apps.document",
        parents: [folderId],
      },
    },
  )
  const docId = created.id as string | undefined
  if (!docId) {
    throw new Error("Drive files.create returned no id")
  }

  if (body && body.trim()) {
    // Render the markdown to a real Docs payload: plain text plus Docs API
    // style requests (heading paragraph styles, bold/italic character runs,
    // hyperlinks). See renderMarkdownForDocs below.
    const { text, requests } = renderMarkdownForDocs(body)
    await googleFetch(
      `https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`,
      {
        method: "POST",
        body: {
          requests: [
            { insertText: { location: { index: 1 }, text } },
            ...requests,
          ],
        },
      },
    )
  }

  // Share with the Fruition workspace domain so anyone signed in to
  // fruitionservices.io with the link can edit. Override the default via
  // MARKETA_DOC_SHARE_DOMAIN if Fruition's primary domain ever changes.
  // Defensive: any error here gets logged but doesn't fail the doc creation,
  // because the doc itself is already usable from the Shared Drive.
  const shareDomain =
    process.env.MARKETA_DOC_SHARE_DOMAIN ?? "fruitionservices.io"
  if (shareDomain) {
    try {
      await googleFetch(
        `https://www.googleapis.com/drive/v3/files/${docId}/permissions?supportsAllDrives=true&sendNotificationEmail=false`,
        {
          method: "POST",
          body: { type: "domain", domain: shareDomain, role: "writer" },
        },
      )
    } catch (err) {
      console.warn(
        `[googleDocs] domain share for ${docId} → ${shareDomain} failed:`,
        err instanceof Error ? err.message : String(err),
      )
    }
  }

  return {
    docId,
    docUrl: `https://docs.google.com/document/d/${docId}/edit`,
  }
}

/**
 * Create a subfolder inside the given parent folder. Returns the new folder id.
 * Used to group each blog request's docs under a dated subfolder so the
 * top-level "Marketa - Auto Drafts" folder stays scannable.
 */
export async function createSubfolder(
  parentId: string,
  name: string,
): Promise<string> {
  if (!parentId) throw new Error("createSubfolder: parentId required")
  if (!name) throw new Error("createSubfolder: name required")
  const created = await googleFetch(
    "https://www.googleapis.com/drive/v3/files?fields=id&supportsAllDrives=true",
    {
      method: "POST",
      body: {
        name,
        mimeType: "application/vnd.google-apps.folder",
        parents: [parentId],
      },
    },
  )
  const id = created.id as string | undefined
  if (!id) throw new Error("Drive files.create (folder) returned no id")
  return id
}

/** Cheap word counter for body text. Splits on whitespace, drops empties. */
export function wordCount(text: string): number {
  if (!text) return 0
  return text.trim().split(/\s+/).filter(Boolean).length
}

// ---------------------------------------------------------------------------
// Markdown → Google Docs renderer
//
// Goal: turn a markdown blog draft into actual Google Docs formatting (real
// heading paragraph styles, real bold runs, real hyperlinks) rather than the
// previous behaviour of inserting raw markdown source as plain text.
//
// Scope of this v1:
//   - # / ## / ### → HEADING_1 / HEADING_2 / HEADING_3 paragraph styles
//   - **bold** → bold character run
//   - *italic* → italic character run (single-asterisk only, avoids the bold
//     overlap by skipping ** sequences)
//   - [text](url) → hyperlinked text
//   - Bullets that start with "- " or "* " → marked with a leading bullet
//     character and indent (cheap version — real Docs lists need
//     createParagraphBullets which is more involved)
//   - Markdown tables (lines starting with `|`) and `---` horizontal rules
//     are left as plain text. A v2 could convert tables to real Docs tables.
// ---------------------------------------------------------------------------

interface DocsRequest {
  // We intentionally keep this loose — the googleapis types for batchUpdate
  // requests are a giant discriminated union and the only consumer here is
  // batchUpdate itself, which validates server-side.
  [key: string]: unknown
}

interface InlineSegment {
  text: string
  bold?: boolean
  italic?: boolean
  link?: string
}

const HEADING_PREFIXES: Array<{ prefix: string; style: string }> = [
  { prefix: "### ", style: "HEADING_3" },
  { prefix: "## ", style: "HEADING_2" },
  { prefix: "# ", style: "HEADING_1" },
]

function parseInline(line: string): InlineSegment[] {
  const segs: InlineSegment[] = []
  let i = 0
  let buf = ""
  const flushBuf = () => {
    if (buf) {
      segs.push({ text: buf })
      buf = ""
    }
  }

  while (i < line.length) {
    // **bold**
    if (line[i] === "*" && line[i + 1] === "*") {
      const close = line.indexOf("**", i + 2)
      if (close > i + 2) {
        flushBuf()
        const inner = line.slice(i + 2, close)
        // Recurse so a link inside bold still works.
        const innerSegs = parseInline(inner)
        for (const s of innerSegs) {
          segs.push({ ...s, bold: true })
        }
        i = close + 2
        continue
      }
    }

    // *italic* — single asterisk, must not be the start of **
    if (line[i] === "*" && line[i + 1] !== "*" && line[i - 1] !== "*") {
      const close = line.indexOf("*", i + 1)
      // Make sure the close isn't actually the start of a ** pair we should ignore
      if (close > i + 1 && line[close + 1] !== "*") {
        flushBuf()
        const inner = line.slice(i + 1, close)
        const innerSegs = parseInline(inner)
        for (const s of innerSegs) {
          segs.push({ ...s, italic: true })
        }
        i = close + 1
        continue
      }
    }

    // [text](url)
    if (line[i] === "[") {
      const closeBracket = line.indexOf("]", i + 1)
      if (closeBracket > i + 1 && line[closeBracket + 1] === "(") {
        const closeParen = line.indexOf(")", closeBracket + 2)
        if (closeParen > closeBracket + 2) {
          flushBuf()
          const text = line.slice(i + 1, closeBracket)
          const url = line.slice(closeBracket + 2, closeParen).trim()
          segs.push({ text, link: url })
          i = closeParen + 1
          continue
        }
      }
    }

    buf += line[i]
    i++
  }
  flushBuf()
  return segs
}

interface RenderedLine {
  // The text that will appear on the line (no trailing \n).
  displayText: string
  // Character-range style requests, indices relative to start of displayText.
  charRanges: Array<{ start: number; end: number; bold?: boolean; italic?: boolean; link?: string }>
  // Paragraph-level Docs named style (e.g. HEADING_1) or null for normal text.
  paragraphStyle: string | null
}

function renderLine(rawLine: string): RenderedLine {
  let line = rawLine
  let paragraphStyle: string | null = null

  // Heading prefix.
  for (const { prefix, style } of HEADING_PREFIXES) {
    if (line.startsWith(prefix)) {
      line = line.slice(prefix.length)
      paragraphStyle = style
      break
    }
  }

  // Cheap bullet handling: strip "- " or "* " prefix and prepend a bullet glyph
  // so reviewers can see the list shape. Real Docs list bullets require
  // createParagraphBullets which is a v2 enhancement.
  let bulletPrefix = ""
  const bulletMatch = line.match(/^(\s*)([-*])\s+(.*)$/)
  if (bulletMatch && !paragraphStyle) {
    const indent = bulletMatch[1] || ""
    bulletPrefix = `${indent}• `
    line = bulletMatch[3]
  }

  const segs = parseInline(line)
  let displayText = bulletPrefix
  const charRanges: RenderedLine["charRanges"] = []
  for (const seg of segs) {
    const start = displayText.length
    displayText += seg.text
    const end = displayText.length
    if (seg.bold || seg.italic || seg.link) {
      charRanges.push({
        start,
        end,
        bold: seg.bold,
        italic: seg.italic,
        link: seg.link,
      })
    }
  }
  return { displayText, charRanges, paragraphStyle }
}

export interface RenderResult {
  text: string
  requests: DocsRequest[]
}

/**
 * Convert a markdown body into a Google Docs batchUpdate payload.
 *
 * Returns the plain text to insert (no markdown syntax characters left) and
 * a list of Docs API style requests with absolute index ranges that assume
 * the text is inserted at index 1.
 */
export function renderMarkdownForDocs(markdown: string): RenderResult {
  const lines = markdown.split("\n")
  const requests: DocsRequest[] = []
  let cursor = 1 // Google Docs body starts inserting at index 1
  const pieces: string[] = []

  for (const raw of lines) {
    const { displayText, charRanges, paragraphStyle } = renderLine(raw)
    const lineStart = cursor
    const lineWithNewline = `${displayText}\n`
    pieces.push(lineWithNewline)

    for (const range of charRanges) {
      const absStart = lineStart + range.start
      const absEnd = lineStart + range.end
      if (range.bold || range.italic) {
        const style: Record<string, unknown> = {}
        const fields: string[] = []
        if (range.bold) {
          style.bold = true
          fields.push("bold")
        }
        if (range.italic) {
          style.italic = true
          fields.push("italic")
        }
        requests.push({
          updateTextStyle: {
            range: { startIndex: absStart, endIndex: absEnd },
            textStyle: style,
            fields: fields.join(","),
          },
        })
      }
      if (range.link) {
        requests.push({
          updateTextStyle: {
            range: { startIndex: absStart, endIndex: absEnd },
            textStyle: { link: { url: range.link }, foregroundColor: { color: { rgbColor: { red: 0.07, green: 0.33, blue: 0.8 } } }, underline: true },
            fields: "link,foregroundColor,underline",
          },
        })
      }
    }

    if (paragraphStyle) {
      // updateParagraphStyle range must cover the whole paragraph including
      // its trailing newline.
      requests.push({
        updateParagraphStyle: {
          range: { startIndex: lineStart, endIndex: lineStart + lineWithNewline.length },
          paragraphStyle: { namedStyleType: paragraphStyle },
          fields: "namedStyleType",
        },
      })
    }

    cursor += lineWithNewline.length
  }

  return {
    text: pieces.join(""),
    requests,
  }
}
