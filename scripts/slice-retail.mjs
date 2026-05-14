// Slice the two full-page screenshots into top/mid/bottom thirds for review.
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
const sh = promisify(exec)

for (const name of ['prod', 'local']) {
  const src = `/tmp/retail-shots/${name}-full.png`
  const { stdout } = await sh(`sips -g pixelHeight ${src}`)
  const h = Number(stdout.match(/pixelHeight: (\d+)/)[1])
  const slice = Math.ceil(h / 4)
  for (let i = 0; i < 4; i++) {
    const top = i * slice
    const out = `/tmp/retail-shots/${name}-${i}.png`
    await sh(`sips -c ${slice} 1440 --cropOffset ${top} 0 ${src} --out ${out} >/dev/null 2>&1 || true`)
  }
  console.log(name, 'h', h)
}
