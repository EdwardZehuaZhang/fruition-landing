/**
 * Print/pagination fixes injected into every design document at render time
 * (view iframe + HTML export). Injecting instead of persisting means already-
 * saved documents get the fixes too, and the rules can evolve without a data
 * migration.
 *
 * The two failure modes these address, seen in exported PDFs:
 * - Page-sized blank gaps: the model puts `break-inside: avoid` on long
 *   tables/sections, so the browser pushes the whole element to the next page
 *   (and still slices it if it's taller than one page).
 * - Content flush against the page edge: documents that rely on container
 *   padding instead of @page margins get zero margin on page 2+.
 *
 * This <style> block is appended last in the document so its rules win the
 * cascade at equal specificity, and `!important` is used where generated
 * documents are known to fight it.
 */
export const PRINT_FIX_STYLE_ID = "fruition-print-fixes"

const PRINT_FIX_CSS = `
@page { size: A4; margin: 18mm 16mm; }
@media print {
  html, body { height: auto !important; min-height: 0 !important; }
  /* Long tables must flow page to page row-by-row (header repeating) instead
     of leaving a page-sized gap trying to keep the whole table together. */
  table { break-inside: auto !important; page-break-inside: auto !important; }
  thead { display: table-header-group; }
  tr { break-inside: avoid; page-break-inside: avoid; }
  li, img, figure, blockquote { break-inside: avoid; page-break-inside: avoid; }
  /* Keep card-like units whole — these are page-height or smaller by design. */
  [class*="card" i], [class*="callout" i], [class*="signoff" i], [class*="sign-off" i] {
    break-inside: avoid; page-break-inside: avoid;
  }
  h1, h2, h3, h4, h5, h6 { break-after: avoid; page-break-after: avoid; break-inside: avoid; }
  p { orphans: 3; widows: 3; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`

/** Append the print-fix stylesheet to a complete HTML document string. */
export function withPrintFixes(html: string): string {
  if (html.includes(PRINT_FIX_STYLE_ID)) return html
  const style = `<style id="${PRINT_FIX_STYLE_ID}">${PRINT_FIX_CSS}</style>`
  const bodyClose = html.toLowerCase().lastIndexOf("</body>")
  if (bodyClose !== -1) return html.slice(0, bodyClose) + style + html.slice(bodyClose)
  const htmlClose = html.toLowerCase().lastIndexOf("</html>")
  if (htmlClose !== -1) return html.slice(0, htmlClose) + style + html.slice(htmlClose)
  return html + style
}
