const SLACK_API = "https://slack.com/api"

function getToken(): string {
  const t = process.env.SLACK_BOT_TOKEN
  if (!t) throw new Error("SLACK_BOT_TOKEN missing")
  return t
}

export type SlackBlock = Record<string, unknown>

export async function postSlackMessage(
  channel: string,
  blocks: SlackBlock[],
  text: string,
): Promise<void> {
  const r = await fetch(`${SLACK_API}/chat.postMessage`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ channel, blocks, text }),
  })
  const j = (await r.json()) as { ok?: boolean; error?: string }
  if (!j.ok) {
    throw new Error(`slack chat.postMessage failed: ${j.error ?? "unknown"}`)
  }
}
