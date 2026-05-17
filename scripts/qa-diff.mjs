#!/usr/bin/env node
/**
 * Pixel-diff two screenshot directories produced by qa-screenshots.mjs.
 *
 *   node scripts/qa-diff.mjs <labelA> <labelB> [slug]
 *
 * If `slug` is omitted, every PNG in qa/<labelA> is compared. Output diffs
 * land in qa/diff/<labelA>__vs__<labelB>/<slug>.png with a summary printed
 * to stdout. Exits non-zero if ANY page has > 0 differing pixels.
 */
import { readdir, mkdir } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'

const [labelA, labelB, only] = process.argv.slice(2)
if (!labelA || !labelB) {
  console.error('usage: node scripts/qa-diff.mjs <labelA> <labelB> [slug]')
  process.exit(2)
}
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dirA = path.join(repoRoot, 'qa', labelA)
const dirB = path.join(repoRoot, 'qa', labelB)
const outDir = path.join(repoRoot, 'qa', 'diff', `${labelA}__vs__${labelB}`)
await mkdir(outDir, { recursive: true })

const slugs = only
  ? [`${only}.png`]
  : (await readdir(dirA)).filter((f) => f.endsWith('.png'))

let totalDelta = 0
const rows = []
for (const file of slugs) {
  const pathA = path.join(dirA, file)
  const pathB = path.join(dirB, file)
  if (!existsSync(pathA) || !existsSync(pathB)) {
    rows.push([file, 'missing', 'missing'])
    continue
  }
  const imgA = PNG.sync.read(readFileSync(pathA))
  const imgB = PNG.sync.read(readFileSync(pathB))
  if (imgA.width !== imgB.width || imgA.height !== imgB.height) {
    rows.push([
      file,
      `${imgA.width}x${imgA.height}`,
      `${imgB.width}x${imgB.height} (size mismatch)`,
    ])
    totalDelta += 1
    continue
  }
  const diff = new PNG({ width: imgA.width, height: imgA.height })
  const delta = pixelmatch(
    imgA.data,
    imgB.data,
    diff.data,
    imgA.width,
    imgA.height,
    { threshold: 0.05, includeAA: false },
  )
  totalDelta += delta
  rows.push([file, `${delta} px`, ''])
  if (delta > 0) {
    PNG.sync.write(diff)
    const diffPath = path.join(outDir, file)
    const { writeFileSync } = await import('node:fs')
    writeFileSync(diffPath, PNG.sync.write(diff))
  }
}

console.log()
console.log(`Pixel diff: ${labelA} vs ${labelB}`)
console.log('-'.repeat(60))
for (const [file, delta, extra] of rows) {
  console.log(`  ${file.padEnd(40)} ${delta}${extra ? ' ' + extra : ''}`)
}
console.log('-'.repeat(60))
console.log(`Total differing pixels: ${totalDelta}`)
process.exit(totalDelta > 0 ? 1 : 0)
