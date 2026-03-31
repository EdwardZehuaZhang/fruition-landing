require("dotenv").config({ path: ".env.local" })
const { createClient } = require("@sanity/client")
const client = createClient({ projectId: "bt6nb58h", dataset: "production", apiVersion: "2024-01-01", token: process.env.SANITY_WRITE_TOKEN, useCdn: false })
async function run() {
  const team = await client.fetch('*[_type == "teamMember"] | order(order asc){ name, role, "hasPhoto": defined(photo) }')
  console.log("Team members:", team.length)
  team.forEach(m => console.log(`  ${m.hasPhoto ? "+" : "-"} ${m.name} (${m.role})`))
  
  const videoPosts = await client.fetch('*[_type == "blogPost" && defined(videoUrls) && count(videoUrls) > 0]{ title, videoUrls }')
  console.log("\nPosts with videos:", videoPosts.length)
  videoPosts.slice(0,5).forEach(p => console.log(`  ${p.title}: ${p.videoUrls.join(", ")}`))
}
run().catch(e => console.error(e.message))