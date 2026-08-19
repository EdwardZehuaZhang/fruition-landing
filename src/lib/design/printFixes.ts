/**
 * Print/pagination fixes applied to every design document at render time
 * (view iframe + HTML export). Applying instead of persisting means already-
 * saved documents get the fixes too, and the rules can evolve without a data
 * migration.
 *
 * The failure modes these address, seen in exported PDFs:
 *
 * - Text sliced by the running footer. The generated documents give the footer
 *   `position: fixed; bottom: 0`, which in paged media repeats it on every page
 *   anchored to the bottom of the page *content* box — but reserves no space
 *   there, so the last line or two of every page prints underneath it. (The
 *   `padding-bottom` those documents put on <body> only clears the footer on
 *   the final page.) Chrome supports neither `@page` margin boxes nor a fixed
 *   element parked in the page margin — a negative `bottom` just spills the
 *   footer onto the following page. The one mechanism that both repeats per
 *   page *and* reserves space in the flow is a table footer group, so the
 *   document is wrapped in a single-cell table whose `<tfoot>` is an empty
 *   spacer the fixed footer paints into. See wrapForRunningFooter.
 * - Duplicated totals: a content `<tfoot>` defaults to `table-footer-group`,
 *   so Chrome repeats it at the foot of every page the table spans.
 * - Page-sized blank gaps: the model puts `break-inside: avoid` on long
 *   tables/sections, so the browser pushes the whole element to the next page
 *   (and still slices it if it's taller than one page).
 * - Content flush against the page edge: documents that rely on container
 *   padding instead of @page margins get zero margin on page 2+.
 *
 * The <style> block is appended last in the document so its rules win the
 * cascade at equal specificity, and `!important` is used where generated
 * documents are known to fight it.
 */
export const PRINT_FIX_STYLE_ID = "fruition-print-fixes"

/** Wrapper table + spacer ids, referenced by both the markup and the CSS. */
const PAGE_TABLE_ID = "fruition-page-table"
const PAGE_FOOT_ID = "fruition-page-foot"

/**
 * Height of the per-page strip reserved for the running footer. The footers
 * these documents generate are ~10mm tall (12px text + 10px padding + rule);
 * the extra few mm is clear air, and headroom in case a long document title
 * wraps the footer to two lines.
 */
const FOOTER_RESERVE = "15mm"

function printFixCss(hasRunningFooter: boolean): string {
  return `
@page { size: A4; margin: 18mm 16mm; }
${
  hasRunningFooter
    ? `
#${PAGE_TABLE_ID} { width: 100%; border-collapse: collapse; }
#${PAGE_TABLE_ID} > tbody > tr > td, #${PAGE_TABLE_ID} > tfoot > tr > td { padding: 0; border: 0; }
#${PAGE_FOOT_ID} td { height: ${FOOTER_RESERVE}; }
`
    : ""
}
@media print {
  html, body { height: auto !important; min-height: 0 !important; }
${
  hasRunningFooter
    ? `  /* Reserve the strip the fixed running footer prints into, on every page. */
  #${PAGE_FOOT_ID} { display: table-footer-group !important; }
  /* The wrapper holds the whole document in one row — it must never be kept
     together by the generic \`tr\` rule below. */
  #${PAGE_TABLE_ID} > tbody > tr, #${PAGE_TABLE_ID} > tbody > tr > td {
    break-inside: auto !important; page-break-inside: auto !important;
  }
  /* Space the document reserved for the old overlapping footer. */
  body { padding-bottom: 0 !important; }
`
    : ""
}  /* Long tables must flow page to page row-by-row (header repeating) instead
     of leaving a page-sized gap trying to keep the whole table together. */
  table { break-inside: auto !important; page-break-inside: auto !important; }
  thead { display: table-header-group; }
  /* A content <tfoot> would otherwise repeat on every page the table spans,
     printing the totals row once per page. */
  tfoot { display: table-row-group; }
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
}

/**
 * True when the document ends in a fixed running footer (the house style the
 * generator prompt asks for). Only those documents get the wrapper table —
 * everything else would just gain an unexplained blank strip per page.
 */
function hasRunningFooter(html: string): boolean {
  if (!/position\s*:\s*fixed/i.test(html)) return false
  const body = html.slice(html.toLowerCase().lastIndexOf("<body"))
  return /<footer[\s>]/i.test(body) || /<div[^>]*\sclass\s*=\s*"[^"]*\bfooter\b/i.test(body)
}

/**
 * Wrap the body contents in a single-cell table with an empty `<tfoot>` spacer.
 * The spacer is the only cross-browser way to reserve space at the foot of
 * *every* printed page; the document's own fixed footer then prints into it
 * instead of on top of the text.
 */
function wrapForRunningFooter(html: string): string {
  const open = /<body[^>]*>/i.exec(html)
  const close = html.toLowerCase().lastIndexOf("</body>")
  if (!open || close === -1 || close < open.index) return html
  const start = open.index + open[0].length
  const inner = html.slice(start, close)
  const table =
    `<table id="${PAGE_TABLE_ID}">` +
    `<tfoot id="${PAGE_FOOT_ID}"><tr><td></td></tr></tfoot>` +
    `<tbody><tr><td>${inner}</td></tr></tbody>` +
    `</table>`
  return html.slice(0, start) + table + html.slice(close)
}

/** Apply the print/pagination fixes to a complete HTML document string. */
export function withPrintFixes(html: string): string {
  if (html.includes(PRINT_FIX_STYLE_ID)) return html
  const footer = hasRunningFooter(html)
  const doc = footer ? wrapForRunningFooter(html) : html

  const style = `<style id="${PRINT_FIX_STYLE_ID}">${printFixCss(footer)}</style>`
  const bodyClose = doc.toLowerCase().lastIndexOf("</body>")
  if (bodyClose !== -1) return doc.slice(0, bodyClose) + style + doc.slice(bodyClose)
  const htmlClose = doc.toLowerCase().lastIndexOf("</html>")
  if (htmlClose !== -1) return doc.slice(0, htmlClose) + style + doc.slice(htmlClose)
  return doc + style
}
