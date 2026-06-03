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
import { docs_v1, drive_v3, google } from "googleapis"
import { JWT } from "google-auth-library"

const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/documents",
]

let cachedClient: JWT | null = null

function getAuthClient(): JWT {
  if (cachedClient) return cachedClient
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
  cachedClient = new JWT({
    email: parsed.client_email,
    key: parsed.private_key,
    scopes: SCOPES,
  })
  return cachedClient
}

function getDocs(): docs_v1.Docs {
  return google.docs({ version: "v1", auth: getAuthClient() })
}

function getDrive(): drive_v3.Drive {
  return google.drive({ version: "v3", auth: getAuthClient() })
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

  const drive = getDrive()
  const docs = getDocs()

  // Create the file directly in the target folder. Using Drive's files.create
  // (not Docs' documents.create) so we can set `parents` in one call instead
  // of creating then moving.
  const created = await drive.files.create({
    requestBody: {
      name: title,
      mimeType: "application/vnd.google-apps.document",
      parents: [folderId],
    },
    fields: "id",
    supportsAllDrives: true,
  })
  const docId = created.data.id
  if (!docId) {
    throw new Error("Drive files.create returned no id")
  }

  if (body && body.trim()) {
    // Render the markdown to a real Docs payload: plain text plus Docs API
    // style requests (heading paragraph styles, bold/italic character runs,
    // hyperlinks). See renderMarkdownForDocs below.
    const { text, requests } = renderMarkdownForDocs(body)
    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: {
        requests: [
          { insertText: { location: { index: 1 }, text } },
          ...requests,
        ],
      },
    })
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
      await drive.permissions.create({
        fileId: docId,
        supportsAllDrives: true,
        sendNotificationEmail: false,
        requestBody: {
          type: "domain",
          domain: shareDomain,
          role: "writer",
        },
      })
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
  const drive = getDrive()
  const created = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
    supportsAllDrives: true,
  })
  const id = created.data.id
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
