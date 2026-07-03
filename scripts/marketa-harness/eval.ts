/**
 * Marketa blog eval harness.
 *
 * Pulls real published blog titles from Sanity, regenerates a draft from each
 * (using the LIVE voice guide + brain RAG + web search, mirroring n8n), scores
 * each draft against the Fruition style rubric, and writes a report. Use it to
 * iterate the voice guide until generations clear the target score.
 *
 *   pnpm marketa:eval                 # 3 most recent posts, brain on, web on
 *   pnpm marketa:eval -- --n 5        # 5 most recent posts
 *   pnpm marketa:eval -- --title "Purchase Orders"
 *   pnpm marketa:eval -- --itemId 2752822556
 *   pnpm marketa:eval -- --no-web --no-brain   # faster/cheaper dry run
 *
 * Output: scripts/marketa-harness/eval-out/<timestamp>/ with each draft (.md)
 * and a report.md. Console prints the scorecards + average.
 */
import "./lib/env" // must be first: loads .env.local before env-reading modules
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import {
  briefFor,
  fetchInternalLinkMenu,
  fetchPostByItemId,
  fetchPostsByTitle,
  fetchRecentPosts,
  type InternalLink,
  type RealPost,
} from "./lib/sanityPosts"
import {
  buildContext,
  fetchLiveVoiceGuide,
  fetchStatMenu,
  generateDraft,
  retrieveBrain,
  type StatItem,
} from "./lib/draftPrompt"
import { formatScorecard, scoreDraft, type ScoreResult } from "./lib/score"

const TARGET = Number(process.env.MARKETA_EVAL_TARGET || "80")

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}
const flag = (name: string) => process.argv.includes(`--${name}`)

async function selectPosts(): Promise<RealPost[]> {
  const itemId = arg("itemId")
  if (itemId) {
    const p = await fetchPostByItemId(itemId)
    if (!p) throw new Error(`no blogPost with mondayItemId=${itemId}`)
    return [p]
  }
  const title = arg("title")
  if (title) {
    const ps = await fetchPostsByTitle(title)
    if (!ps.length) throw new Error(`no blogPost title matching "${title}"`)
    return ps
  }
  return fetchRecentPosts(Number(arg("n") || "3"))
}

async function main() {
  const webSearch = !flag("no-web")
  const useBrain = !flag("no-brain")
  const ts = new Date().toISOString().replace(/[:.]/g, "-")
  const outDir = join("scripts/marketa-harness/eval-out", ts)
  mkdirSync(outDir, { recursive: true })

  const voice = await fetchLiveVoiceGuide()
  console.log(`[eval] voice guide ${voice.version} (${voice.body.length} chars)`)
  console.log(`[eval] web search: ${webSearch} | brain: ${useBrain} | target: ${TARGET}`)

  // Real internal-link menu (exclude a post from its own menu when scoring it).
  let linkMenu: InternalLink[] = []
  try {
    linkMenu = await fetchInternalLinkMenu(40)
    console.log(`[eval] internal-link menu: ${linkMenu.length} real URLs`)
  } catch (e) {
    console.warn(`[eval] link menu failed: ${(e as Error).message}`)
  }

  const posts = await selectPosts()
  console.log(`[eval] scoring ${posts.length} post(s)\n`)

  const report: string[] = [
    `# Marketa eval — ${ts}`,
    `voice guide: \`${voice.version}\` · web=${webSearch} · brain=${useBrain} · target=${TARGET}`,
    "",
  ]
  const scores: number[] = []

  for (const post of posts) {
    const { topicTitle, brief, targetKeyword, industry } = briefFor(post)
    console.log(`[eval] -> "${topicTitle}" (kw="${targetKeyword}", industry=${industry})`)

    let context = ""
    if (useBrain) {
      try {
        const chunks = await retrieveBrain(`${topicTitle}\n${brief}`, industry)
        context = buildContext(chunks)
        console.log(`[eval]    brain: ${chunks.length} chunks`)
      } catch (e) {
        console.warn(`[eval]    brain failed: ${(e as Error).message}`)
      }
    }

    let statMenu: StatItem[] = []
    if (!flag("no-statmenu")) {
      statMenu = await fetchStatMenu(topicTitle, industry)
      console.log(`[eval]    stat menu: ${statMenu.length} verified stats`)
    }
    // With a stat menu provided, write with web search OFF so the model emits
    // clean inline markdown links from the menu (web_search active footnotes them).
    const writeWeb = statMenu.length ? false : webSearch

    const internalLinks = linkMenu.filter((l) => l.title !== post.title)
    const draft = await generateDraft({
      topicTitle, brief, targetKeyword, industry,
      voiceGuide: voice.body, context, internalLinks, statMenu, webSearch: writeWeb,
    })
    const slug = topicTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50)
    writeFileSync(join(outDir, `${slug}.md`), draft)

    const r: ScoreResult = scoreDraft(draft, { topicTitle, targetKeyword })
    scores.push(r.total)
    const card = formatScorecard(topicTitle, r)
    console.log("\n" + card + "\n")
    report.push(card, "")
  }

  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  const verdict = avg >= TARGET ? "PASS" : "below target"
  const summary = `## Average: ${avg}/100 (${verdict}, target ${TARGET})`
  console.log(summary)
  report.unshift(summary, "")
  writeFileSync(join(outDir, "report.md"), report.join("\n"))
  console.log(`\n[eval] drafts + report written to ${outDir}`)
}

main().catch((e) => {
  console.error("[eval] failed:", e)
  process.exit(1)
})
