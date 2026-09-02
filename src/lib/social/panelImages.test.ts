/**
 * The image library a blog's social drafts are picked from.
 *
 * The regression this guards: the panel offered the article's pictures and
 * nothing else, so an image uploaded for one channel was invisible to the rest
 * of the panel and disappeared from the picker on the next load. An article
 * still being written has no pictures at all, which left the card asking for
 * an image it gave you no way to provide.
 */
import { describe, expect, it } from "vitest"
import { panelImageLibrary } from "@/lib/social/panelImages"

const COVER = "https://cdn.sanity.io/images/p/production/cover-1200x800.jpg"
const BODY = "https://cdn.sanity.io/images/p/production/body-1080x1080.jpg"
const UPLOAD = "https://cdn.sanity.io/images/p/production/social-upload-1080x1350.png"

describe("panelImageLibrary", () => {
  it("keeps the article's images first, in the order they were given", () => {
    expect(panelImageLibrary([COVER, BODY], [], [])).toEqual([COVER, BODY])
  })

  it("offers an image that only exists on a draft, so an upload survives a reload", () => {
    expect(panelImageLibrary([COVER], [], [UPLOAD])).toEqual([COVER, UPLOAD])
  })

  it("still has something to offer when the article has no pictures yet", () => {
    expect(panelImageLibrary([], [], [UPLOAD])).toEqual([UPLOAD])
  })

  it("shows an image once however many drafts carry it", () => {
    expect(panelImageLibrary([COVER], [COVER], [COVER, UPLOAD, UPLOAD])).toEqual([COVER, UPLOAD])
  })

  it("drops the gaps a draft with no media leaves behind", () => {
    expect(panelImageLibrary([COVER], [], [undefined, "", UPLOAD])).toEqual([COVER, UPLOAD])
  })

  it("is empty when there is nothing anywhere", () => {
    expect(panelImageLibrary([], [], [])).toEqual([])
    expect(panelImageLibrary()).toEqual([])
  })
})
