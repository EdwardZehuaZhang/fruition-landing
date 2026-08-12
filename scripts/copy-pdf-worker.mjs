/**
 * Copies the pdfjs-dist worker into public/ so the Clockify PDF import can load
 * it from a stable URL (`/pdf.worker.min.mjs`).
 *
 * pdfjs v4+ refuses to run without a real worker script, and bundling it via
 * `new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url)` is fragile
 * across Next/Turbopack/OpenNext. A static asset has no bundler ambiguity — and
 * it keeps 1.2 MB out of the Cloudflare Worker bundle.
 *
 * Runs on postinstall so the copy can never drift from the installed version.
 * The file is also committed, so builds with --ignore-scripts still work.
 */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs')
const dest = join(root, 'public', 'pdf.worker.min.mjs')

if (!existsSync(src)) {
  // pdfjs-dist not installed (e.g. --omit=optional in some CI path) — the
  // committed copy stands in. Never fail install over this.
  console.warn('[copy-pdf-worker] pdfjs-dist worker not found, keeping committed copy')
  process.exit(0)
}

mkdirSync(dirname(dest), { recursive: true })
copyFileSync(src, dest)
console.log('[copy-pdf-worker] public/pdf.worker.min.mjs updated')
