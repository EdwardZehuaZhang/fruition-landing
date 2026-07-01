/**
 * Slack Block Kit for the social-publishing approval loop.
 *
 * One Slack message per monday item; one section + action row per channel.
 * Each row has Approve / Edit / Skip buttons whose `value` carries everything
 * the interactivity endpoint needs to publish (no DB lookup required on click).
 *
 * Buttons here are INTERACTIVE (action_id + value), unlike the blog blocks
 * which use URL buttons. That requires the Slack app to have an Interactivity
 * Request URL pointing at /api/webhooks/slack-interactivity (see runbook).
 */

import type { SocialChannel } from "@/lib/marketa/ayrshare"

const MONDAY_BOARD_ID = 5028637584

export const SOCIAL_ACTION_APPROVE = "social_approve"
export const SOCIAL_ACTION_EDIT = "social_edit"
export const SOCIAL_ACTION_SKIP = "social_skip"

const CHANNEL_LABEL: Record<SocialChannel, string> = {
  linkedin: "LinkedIn",
  x: "X",
  instagram: "Instagram",
  youtube: "YouTube",
  pinterest: "Pinterest",
}

const CHANNEL_EMOJI: Record<SocialChannel, string> = {
  linkedin: ":linkedin:",
  x: ":x_twitter:",
  instagram: ":instagram:",
  youtube: ":youtube:",
  pinterest: ":pinterest:",
}

function mondayItemUrl(pulseId: string): string {
  return `https://fruitionservices.monday.com/boards/${MONDAY_BOARD_ID}/pulses/${pulseId}`
}

function clip(text: string, max: number): string {
  const t = text.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1).trimEnd()}…`
}

/**
 * The payload packed into each button's `value`. Slack caps button value at
 * 2000 chars, so we DO NOT inline the full post text — the interactivity
 * endpoint re-reads the variant from monday by pulseId + channel. We carry just
 * the routing keys + an idempotency token.
 */
export interface SocialButtonValue {
  pulseId: string
  channel: SocialChannel
  /** Stable per (pulse, channel) so re-clicks don't double-post. */
  idem: string
}

export function encodeButtonValue(v: SocialButtonValue): string {
  return JSON.stringify(v)
}

export function decodeButtonValue(raw: string): SocialButtonValue | null {
  try {
    const v = JSON.parse(raw) as Partial<SocialButtonValue>
    if (!v.pulseId || !v.channel || !v.idem) return null
    return v as SocialButtonValue
  } catch {
    return null
  }
}

export interface ChannelVariantForBlocks {
  channel: SocialChannel
  /** Present when generation succeeded; absent on the error branch. */
  text?: string
  title?: string
  /** If generation failed, show the error instead of buttons for that channel. */
  error?: string
}

export interface BuildSocialApprovalArgs {
  pulseId: string
  contentTitle: string
  industry?: string
  targetKeyword?: string
  blogUrl?: string
  variants: ChannelVariantForBlocks[]
}

export function buildSocialApprovalBlocks(args: BuildSocialApprovalArgs): {
  fallbackText: string
  blocks: Record<string, unknown>[]
} {
  const blocks: Record<string, unknown>[] = []
  blocks.push({
    type: "header",
    text: { type: "plain_text", text: ":satellite_antenna: Ready to socialise", emoji: true },
  })
  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*<${mondayItemUrl(args.pulseId)}|${args.contentTitle}>*`,
    },
  })
  const meta: string[] = []
  if (args.industry) meta.push(`:label: ${args.industry}`)
  if (args.targetKeyword) meta.push(`:dart: ${args.targetKeyword}`)
  if (args.blogUrl) meta.push(`:link: <${args.blogUrl}|blog>`)
  if (meta.length) {
    blocks.push({ type: "context", elements: [{ type: "mrkdwn", text: meta.join("  ·  ") }] })
  }
  blocks.push({ type: "context", elements: [{ type: "mrkdwn", text: "Approve / Edit / Skip each channel. Nothing publishes without a click." }] })

  for (const v of args.variants) {
    blocks.push({ type: "divider" })
    const label = `${CHANNEL_EMOJI[v.channel]} *${CHANNEL_LABEL[v.channel]}*`

    if (v.error) {
      blocks.push({
        type: "section",
        text: { type: "mrkdwn", text: `${label}\n:warning: generation failed: \`${clip(v.error, 200)}\`` },
      })
      continue
    }

    const previewLines: string[] = [label]
    if (v.title) previewLines.push(`_${clip(v.title, 120)}_`)
    // Slack section text caps at 3000 chars; keep a generous preview.
    previewLines.push(clip(v.text ?? "", 1200))
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: previewLines.join("\n") },
    })

    const value = encodeButtonValue({
      pulseId: args.pulseId,
      channel: v.channel,
      idem: `${args.pulseId}:${v.channel}`,
    })
    blocks.push({
      type: "actions",
      block_id: `social:${v.channel}:${args.pulseId}`,
      elements: [
        {
          type: "button",
          style: "primary",
          text: { type: "plain_text", text: "Approve & publish", emoji: true },
          action_id: SOCIAL_ACTION_APPROVE,
          value,
        },
        {
          type: "button",
          text: { type: "plain_text", text: "Edit in monday", emoji: true },
          action_id: SOCIAL_ACTION_EDIT,
          url: mondayItemUrl(args.pulseId),
          value,
        },
        {
          type: "button",
          style: "danger",
          text: { type: "plain_text", text: "Skip", emoji: true },
          action_id: SOCIAL_ACTION_SKIP,
          value,
        },
      ],
    })
  }

  return {
    fallbackText: `:satellite_antenna: Ready to socialise: ${args.contentTitle}`,
    blocks,
  }
}

/**
 * After a button click, replace just that channel's section + action row with a
 * resolved status line. The interactivity endpoint passes the original message
 * blocks back in; this returns a new blocks array with the matched channel's
 * `actions` row swapped for a context status, leaving every other channel's
 * buttons live.
 */
export function resolveChannelInBlocks(
  blocks: Record<string, unknown>[],
  pulseId: string,
  channel: SocialChannel,
  statusText: string,
): Record<string, unknown>[] {
  const targetBlockId = `social:${channel}:${pulseId}`
  return blocks.map((b) => {
    if (b.type === "actions" && b.block_id === targetBlockId) {
      return {
        type: "context",
        block_id: targetBlockId,
        elements: [{ type: "mrkdwn", text: statusText }],
      }
    }
    return b
  })
}

export { CHANNEL_LABEL }
