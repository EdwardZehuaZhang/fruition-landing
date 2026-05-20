import "dotenv/config"
import { reviseDraft } from "./lib/claude"
import { COL, getItem, patchItem } from "./lib/monday"
import { VOICE_GUIDE_STUB } from "./lib/voice-guide"

function colText(c: { text: string | null } | undefined): string {
  return c?.text?.trim() ?? ""
}

async function main() {
  const pulseId = process.argv[2]
  if (!pulseId) {
    console.error("usage: pnpm marketa:revise -- <pulseId>")
    process.exit(1)
  }
  console.log(`[harness] revising blog for pulseId=${pulseId}...`)

  const item = await getItem(pulseId)
  if (!item) throw new Error(`item ${pulseId} not found`)

  const draft = colText(item.columns[COL.DRAFT_BODY])
  const notes = colText(item.columns[COL.EDIT_NOTES])
  if (!draft) throw new Error("Draft body is empty — nothing to revise")
  if (!notes) throw new Error("Edit notes is empty — nothing to apply")

  const revised = await reviseDraft({
    title: item.name,
    draft,
    notes,
    voiceGuide: VOICE_GUIDE_STUB,
  })

  console.log(`[harness] revised (${revised.length} chars). Patching monday + clearing notes...`)

  await patchItem(pulseId, {
    [COL.DRAFT_BODY]: { text: revised },
    [COL.EDIT_NOTES]: { text: "" },
    [COL.STAGE]: { label: "Draft ready" },
  })

  console.log(`[harness] done. Stage = Draft ready.`)
}

main().catch((err) => {
  console.error("[harness] failed:", err)
  process.exit(1)
})
