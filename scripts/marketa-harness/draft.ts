import "dotenv/config"
import { writeDraft } from "./lib/claude"
import { COL, getItem, patchItem } from "./lib/monday"
import { VOICE_GUIDE_STUB } from "./lib/voice-guide"

function colText(c: { text: string | null } | undefined): string {
  return c?.text?.trim() ?? ""
}

async function main() {
  const pulseId = process.argv[2]
  if (!pulseId) {
    console.error("usage: pnpm marketa:draft -- <pulseId>")
    process.exit(1)
  }
  console.log(`[harness] drafting blog for pulseId=${pulseId}...`)

  const item = await getItem(pulseId)
  if (!item) throw new Error(`item ${pulseId} not found`)

  const brief = colText(item.columns[COL.BRIEF])
  const targetKeyword = colText(item.columns[COL.TARGET_KW])
  const industry = colText(item.columns[COL.INDUSTRY]) || "general"

  if (!brief) throw new Error("Brief column is empty — populate before drafting")

  console.log(`[harness]  title:    ${item.name}`)
  console.log(`[harness]  industry: ${industry}`)
  console.log(`[harness]  keyword:  ${targetKeyword || "(none)"}`)

  // Mark Drafting so the board reflects what's happening.
  await patchItem(pulseId, { [COL.STAGE]: { label: "Drafting" } })

  const draft = await writeDraft({
    title: item.name,
    brief,
    targetKeyword,
    industry,
    voiceGuide: VOICE_GUIDE_STUB,
  })

  console.log(`[harness] draft written (${draft.length} chars). Patching monday...`)

  await patchItem(pulseId, {
    [COL.DRAFT_BODY]: { text: draft },
    [COL.STAGE]: { label: "Draft ready" },
  })

  console.log(`[harness] done. Stage = Draft ready.`)
}

main().catch((err) => {
  console.error("[harness] failed:", err)
  process.exit(1)
})
