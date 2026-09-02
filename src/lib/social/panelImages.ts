/**
 * Which images a blog's social drafts can be offered.
 *
 * Three sources, in the order they are shown: the published article's cover
 * and body images, images found in an unpublished draft's markdown, and
 * whatever the Zernio drafts already carry. That last group is what makes an
 * upload survive a reload; an image uploaded for one channel lives on its
 * draft, and without reading it back the other channels would never see it.
 *
 * Deduped, because the same picture appearing twice in the picker reads as two
 * different choices.
 */
export function panelImageLibrary(...groups: Array<readonly (string | undefined)[]>): string[] {
  const out: string[] = []
  for (const group of groups) {
    for (const url of group) {
      if (url && !out.includes(url)) out.push(url)
    }
  }
  return out
}
