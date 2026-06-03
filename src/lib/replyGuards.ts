import { BOT_TOOLS } from "@/lib/botTools"

/**
 * Belt-and-suspenders defense against the bot claiming capabilities it does
 * not have or claiming write actions it cannot perform.
 *
 * Layer 1 (prompt) is in slack-blog/route.ts.
 * Layer 2 (this file) is two parts:
 *   - Deterministic short-circuit for capability questions. The most common
 *     hallucination is "I can answer questions about Fruition, look up
 *     details from monday.com or HubSpot if I have access..." in response
 *     to "what can you do". We catch those questions before the LLM sees
 *     them and reply with a canonical answer generated from BOT_TOOLS.
 *   - Post-reply banned-phrase scanner. If the LLM still slips, we detect
 *     it, run one revision pass with an explicit correction, and fall back
 *     to the canonical answer if it persists.
 *
 * Layer 3 (architecture) is the botToolExecutor whitelist: only the four
 * known tool names route to handlers. Any other tool name (including any
 * hypothetical 'delete_*') returns "Unknown tool" without executing.
 */

const CAPABILITY_QUESTION_PATTERNS: RegExp[] = [
  /\bwhat\s+(can|do)\s+(you|u)\s+do\b/i,
  /\bwhat\s+can\s+(you|u)\s+(help|do)\b/i,
  /\bwhat\s+are\s+(you|u)\s+(able|capable)\s+of\b/i,
  /\bwhat\s+are\s+your\s+capabilities\b/i,
  /\bwhat\s+tools?\s+do\s+(you|u)\s+have\b/i,
  /\bdo\s+(you|u)\s+have\s+access\s+to\b/i,
  /\bcan\s+(you|u)\s+access\b/i,
  /\bare\s+(you|u)\s+able\s+to\s+(check|look\s+up|read|access|see|find)\b/i,
  /\bwhat\s+(can|do)\s+(you|u)\s+have\s+access\s+to\b/i,
]

export function isCapabilityQuestion(userText: string): boolean {
  const trimmed = userText.trim()
  if (!trimmed) return false
  // Only match short, direct questions. Long messages mentioning capabilities
  // in passing should still flow through the LLM.
  if (trimmed.length > 200) return false
  return CAPABILITY_QUESTION_PATTERNS.some((p) => p.test(trimmed))
}

function humanizeTool(name: string): string {
  switch (name) {
    case "find_monday_items":
      return "Query a Fruition monday.com board by ID and list items with their key columns and a link."
    case "list_monday_boards":
      return "List the monday.com boards I can see (read-only) so I can pick the right board_id."
    case "read_channel_history":
      return "Read recent messages from any Slack channel I am a member of, by channel ID."
    case "search_slack":
      return process.env.SLACK_USER_TOKEN
        ? "Search Slack messages across channels (with optional channel and date filters)."
        : "Search Slack messages across channels (currently disabled - SLACK_USER_TOKEN env var not set)."
    case "fetch_url_content":
      return "Fetch a URL you give me and pull the readable text out of it."
    case "web_search":
      return "Search the live web for current information via a Perplexity search model."
    default:
      return `Call the \`${name}\` tool.`
  }
}

export function getCanonicalCapabilityAnswer(): string {
  const lines: string[] = []
  lines.push("Here is what I can actually do, no more:")
  lines.push("")
  lines.push("- Read this Slack thread and reply in it.")
  for (const t of BOT_TOOLS) {
    lines.push(`- ${humanizeTool(t.function.name)}`)
  }
  lines.push("")
  lines.push("I am read-only. I cannot delete, modify, archive, move, assign, send, or create anything in monday, Slack, HubSpot, or anywhere else. If you need a write action, you have to do it yourself.")
  lines.push("")
  lines.push("I do not have HubSpot, Gmail, Google Calendar, Asana, Notion, Linear, Jira, file uploads, image generation, or voice.")
  return lines.join("\n")
}

export const SAFE_CAPABILITY_FALLBACK = getCanonicalCapabilityAnswer()

/**
 * Phrases the bot must never produce. Two flavors:
 *   1. Hallucinated capability claims: conditional access, hypothetical
 *      future abilities, references to systems we are not connected to.
 *   2. Hallucinated write actions: claiming to have deleted, modified,
 *      sent, archived, or created something. The bot is read-only.
 */
const BANNED_PHRASE_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /\bif\s+I\s+(have|had|get|got)\s+access\b/i, reason: "conditional access claim" },
  { pattern: /\bwith\s+(the\s+right\s+|enough\s+)?permissions?\b/i, reason: "conditional permission claim" },
  { pattern: /\bI\s+would\s+be\s+able\s+to\b/i, reason: "hypothetical capability claim" },
  { pattern: /\bif\s+you\s+(give|grant)\s+me\s+access\b/i, reason: "conditional access request" },
  { pattern: /\bI\s+(can|could|will)\s+(check|access|read|update|create|find|look\s+up|search|pull|fetch)\s+(it\s+|that\s+)?(in|from|on)?\s*(HubSpot|Asana|Notion|Linear|Jira|Gmail|Google\s+Calendar|Outlook|Salesforce|Pipedrive|Intercom)\b/i, reason: "claimed access to unavailable system" },
  { pattern: /\bI\s+can\s+confirm\s+actions?\s+in\s+Slack\b/i, reason: "vague unsupported-capability claim" },
  // Hallucinated write actions
  { pattern: /\bI('?ve|\s+have)\s+(deleted|removed|archived|moved|assigned|sent|created|posted|emailed|notified|updated|modified|edited)\b/i, reason: "claimed write action; bot is read-only" },
  { pattern: /\bI('?ll|\s+will)\s+(delete|remove|archive|move|assign|send|create|post|email|notify|update|modify|edit)\s+(?!a\s+reply|my\s+reply|the\s+reply)/i, reason: "future write action; bot is read-only" },
  { pattern: /\bI\s+just\s+(deleted|removed|archived|moved|assigned|sent|created|posted|emailed|notified|updated|modified|edited)\b/i, reason: "claimed write action; bot is read-only" },
  { pattern: /\bdone,?\s+I('?ve|\s+have)\s+(deleted|removed|archived|moved|assigned|sent|created|posted)\b/i, reason: "claimed write action; bot is read-only" },
]

export interface BannedPhraseHit {
  match: string
  reason: string
}

export function detectBannedPhrases(replyText: string): BannedPhraseHit[] {
  const hits: BannedPhraseHit[] = []
  for (const { pattern, reason } of BANNED_PHRASE_PATTERNS) {
    const m = replyText.match(pattern)
    if (m) hits.push({ match: m[0], reason })
  }
  return hits
}

export function buildRevisionInstruction(hits: BannedPhraseHit[]): string {
  const items = hits
    .map((h, i) => `${i + 1}. "${h.match}" — ${h.reason}`)
    .join("\n")
  return [
    "Your previous reply contained statements you cannot truthfully make:",
    items,
    "",
    "Rewrite your reply without those claims. If the user is asking for something outside your real capabilities, refuse in one plain sentence. If you have not actually performed a write action, do not claim you did. Use only the tools you actually have.",
  ].join("\n")
}
