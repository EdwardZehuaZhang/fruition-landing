/**
 * Convert a generated Fruition design document (self-contained HTML) into a
 * .docx.
 *
 * Why this exists: the HTML → print → PDF path gives pixel-accurate brand
 * output but hands pagination to the browser, and it produces a flat file the
 * client can't edit or sign in place. Word paginates properly on its own
 * (real repeating table headers, a real running footer) and is editable, so
 * this is the export to reach for when a document has to survive review.
 *
 * The conversion is structural, not pixel-perfect: it recognises the house
 * document's building blocks (cover, section headings, data tables, callouts,
 * figure cards, sign-off cards) and rebuilds each with the nearest native Word
 * construct in the brand palette. Generated documents don't use stable class
 * names — one calls its table `.data-table` and another `.data`, one uses
 * `.role` and another `.signer-role` — so blocks are matched on class
 * *substrings* plus tag structure, never on an exact class name.
 */
import { parse, type HTMLElement, type Node as HtmlNode } from "node-html-parser"
import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Footer,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  PageNumber,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
  convertMillimetersToTwip,
} from "docx"
import {
  FRUITION_LOGO_WHITE_PNG_BASE64,
  FRUITION_LOGO_WHITE_PNG_SIZE,
} from "@/lib/design/fruitionLogoPng"

/** House palette, as Word hex (no leading #). Mirrors fruitionDocPrompt.ts. */
const C = {
  purple: "8015E8",
  lightPurple: "BA83F0",
  indigo: "2B074D",
  lavender: "F7F5FF",
  hairline: "ECEAF3",
  heading: "1A1A2E",
  muted: "686B82",
  body: "242323",
  darkCard: "150A33",
  cardText: "E7E2F5",
  white: "FFFFFF",
} as const

const FONT = "Poppins"
const BULLET_REF = "fruition-bullets"
const NUMBER_REF = "fruition-numbers"

/** node-html-parser node types. */
const ELEMENT_NODE = 1
const TEXT_NODE = 3

const isElement = (n: HtmlNode): n is HTMLElement => n.nodeType === ELEMENT_NODE
const tagOf = (el: HTMLElement) => (el.rawTagName || "").toLowerCase()
const classOf = (el: HTMLElement) => (el.getAttribute("class") || "").toLowerCase()
/** Fuzzy class match — generated documents name the same block differently. */
const hasClass = (el: HTMLElement, needle: string) => classOf(el).includes(needle)

// ─────────────────────────────────────────────────────────── inline runs ────

type RunStyle = {
  bold?: boolean
  italics?: boolean
  color?: string
  size?: number // half-points
  allCaps?: boolean
  characterSpacing?: number
}

type InlineChild = TextRun | ExternalHyperlink

/** Flatten an element's inline content into Word runs, following the style. */
function inlineRuns(node: HtmlNode, style: RunStyle): InlineChild[] {
  if (node.nodeType === TEXT_NODE) {
    const text = node.text.replace(/\s+/g, " ")
    if (!text.trim()) return text === " " ? [new TextRun({ text: " ", font: FONT, ...style })] : []
    return [new TextRun({ text, font: FONT, ...style })]
  }
  if (!isElement(node)) return []

  const tag = tagOf(node)
  if (tag === "br") return [new TextRun({ text: "", break: 1 })]
  if (tag === "img" || tag === "script" || tag === "style") return []

  const next: RunStyle = { ...style }
  if (tag === "strong" || tag === "b") {
    next.bold = true
    next.color = style.color ?? C.heading
  }
  if (tag === "em" || tag === "i") next.italics = true
  // The "N." prefix on section headings is purple in the house style.
  if (tag === "span" && hasClass(node, "num")) next.color = C.purple

  if (tag === "a") {
    const href = node.getAttribute("href")
    const runs = node.childNodes.flatMap((c) =>
      inlineRuns(c, { ...next, color: C.purple, bold: true })
    )
    if (!href || !runs.length) return runs
    return [new ExternalHyperlink({ link: href, children: runs })]
  }

  return node.childNodes.flatMap((c) => inlineRuns(c, next))
}

const runsOf = (el: HTMLElement, style: RunStyle = {}): InlineChild[] =>
  el.childNodes.flatMap((c) => inlineRuns(c, style))

const textOf = (el: HTMLElement) => el.text.replace(/\s+/g, " ").trim()

// ────────────────────────────────────────────────────────── block pieces ────

const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "auto" } as const
const noBorders = {
  top: NO_BORDER,
  bottom: NO_BORDER,
  left: NO_BORDER,
  right: NO_BORDER,
  insideHorizontal: NO_BORDER,
  insideVertical: NO_BORDER,
}

const FULL_WIDTH = { size: 100, type: WidthType.PERCENTAGE } as const

/** A borderless full-width table used purely as a coloured/padded panel. */
function panel(children: (Paragraph | Table)[], fill: string, padding = 220): Table {
  return new Table({
    width: FULL_WIDTH,
    borders: noBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill, color: "auto" },
            margins: { top: padding, bottom: padding, left: padding, right: padding },
            children: children.length ? children : [new Paragraph("")],
          }),
        ],
      }),
    ],
  })
}

function eyebrow(text: string, color: string, spacingAfter = 80): Paragraph {
  return new Paragraph({
    spacing: { after: spacingAfter },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: FONT,
        bold: true,
        size: 17,
        color,
        characterSpacing: 24,
      }),
    ],
  })
}

function bodyParagraph(children: InlineChild[], opts: { after?: number } = {}): Paragraph {
  return new Paragraph({ spacing: { after: opts.after ?? 140, line: 300 }, children })
}

// ────────────────────────────────────────────────────────────── the cover ────

function coverBlock(el: HTMLElement): (Paragraph | Table)[] {
  const inner: Paragraph[] = []

  inner.push(
    new Paragraph({
      spacing: { after: 260 },
      children: [
        new ImageRun({
          type: "png",
          data: FRUITION_LOGO_WHITE_PNG_BASE64,
          transformation: {
            width: FRUITION_LOGO_WHITE_PNG_SIZE.width,
            height: FRUITION_LOGO_WHITE_PNG_SIZE.height,
          },
        }),
        new TextRun({ text: "     " }),
        new TextRun({
          text: (el.querySelector("[class*=partner]") ?? el).text.includes("PLATINUM")
            ? "MONDAY.COM PLATINUM PARTNER"
            : "",
          font: FONT,
          size: 16,
          color: "C9B3EF",
          characterSpacing: 24,
        }),
      ],
    })
  )

  const pick = (needle: string) =>
    el.querySelectorAll("div, p, span").find((n) => hasClass(n, needle) && textOf(n))

  const eyebrowEl = pick("eyebrow")
  if (eyebrowEl) inner.push(eyebrow(textOf(eyebrowEl), C.lightPurple, 100))

  const titleEl = pick("cover-title") ?? pick("title")
  if (titleEl) {
    inner.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ text: textOf(titleEl), font: FONT, bold: true, size: 56, color: C.white }),
        ],
      })
    )
  }

  const subEl = pick("cover-sub")
  if (subEl) {
    inner.push(
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun({ text: textOf(subEl), font: FONT, size: 24, color: "D9CCF2" })],
      })
    )
  }

  // Meta pairs: a small uppercase label above its value.
  for (const item of el.querySelectorAll("div")) {
    const label = item.querySelector("[class*=label]")
    const value = item.querySelector("[class*=value]")
    if (!label || !value) continue
    inner.push(
      new Paragraph({
        spacing: { before: 160, after: 20 },
        children: [
          new TextRun({
            text: textOf(label).toUpperCase(),
            font: FONT,
            size: 15,
            color: "BFAEDC",
            characterSpacing: 20,
          }),
        ],
      })
    )
    inner.push(
      new Paragraph({
        children: [
          new TextRun({ text: textOf(value), font: FONT, size: 22, bold: true, color: C.white }),
        ],
      })
    )
  }

  return [panel(inner, C.indigo, 340), new Paragraph({ spacing: { after: 260 }, children: [] })]
}

// ─────────────────────────────────────────────────────────────── tables ────

function tableBlock(el: HTMLElement): Table | null {
  const rows = el.querySelectorAll("tr")
  if (!rows.length) return null

  const identifierTable = hasClass(el, "identifier")

  const docxRows = rows.map((tr) => {
    const cells = tr.querySelectorAll("th, td")
    const isHeader = cells.length > 0 && cells.every((c) => tagOf(c) === "th")

    return new TableRow({
      tableHeader: isHeader, // Word repeats these on every page the table spans
      children: cells.map((cell, i) => {
        const header = tagOf(cell) === "th"
        const idCell = !header && i === 0 && (identifierTable || hasClass(cell, "idcol"))
        const style: RunStyle = header
          ? { bold: true, color: C.purple, size: 17, allCaps: true, characterSpacing: 12 }
          : idCell
            ? { bold: true, color: C.purple, size: 20 }
            : i === 0
              ? { bold: true, color: C.heading, size: 20 }
              : { color: C.body, size: 20 }

        const children = paragraphsForCell(cell, style)
        return new TableCell({
          columnSpan: Number(cell.getAttribute("colspan")) || undefined,
          rowSpan: Number(cell.getAttribute("rowspan")) || undefined,
          verticalAlign: VerticalAlign.TOP,
          shading: header
            ? { type: ShadingType.CLEAR, fill: C.lavender, color: "auto" }
            : undefined,
          margins: { top: 120, bottom: 120, left: 140, right: 140 },
          borders: {
            top: NO_BORDER,
            left: NO_BORDER,
            right: NO_BORDER,
            bottom: header
              ? { style: BorderStyle.SINGLE, size: 12, color: C.purple }
              : { style: BorderStyle.SINGLE, size: 4, color: C.hairline },
          },
          children: children.length ? children : [new Paragraph("")],
        })
      }),
    })
  })

  return new Table({ width: FULL_WIDTH, borders: noBorders, rows: docxRows })
}

/** Cell contents: block children become their own paragraphs, inline text one. */
function paragraphsForCell(cell: HTMLElement, style: RunStyle): Paragraph[] {
  const lists = cell.querySelectorAll("ul, ol")
  if (lists.length) {
    return lists.flatMap((list) => listParagraphs(list, style))
  }
  const runs = runsOf(cell, style)
  return runs.length ? [new Paragraph({ spacing: { after: 0, line: 280 }, children: runs })] : []
}

// ───────────────────────────────────────────────────────────────── lists ────

function listParagraphs(el: HTMLElement, style: RunStyle = { color: C.body, size: 21 }): Paragraph[] {
  const ordered = tagOf(el) === "ol"
  return el
    .querySelectorAll("li")
    .filter((li) => li.parentNode === el)
    .map(
      (li) =>
        new Paragraph({
          numbering: { reference: ordered ? NUMBER_REF : BULLET_REF, level: 0 },
          spacing: { after: 90, line: 290 },
          children: runsOf(li, style),
        })
    )
}

// ──────────────────────────────────────────────────────────── sign-off ────

/** An empty ruled box for a handwritten signature or date. */
function fillableBox(label: string, widthPct: number, heightTwips: number): (Paragraph | Table)[] {
  return [
    new Table({
      width: { size: widthPct, type: WidthType.PERCENTAGE },
      borders: {
        ...noBorders,
        top: { style: BorderStyle.SINGLE, size: 4, color: C.hairline },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: C.hairline },
        left: { style: BorderStyle.SINGLE, size: 4, color: C.hairline },
        right: { style: BorderStyle.SINGLE, size: 4, color: C.hairline },
      },
      rows: [
        new TableRow({
          height: { value: heightTwips, rule: "atLeast" },
          children: [
            new TableCell({
              shading: { type: ShadingType.CLEAR, fill: C.lavender, color: "auto" },
              children: [new Paragraph("")],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 60, after: 200 },
      children: [
        new TextRun({
          text: label.toUpperCase(),
          font: FONT,
          size: 14,
          color: C.muted,
          characterSpacing: 20,
        }),
      ],
    }),
  ]
}

function signerCard(el: HTMLElement): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = []
  const pick = (needle: string) =>
    el.querySelectorAll("div, p, span").find((n) => hasClass(n, needle) && textOf(n))

  const role = pick("role")
  if (role) out.push(eyebrow(textOf(role), C.purple, 60))

  const name = pick("name")
  if (name) {
    out.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: textOf(name), font: FONT, bold: true, size: 26, color: C.heading }),
        ],
      })
    )
  }

  const sub = pick("subtitle") ?? pick("sub")
  if (sub) {
    out.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: textOf(sub), font: FONT, size: 19, color: C.muted })],
      })
    )
  }

  // Existing sig/date boxes may already carry a typed value; keep it if so.
  for (const box of el.querySelectorAll("[class*=sig-box], [class*=date-box]")) {
    const isDate = hasClass(box, "date")
    const label = isDate ? "Date" : "Signature"
    const typed = textOf(box)
    if (typed) {
      out.push(
        new Paragraph({
          spacing: { after: 20 },
          children: [new TextRun({ text: typed, font: FONT, size: 22, color: C.heading })],
        }),
        new Paragraph({
          spacing: { after: 200 },
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.hairline } },
          children: [
            new TextRun({
              text: label.toUpperCase(),
              font: FONT,
              size: 14,
              color: C.muted,
              characterSpacing: 20,
            }),
          ],
        })
      )
    } else {
      out.push(...fillableBox(label, isDate ? 55 : 100, isDate ? 460 : 620))
    }
  }

  // Any remaining labelled fields on the card (e.g. "EFFORT OPTION APPROVED").
  for (const extra of el.querySelectorAll("[class*=extra-field]")) {
    const runs = runsOf(extra, { color: C.body, size: 19 })
    if (runs.length) out.push(new Paragraph({ spacing: { after: 120 }, children: runs }))
  }

  return out.length ? out : [new Paragraph("")]
}

function signoffBlock(el: HTMLElement): (Paragraph | Table)[] {
  const cards = el.querySelectorAll("[class*=signer], [class*=card]").filter((c) => {
    // only top-level cards, not nested matches
    let p = c.parentNode as HTMLElement | null
    while (p && p !== el) {
      if (isElement(p) && (hasClass(p, "signer") || hasClass(p, "card"))) return false
      p = p.parentNode as HTMLElement | null
    }
    return true
  })
  if (!cards.length) return []

  return [
    new Table({
      width: FULL_WIDTH,
      borders: noBorders,
      rows: [
        new TableRow({
          cantSplit: true,
          children: cards.map(
            (card) =>
              new TableCell({
                verticalAlign: VerticalAlign.TOP,
                margins: { top: 220, bottom: 220, left: 220, right: 220 },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 4, color: C.hairline },
                  bottom: { style: BorderStyle.SINGLE, size: 4, color: C.hairline },
                  left: { style: BorderStyle.SINGLE, size: 4, color: C.hairline },
                  right: { style: BorderStyle.SINGLE, size: 4, color: C.hairline },
                },
                children: signerCard(card),
              })
          ),
        }),
      ],
    }),
    new Paragraph({ spacing: { after: 200 }, children: [] }),
  ]
}

// ─────────────────────────────────────────────────────────── the walker ────

const SKIP_TAGS = new Set(["script", "style", "link", "meta", "head", "title", "noscript"])

function walk(el: HTMLElement): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = []

  for (const node of el.childNodes) {
    if (node.nodeType === TEXT_NODE) {
      // Stray text directly inside a container.
      const text = node.text.replace(/\s+/g, " ").trim()
      if (text) {
        out.push(bodyParagraph([new TextRun({ text, font: FONT, color: C.body, size: 21 })]))
      }
      continue
    }
    if (!isElement(node)) continue

    const tag = tagOf(node)
    if (SKIP_TAGS.has(tag)) continue
    // The running footer becomes a real Word footer, not body content.
    if (hasClass(node, "footer") && !hasClass(node, "footer-note")) continue

    if (hasClass(node, "cover")) {
      out.push(...coverBlock(node))
      continue
    }
    if (hasClass(node, "signoff") || hasClass(node, "sign-off")) {
      out.push(...signoffBlock(node))
      continue
    }
    if (hasClass(node, "callout")) {
      out.push(
        panel(walk(node), C.lavender, 200),
        new Paragraph({ spacing: { after: 200 }, children: [] })
      )
      continue
    }
    if (hasClass(node, "figure-card") || hasClass(node, "figure_card")) {
      out.push(...figureBlock(node))
      continue
    }

    switch (tag) {
      case "table": {
        const t = tableBlock(node)
        if (t) out.push(t, new Paragraph({ spacing: { after: 220 }, children: [] }))
        continue
      }
      case "ul":
      case "ol":
        out.push(...listParagraphs(node))
        continue
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        out.push(headingBlock(node, tag))
        continue
      case "p": {
        const runs = runsOf(node, { color: C.body, size: 21 })
        if (runs.length) out.push(bodyParagraph(runs))
        continue
      }
      case "br":
      case "img":
      case "hr":
        continue
      default: {
        // Container: recurse. Leaf with text: style it from its class name.
        const hasBlockChild = node.childNodes.some(
          (c) => isElement(c) && !["span", "strong", "b", "em", "i", "a", "br"].includes(tagOf(c))
        )
        if (hasBlockChild) {
          out.push(...walk(node))
        } else {
          const p = leafParagraph(node)
          if (p) out.push(p)
        }
      }
    }
  }

  return out
}

function headingBlock(el: HTMLElement, tag: string): Paragraph {
  const level = Number(tag.slice(1))
  const size = level <= 2 ? 34 : level === 3 ? 26 : 23
  return new Paragraph({
    heading: level <= 2 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
    keepNext: true, // never orphan a heading at the foot of a page
    spacing: { before: level <= 2 ? 440 : 300, after: 160 },
    children: runsOf(el, { bold: true, color: C.heading, size }),
  })
}

function figureBlock(el: HTMLElement): (Paragraph | Table)[] {
  const inner: (Paragraph | Table)[] = []
  for (const child of el.childNodes) {
    if (!isElement(child)) continue
    const tag = tagOf(child)
    const isEyebrow = hasClass(child, "eyebrow")
    const isGroupTitle = hasClass(child, "group-title")

    if (tag === "ul" || tag === "ol") {
      inner.push(...listParagraphs(child, { color: C.cardText, size: 20 }))
      continue
    }
    const runs = runsOf(
      child,
      isEyebrow || isGroupTitle
        ? { bold: true, color: C.lightPurple, size: 17, characterSpacing: 20 }
        : { color: C.cardText, size: 20 }
    )
    if (!runs.length) continue
    inner.push(
      new Paragraph({
        spacing: { after: isEyebrow ? 160 : 110, line: 300 },
        children: isEyebrow || isGroupTitle ? upperCased(child, runs) : runs,
      })
    )
  }
  return [panel(inner, C.darkCard, 300), new Paragraph({ spacing: { after: 220 }, children: [] })]
}

function upperCased(el: HTMLElement, fallback: InlineChild[]): InlineChild[] {
  const text = textOf(el)
  if (!text) return fallback
  return [
    new TextRun({
      text: text.toUpperCase(),
      font: FONT,
      bold: true,
      size: 17,
      color: C.lightPurple,
      characterSpacing: 20,
    }),
  ]
}

/**
 * A div/span with no block children — the house style uses these for eyebrows,
 * mini-labels and standalone values. Style from whichever the class hints at.
 */
function leafParagraph(el: HTMLElement): Paragraph | null {
  const cls = classOf(el)
  const text = textOf(el)
  if (!text) return null

  const isEyebrow = /eyebrow|mini|doc-details-label|toc-eyebrow/.test(cls)
  const isLabel = /(^|[^a-z])label|fe-label|sig-label|date-label/.test(cls)

  if (isEyebrow) return eyebrow(text, C.purple, 140)
  if (isLabel) {
    return new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: text.toUpperCase(),
          font: FONT,
          size: 14,
          color: C.muted,
          characterSpacing: 20,
        }),
      ],
    })
  }
  return bodyParagraph(runsOf(el, { color: C.body, size: 21 }))
}

// ───────────────────────────────────────────────────────────── the export ────

/** Right-hand footer text: the source document's own, else the doc title. */
function footerRightText(root: HTMLElement, title: string): string {
  const footer = root.querySelector("[class*=footer]")
  if (footer) {
    const parts = footer.childNodes.filter(isElement).map(textOf).filter(Boolean)
    if (parts.length > 1) return parts[parts.length - 1]
  }
  return title
}

/** Convert a complete design-document HTML string into .docx bytes. */
export async function designDocToDocx(html: string, title: string): Promise<Uint8Array> {
  const root = parse(html)
  const body = root.querySelector("body") ?? root
  const children = walk(body)

  const doc = new Document({
    creator: "Fruition Services",
    title,
    styles: {
      default: {
        document: { run: { font: FONT, size: 21, color: C.body } },
      },
    },
    numbering: {
      config: [
        {
          reference: BULLET_REF,
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: {
                run: { color: C.purple },
                paragraph: { indent: { left: 360, hanging: 220 } },
              },
            },
          ],
        },
        {
          reference: NUMBER_REF,
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 360, hanging: 220 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertMillimetersToTwip(18),
              right: convertMillimetersToTwip(16),
              bottom: convertMillimetersToTwip(20),
              left: convertMillimetersToTwip(16),
              footer: convertMillimetersToTwip(10),
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.hairline } },
                tabStops: [
                  { type: AlignmentType.RIGHT, position: 9070 }, // right page edge
                ],
                spacing: { before: 120 },
                children: [
                  new TextRun({
                    text: "Fruition Services — Confidential",
                    font: FONT,
                    size: 16,
                    color: C.muted,
                  }),
                  new TextRun({ text: "\t", font: FONT }),
                  new TextRun({
                    text: `${footerRightText(root, title)}   `,
                    font: FONT,
                    size: 16,
                    color: C.muted,
                  }),
                  new TextRun({ text: "", font: FONT, size: 16, color: C.muted, children: [] }),
                  new TextRun({
                    children: [PageNumber.CURRENT, " / ", PageNumber.TOTAL_PAGES],
                    font: FONT,
                    size: 16,
                    color: C.muted,
                  }),
                ],
              }),
            ],
          }),
        },
        children: children.length ? children : [new Paragraph("")],
      },
    ],
  })

  return Packer.toBuffer(doc)
}
