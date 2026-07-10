import { NextResponse } from "next/server"
import { getPortalApiUser } from "@/lib/portalAuth"
import {
  DESIGN_DOC_MODEL,
  FRUITION_DOC_SYSTEM_PROMPT,
  FRUITION_LOGO_TOKEN,
  designDocUserInstruction,
} from "@/lib/design/fruitionDocPrompt"
import { FRUITION_LOGO_WHITE_DATA_URI } from "@/lib/design/fruitionLogo"

export const runtime = "nodejs"
// Streaming keeps this I/O-bound (waiting on OpenRouter), so a long generation
// does not burn Worker CPU against the 60s ceiling.
export const maxDuration = 60

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
const MAX_PDF_BYTES = 10 * 1024 * 1024
const MAX_OUTPUT_TOKENS = 64000

/**
 * Restyle an uploaded PDF into a Fruition-branded HTML document.
 *
 * Routes through OpenRouter (same as src/lib/claudeClient.ts) so billing rolls
 * up under one account and the model is swappable. OpenRouter parses the PDF
 * with its native (Claude) engine. Streams the raw HTML back as plain text; the
 * client accumulates it and saves via POST /api/internal/design/docs.
 */
export async function POST(req: Request) {
  const user = await getPortalApiUser()
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY is not configured." }, { status: 500 })
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 })
  }

  const file = form.get("file")
  const title = (form.get("title") as string | null)?.trim() || undefined
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing PDF file." }, { status: 400 })
  }
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 })
  }
  if (file.size > MAX_PDF_BYTES) {
    return NextResponse.json({ error: "PDF is too large (max 10 MB)." }, { status: 400 })
  }

  const pdfBase64 = Buffer.from(await file.arrayBuffer()).toString("base64")

  const upstream = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://fruitionservices.io",
      "X-Title": "Fruition Design",
    },
    body: JSON.stringify({
      model: DESIGN_DOC_MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      stream: true,
      // Use Claude's native PDF understanding rather than an OCR pre-pass.
      plugins: [{ id: "file-parser", pdf: { engine: "native" } }],
      messages: [
        { role: "system", content: FRUITION_DOC_SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: designDocUserInstruction(title) },
            {
              type: "file",
              file: {
                filename: file.name || "document.pdf",
                file_data: `data:application/pdf;base64,${pdfBase64}`,
              },
            },
          ],
        },
      ],
    }),
  })

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "")
    let message = `Generation failed (${upstream.status}).`
    try {
      message = (JSON.parse(detail) as { error?: { message?: string } }).error?.message || message
    } catch {
      /* non-JSON error body */
    }
    return NextResponse.json({ error: message }, { status: 502 })
  }

  // Transform OpenRouter's SSE stream into a plain-text stream of HTML deltas,
  // substituting the logo placeholder for the real data URI as it flows.
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const reader = upstream.body.getReader()
  let buffer = ""
  // Holdback for the streaming logo substitution: any suffix of what we've seen
  // that could be the start of the placeholder is kept until the next chunk.
  let carry = ""
  const KEEP = FRUITION_LOGO_TOKEN.length - 1

  /** Emit `carry + text` with complete tokens replaced, retaining a safe tail. */
  function substitute(text: string, flush: boolean): string {
    carry = (carry + text).replaceAll(FRUITION_LOGO_TOKEN, FRUITION_LOGO_WHITE_DATA_URI)
    if (flush) {
      const out = carry
      carry = ""
      return out
    }
    // Keep the longest suffix that is a prefix of the token (a token may straddle
    // the chunk boundary); emit everything before it.
    let hold = 0
    for (let k = Math.min(KEEP, carry.length); k > 0; k--) {
      if (FRUITION_LOGO_TOKEN.startsWith(carry.slice(carry.length - k))) {
        hold = k
        break
      }
    }
    const out = carry.slice(0, carry.length - hold)
    carry = carry.slice(carry.length - hold)
    return out
  }

  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read()
      if (done) {
        const tail = substitute("", true)
        if (tail) controller.enqueue(encoder.encode(tail))
        controller.close()
        return
      }
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() ?? ""
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith("data:")) continue // skip SSE comments / keep-alives
        const data = trimmed.slice(5).trim()
        if (data === "[DONE]") continue
        try {
          const parsed = JSON.parse(data) as {
            choices?: { delta?: { content?: string } }[]
          }
          const delta = parsed.choices?.[0]?.delta?.content
          if (delta) {
            const out = substitute(delta, false)
            if (out) controller.enqueue(encoder.encode(out))
          }
        } catch {
          /* partial/non-JSON SSE frame — ignore */
        }
      }
    },
    cancel() {
      reader.cancel()
    },
  })

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  })
}
