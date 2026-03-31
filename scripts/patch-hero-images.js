const fs = require("fs")
const path = require("path")
const glob = require("glob")

const srcDir = "D:/Coding-Files/GitHub/fruition-landing/src"
const files = glob.sync(`${srcDir}/app/**/*.tsx`)

let patched = 0
for (const file of files) {
  let content = fs.readFileSync(file, "utf8")
  // Skip if already has heroImage prop
  if (content.includes("heroImage={page?.heroImage}")) continue
  // Only patch files that use HeroSection with page data
  if (!content.includes("<HeroSection")) continue
  if (!content.includes("page?.")) continue

  // Add heroImage prop after subheading prop line
  const updated = content.replace(
    /(subheading=\{[^\}]+\}\s*\n)/g,
    `$1        heroImage={page?.heroImage}\n`
  )
  if (updated !== content) {
    fs.writeFileSync(file, updated, "utf8")
    patched++
    console.log("Patched:", path.relative(srcDir, file))
  }
}

// Also fix the solution [slug] page directly (encoding issue workaround)
const solPath = `${srcDir}/app/monday-consulting-solutions/[slug]/page.tsx`
let sol = fs.readFileSync(solPath, "utf8")
if (!sol.includes("heroImage={page?.heroImage}")) {
  sol = sol.replace(
    /(subheading=\{[^\}]+\}\s*\n)/,
    `$1        heroImage={page?.heroImage}\n`
  )
  fs.writeFileSync(solPath, sol, "utf8")
  patched++
  console.log("Patched: solution [slug]")
}

console.log(`\nTotal patched: ${patched}`)