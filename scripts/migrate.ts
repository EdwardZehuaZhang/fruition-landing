import { spawn } from 'child_process'
import { resolve } from 'path'

function runScript(scriptPath: string): Promise<void> {
  return new Promise((resolve_fn, reject) => {
    const absPath = resolve(scriptPath)
    console.log(`\n${'='.repeat(60)}`)
    console.log(`Running: ${absPath}`)
    console.log('='.repeat(60))

    const child = spawn('node', ['--loader', 'tsx', absPath], {
      stdio: 'inherit',
      env: process.env
    })

    child.on('close', (code) => {
      if (code === 0) resolve_fn()
      else reject(new Error(`Script exited with code ${code}: ${absPath}`))
    })
  })
}

async function main() {
  const start = Date.now()
  console.log('Starting full migration pipeline...')

  try {
    await runScript('./scripts/import-site-settings.ts')
    console.log('Site settings: DONE')
  } catch (err) {
    console.error('Site settings FAILED:', err)
  }

  try {
    await runScript('./scripts/import-pages.ts')
    console.log('Static pages: DONE')
  } catch (err) {
    console.error('Static pages FAILED:', err)
  }

  try {
    await runScript('./scripts/import-blog.ts')
    console.log('Blog posts: DONE')
  } catch (err) {
    console.error('Blog posts FAILED:', err)
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)
  console.log(`\nFull migration complete in ${elapsed}s`)
}

main().catch(console.error)
