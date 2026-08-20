/**
 * Body images: what a paste/drag offers, and what survives to Portable Text.
 *
 * Two halves of one bug (monday item 2836162069 — "images are replaced with
 * the links"):
 *
 * - Reading the payload. Copying an image out of a monday item puts the *item
 *   permalink* on the clipboard as `text/plain`, so anything that reads the
 *   plain text first inserts a link to the board instead of the picture. The
 *   HTML flavour has to win.
 * - Writing the post. bodyToPortableText only turns a lone `![alt](url)` line
 *   into an `image` block when the URL is a Sanity asset; every other host
 *   used to fall through to the inline parser and render as a literal `!`
 *   followed by a link on the live site. Four published posts were affected.
 */
import { describe, expect, it } from "vitest"
import {
  altFromFilename,
  dragHasImage,
  imagesFrom,
  loneImageRefFrom,
  looksLikeImageUrl,
} from "@/lib/blogImagePaste"
import { bodyToPortableText, loneMarkdownImage } from "@/lib/sanityWriteClient"

/** jsdom has no DataTransfer, and the real one can't be built with data anyway. */
function payload(types: Record<string, string>, files: File[] = []): DataTransfer {
  return {
    types: [...(files.length ? ["Files"] : []), ...Object.keys(types)],
    files: files as unknown as FileList,
    getData: (t: string) => types[t] ?? "",
  } as unknown as DataTransfer
}

function imageFile(name: string, type = "image/png"): File {
  return new File([new Uint8Array([1, 2, 3])], name, { type })
}

const MONDAY_IMG =
  "https://fruitionservices.monday.com/protected_static/16620244/resources/85576200/image.png"
const MONDAY_PULSE =
  "https://fruitionservices.monday.com/boards/1865338949/views/50272297/pulses/2836162069"

describe("reading images off a clipboard or drag", () => {
  it("takes the image files when there are any", () => {
    const got = imagesFrom(payload({}, [imageFile("dropped_diagram.png")]))
    expect(got).toEqual([{ file: expect.any(File), alt: "dropped diagram" }])
  })

  it("ignores non-image files", () => {
    expect(imagesFrom(payload({}, [imageFile("notes.pdf", "application/pdf")]))).toEqual([])
  })

  it("takes every image of a multi-file drag", () => {
    const got = imagesFrom(payload({}, [imageFile("one.png"), imageFile("two.jpg", "image/jpeg")]))
    expect(got.map((i) => i.alt)).toEqual(["one", "two"])
  })

  // The monday case: the plain-text flavour is a link to the board, so reading
  // it would paste a link to the item rather than the image inside it.
  it("prefers the lone <img> over a plain-text fallback pointing elsewhere", () => {
    const got = imagesFrom(
      payload({
        "text/html": `<meta charset="utf-8"><img src="${MONDAY_IMG}" alt="Board view">`,
        "text/plain": MONDAY_PULSE,
      }),
    )
    expect(got).toEqual([{ url: MONDAY_IMG, alt: "Board view" }])
  })

  it("leaves mixed rich text alone so the words still paste", () => {
    expect(
      loneImageRefFrom(
        payload({
          "text/html": '<p>A sentence with <img src="https://example.com/x.png"> in it.</p>',
          "text/plain": "A sentence with in it.",
        }),
      ),
    ).toBeNull()
  })

  it("leaves a multi-image HTML payload alone", () => {
    expect(
      loneImageRefFrom(
        payload({
          "text/html": '<img src="https://e.com/a.png"><img src="https://e.com/b.png">',
        }),
      ),
    ).toBeNull()
  })

  it("takes a bare image URL, with no alt to guess from", () => {
    expect(imagesFrom(payload({ "text/plain": "https://e.com/photo.jpeg?w=800" }))).toEqual([
      { url: "https://e.com/photo.jpeg?w=800", alt: "" },
    ])
  })

  it("ignores an ordinary link", () => {
    expect(imagesFrom(payload({ "text/plain": "https://fruitionservices.io/pricing" }))).toEqual([])
    expect(imagesFrom(payload({ "text/plain": MONDAY_PULSE }))).toEqual([])
  })

  it("reads the first real entry of a uri-list", () => {
    expect(
      imagesFrom(payload({ "text/uri-list": "# comment\nhttps://e.com/a.png\nhttps://e.com/b.png" })),
    ).toEqual([{ url: "https://e.com/a.png", alt: "" }])
  })

  it("recognises extension-less image hosts", () => {
    // monday assets have no extension; a bare word or a data: URL is not a fetchable image.
    expect(looksLikeImageUrl(MONDAY_IMG.replace("/image.png", "/thumb"))).toBe(true)
    expect(looksLikeImageUrl("data:image/png;base64,AAA")).toBe(false)
    expect(looksLikeImageUrl("photo.png")).toBe(false)
  })

  it("only lights up the drop target for payloads it would take", () => {
    expect(dragHasImage(payload({}, [imageFile("a.png")]))).toBe(true)
    expect(dragHasImage(payload({ "text/uri-list": "https://e.com/a.png" }))).toBe(true)
    // An internal ProseMirror drag carries html/plain and must not be claimed.
    expect(dragHasImage(payload({ "text/html": "<p>x</p>", "text/plain": "x" }))).toBe(false)
    expect(dragHasImage(null)).toBe(false)
  })

  it("turns a filename into a usable first draft of the alt", () => {
    expect(altFromFilename("board-view_2026.PNG")).toBe("board view 2026")
    expect(altFromFilename("screenshot")).toBe("screenshot")
  })
})

describe("body images reaching Portable Text", () => {
  const SANITY = "https://cdn.sanity.io/images/bt6nb58h/production/abc123-1024x853.png"

  it("reads a lone markdown image, title and all", () => {
    expect(loneMarkdownImage(`![Alt here](${SANITY})`)).toEqual({ alt: "Alt here", url: SANITY })
    expect(loneMarkdownImage(`![](${SANITY} "a title")`)).toEqual({ alt: "", url: SANITY })
    expect(loneMarkdownImage(`text ![Alt](${SANITY})`)).toBeNull()
  })

  it("makes an image block out of a Sanity asset", () => {
    const [block] = bodyToPortableText(`![A board](${SANITY})`)
    expect(block).toMatchObject({
      _type: "image",
      alt: "A board",
      asset: { _ref: "image-abc123-1024x853-png" },
    })
  })

  it("still makes one when the URL carries a transform query", () => {
    const [block] = bodyToPortableText(`![A board](${SANITY}?w=800)`)
    expect(block).toMatchObject({ _type: "image", asset: { _ref: "image-abc123-1024x853-png" } })
  })

  // The regression itself: this used to emit a block reading "!" plus a link.
  it("drops a remote image rather than publishing it as a link", () => {
    const blocks = bodyToPortableText(
      [
        "Intro paragraph.",
        "",
        "![Construction Management Software - monday.com](https://dapulse-res.cloudinary.com/image/upload/x.png)",
        "",
        "Closing paragraph.",
      ].join("\n"),
    )
    expect(blocks.map((b) => b._type)).toEqual(["block", "block"])
    const text = JSON.stringify(blocks)
    expect(text).not.toContain("dapulse-res")
    expect(text).not.toContain('"text":"!"')
  })

  it("leaves an exclamation-mark sentence alone", () => {
    const [block] = bodyToPortableText("!Not an image [link](https://e.com) at all")
    expect(block._type).toBe("block")
  })
})
