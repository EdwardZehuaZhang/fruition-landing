// Slack Block Kit builders for the Marketa blog pipeline. Mirrors the
// rb2b company-alert layout: header → section → context meta → actions.

const MONDAY_BOARD_ID = 5028637584

function mondayItemUrl(pulseId: string): string {
  return `https://fruitionservices.monday.com/boards/${MONDAY_BOARD_ID}/pulses/${pulseId}`
}

function portalEditUrl(pulseId: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fruitionservices.io"
  return `${base.replace(/\/+$/, "")}/internal/blog/monday/${pulseId}/edit`
}

// Every actions row leads with this portal link; the external buttons
// (Google Docs, LinkedIn, monday) follow it.
function openInPortalButton(pulseId: string, label: string): Record<string, unknown> {
  return {
    type: "button",
    style: "primary",
    text: { type: "plain_text", text: label, emoji: true },
    url: portalEditUrl(pulseId),
  }
}

function clip(text: string, max: number): string {
  const t = text.trim().replace(/\s+/g, " ")
  if (t.length <= max) return t
  return `${t.slice(0, max - 1).trimEnd()}…`
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

interface CommonArgs {
  pulseId: string
  title: string
  brief?: string
  industry?: string
  targetKeyword?: string
}

export function buildIdeaProposedBlocks(args: CommonArgs): {
  fallbackText: string
  blocks: Record<string, unknown>[]
} {
  const blocks: Record<string, unknown>[] = []
  blocks.push({
    type: "header",
    text: { type: "plain_text", text: ":bulb: New blog idea", emoji: true },
  })
  const sectionLines = [`*${args.title}*`]
  if (args.brief) sectionLines.push(clip(args.brief, 240))
  blocks.push({
    type: "section",
    text: { type: "mrkdwn", text: sectionLines.join("\n") },
  })
  const meta = metaLine({ industry: args.industry, targetKeyword: args.targetKeyword })
  if (meta) blocks.push({ type: "context", elements: [{ type: "mrkdwn", text: meta }] })
  blocks.push({
    type: "actions",
    elements: [
      openInPortalButton(args.pulseId, "Review in Portal"),
      openInMondayButton(args.pulseId, "Review in monday", false),
    ],
  })
  return { fallbackText: `:bulb: New blog idea: ${args.title}`, blocks }
}

export function buildDraftReadyBlocks(
  args: CommonArgs & { draftBody?: string },
): { fallbackText: string; blocks: Record<string, unknown>[] } {
  const blocks: Record<string, unknown>[] = []
  blocks.push({
    type: "header",
    text: { type: "plain_text", text: ":memo: Draft ready for review", emoji: true },
  })
  const sectionLines = [`*${args.title}*`]
  if (args.draftBody) sectionLines.push(clip(stripMarkdown(args.draftBody), 260))
  blocks.push({
    type: "section",
    text: { type: "mrkdwn", text: sectionLines.join("\n") },
  })
  const metaParts: string[] = []
  if (args.draftBody) metaParts.push(`:bar_chart: ~${wordCount(args.draftBody).toLocaleString()} words`)
  const baseMeta = metaLine({ industry: args.industry, targetKeyword: args.targetKeyword })
  if (baseMeta) metaParts.push(baseMeta)
  if (metaParts.length) {
    blocks.push({
      type: "context",
      elements: [{ type: "mrkdwn", text: metaParts.join("  ·  ") }],
    })
  }
  blocks.push({
    type: "actions",
    elements: [
      openInPortalButton(args.pulseId, "Review in Portal"),
      openInMondayButton(args.pulseId, "Open in monday", false),
    ],
  })
  return { fallbackText: `:memo: Draft ready: ${args.title}`, blocks }
}

/**
 * Block Kit for the initial "queued" thread reply on Slack-originated blog
 * items, posted by slack-blog right after the monday item is created. Same
 * shape as buildAutoDocsReadyBlocks so the two replies in the thread feel
 * like a matched pair: header → linked title → industry/keyword meta →
 * portal link + "Open in monday" buttons.
 */
export function buildIdeaQueuedBlocks(args: {
  pulseId: string
  title: string
  industry?: string
  targetKeyword?: string
}): { fallbackText: string; blocks: Record<string, unknown>[] } {
  const blocks: Record<string, unknown>[] = []
  blocks.push({
    type: "header",
    text: { type: "plain_text", text: ":hourglass_flowing_sand: Queued", emoji: true },
  })
  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*<${mondayItemUrl(args.pulseId)}|${args.title}>*`,
    },
  })
  const meta = metaLine({ industry: args.industry, targetKeyword: args.targetKeyword })
  if (meta) blocks.push({ type: "context", elements: [{ type: "mrkdwn", text: meta }] })
  blocks.push({
    type: "actions",
    elements: [
      openInPortalButton(args.pulseId, "Review in Portal"),
      openInMondayButton(args.pulseId, "Open in monday :clipboard:", false),
    ],
  })
  return { fallbackText: `:hourglass_flowing_sand: Queued: ${args.title}`, blocks }
}

/**
 * Block Kit for the auto-docs thread reply on Slack-originated blog items.
 * Renders as: header, section with the title link, optional industry/keyword
 * meta line, action row with four URL buttons (portal editor, blog doc,
 * LinkedIn doc, monday item). No word-count tags, no preview snippet — the
 * docs themselves are one click away.
 */
export function buildAutoDocsReadyBlocks(args: {
  pulseId: string
  title: string
  industry?: string
  targetKeyword?: string
  blogDocUrl: string
  linkedInDocUrl: string
}): { fallbackText: string; blocks: Record<string, unknown>[] } {
  const blocks: Record<string, unknown>[] = []
  blocks.push({
    type: "header",
    text: { type: "plain_text", text: ":memo: Draft ready", emoji: true },
  })
  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*<${mondayItemUrl(args.pulseId)}|${args.title}>*`,
    },
  })
  const meta = metaLine({ industry: args.industry, targetKeyword: args.targetKeyword })
  if (meta) blocks.push({ type: "context", elements: [{ type: "mrkdwn", text: meta }] })
  blocks.push({
    type: "actions",
    elements: [
      openInPortalButton(args.pulseId, "Review in Portal"),
      {
        type: "button",
        text: { type: "plain_text", text: "Open blog draft :pencil:", emoji: true },
        url: args.blogDocUrl,
      },
      {
        type: "button",
        text: { type: "plain_text", text: "Open LinkedIn post :linkedin:", emoji: true },
        url: args.linkedInDocUrl,
      },
      openInMondayButton(args.pulseId, "Open in monday :clipboard:", false),
    ],
  })
  return { fallbackText: `:memo: Draft ready: ${args.title}`, blocks }
}

export function buildPublishedBlocks(
  args: CommonArgs & { publishedUrl: string; excerpt?: string },
): { fallbackText: string; blocks: Record<string, unknown>[] } {
  const blocks: Record<string, unknown>[] = []
  blocks.push({
    type: "header",
    text: { type: "plain_text", text: ":rocket: Published", emoji: true },
  })
  const sectionLines = [`*<${args.publishedUrl}|${args.title}>*`]
  if (args.excerpt) sectionLines.push(clip(args.excerpt, 260))
  blocks.push({
    type: "section",
    text: { type: "mrkdwn", text: sectionLines.join("\n") },
  })
  const meta = metaLine({ industry: args.industry, targetKeyword: args.targetKeyword })
  if (meta) blocks.push({ type: "context", elements: [{ type: "mrkdwn", text: meta }] })
  blocks.push({
    type: "actions",
    elements: [
      openInPortalButton(args.pulseId, "Review in Portal"),
      {
        type: "button",
        text: { type: "plain_text", text: "Read post :rocket:", emoji: true },
        url: args.publishedUrl,
      },
      openInMondayButton(args.pulseId, "View in monday", false),
    ],
  })
  return { fallbackText: `:rocket: Published: ${args.title} — ${args.publishedUrl}`, blocks }
}

function openInMondayButton(
  pulseId: string,
  label: string,
  primary: boolean,
): Record<string, unknown> {
  const btn: Record<string, unknown> = {
    type: "button",
    text: { type: "plain_text", text: label, emoji: true },
    url: mondayItemUrl(pulseId),
  }
  if (primary) btn.style = "primary"
  return btn
}

function metaLine(args: { industry?: string; targetKeyword?: string }): string {
  const parts: string[] = []
  if (args.industry) parts.push(`:label: ${args.industry}`)
  if (args.targetKeyword) parts.push(`:dart: ${args.targetKeyword}`)
  return parts.join("  ·  ")
}

// Cheap markdown stripper for preview snippets — drops heading hashes,
// link syntax, and emphasis chars so the context line reads as prose.
function stripMarkdown(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>]/g, "")
    .replace(/\n+/g, " ")
}
