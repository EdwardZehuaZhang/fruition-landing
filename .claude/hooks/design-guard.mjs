#!/usr/bin/env node
/**
 * PostToolUse guard for the DESIGN.md non-negotiables.
 *
 * CLAUDE.md states these rules, but instructions are advisory — this hook makes them
 * deterministic. It inspects the file that was just written and, when it finds a violation,
 * exits 2 so the message on stderr is fed back to Claude for an immediate fix.
 *
 * IMPORTANT: it is **diff-aware**. Only lines added or changed relative to git HEAD are
 * checked. The site carries pre-existing hardcoded colours; flagging those on every edit
 * would make the hook noise and get it switched off. New debt is blocked, old debt is not.
 */
import { readFileSync } from "node:fs"
import { execFileSync } from "node:child_process"

let payload = ""
process.stdin.on("data", (c) => (payload += c))
process.stdin.on("end", () => {
  let file
  try {
    file = JSON.parse(payload)?.tool_input?.file_path
  } catch {
    process.exit(0)
  }
  if (!file) process.exit(0)

  const rel = file.replace(`${process.cwd()}/`, "")
  if (!/^src\/.*\.(tsx|ts)$/.test(rel)) process.exit(0)
  if (rel.startsWith("src/sanity/") || rel.includes(".test.")) process.exit(0)

  let text
  try {
    text = readFileSync(file, "utf8")
  } catch {
    process.exit(0)
  }

  // Which line numbers did this change touch? Untracked file => all of them.
  const changed = changedLines(rel, text.split("\n").length)
  if (changed.size === 0) process.exit(0)

  const isPortal =
    rel.startsWith("src/app/internal/") || rel.startsWith("src/components/internal/")
  const problems = []

  text.split("\n").forEach((line, i) => {
    const n = i + 1
    if (!changed.has(n)) return
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return

    const hex = line.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/)
    if (hex && !/svg|viewBox|stopColor|currentColor/i.test(line)) {
      problems.push(`${rel}:${n}  raw hex ${hex[0]} — use a semantic token from globals.css`)
    }
    if (
      /style=\{\{/.test(line) &&
      /(fontSize|fontFamily|padding|margin|width|height|lineHeight|letterSpacing)\s*:/.test(line)
    ) {
      problems.push(`${rel}:${n}  inline style for layout/type — use Tailwind utilities`)
    }
    const bp = line.match(/\b(sm|xl|2xl):[a-z-]/)
    if (bp && !isPortal) {
      problems.push(
        `${rel}:${n}  '${bp[1]}:' breakpoint — this site uses base, md: (768) and lg: (1024) only`
      )
    }
    const legacy = line.match(/#4674FB|#579bfc/i)
    if (legacy) {
      problems.push(`${rel}:${n}  legacy Wix-era blue ${legacy[0]} — removed from the palette`)
    }
  })

  if (problems.length) {
    console.error(
      `DESIGN.md violations introduced in ${rel}:\n\n` +
        problems.slice(0, 12).map((p) => `  • ${p}`).join("\n") +
        (problems.length > 12 ? `\n  … and ${problems.length - 12} more` : "") +
        `\n\nThese are on lines this change touched. Fix them before continuing.` +
        `\nRules: DESIGN.md §2 (colour), §3 (type), §6 (don'ts).`
    )
    process.exit(2)
  }
  process.exit(0)
})

/** Line numbers added/modified vs HEAD. Falls back to "every line" for new files. */
function changedLines(rel, total) {
  const all = () => new Set(Array.from({ length: total }, (_, i) => i + 1))
  try {
    execFileSync("git", ["ls-files", "--error-unmatch", rel], { stdio: "ignore" })
  } catch {
    return all() // untracked → entirely new
  }
  try {
    const diff = execFileSync("git", ["diff", "-U0", "HEAD", "--", rel], { encoding: "utf8" })
    if (!diff.trim()) return new Set()
    const out = new Set()
    for (const m of diff.matchAll(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm)) {
      const start = Number(m[1])
      const count = m[2] === undefined ? 1 : Number(m[2])
      for (let i = 0; i < count; i++) out.add(start + i)
    }
    return out
  } catch {
    return all()
  }
}
