import "dotenv/config"
import { generateIdeas } from "./lib/claude"
import { createIdea, recentBlogTitles } from "./lib/monday"

async function main() {
  const count = Number(process.argv[2] || 5)
  console.log(`[harness] generating ${count} ideas...`)

  const recent = await recentBlogTitles()
  const recentContext = recent.length ? recent.map((t) => `- ${t}`).join("\n") : ""

  const ideas = await generateIdeas(recentContext, count)
  console.log(`[harness] Claude returned ${ideas.length} ideas. Pushing to monday...`)

  for (const idea of ideas) {
    const id = await createIdea({
      title: idea.title,
      brief: idea.brief,
      targetKeyword: idea.target_keyword,
      industry: idea.industry,
    })
    console.log(`  ✓ ${id} — ${idea.title} [${idea.industry}]`)
  }

  console.log(`[harness] done. Review at https://fruitionservices.monday.com/boards/5028637584`)
}

main().catch((err) => {
  console.error("[harness] failed:", err)
  process.exit(1)
})
