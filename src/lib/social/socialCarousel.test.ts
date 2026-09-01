/**
 * Regression cover for the bug where a multi-image post published as a single
 * picture on Instagram while LinkedIn and Facebook showed the whole set.
 *
 * The pipeline used to carry ONE image per channel end to end: the composer
 * stored `mediaUrl`, the publish route read `mediaUrl`, and the Zernio request
 * carried a one-entry `mediaItems`. Instagram builds a carousel out of the
 * items it is sent, so a set of images arrived as its first frame.
 *
 * These tests pin the list all the way through: what a channel resolves to,
 * what validation allows, and what actually goes on the wire.
 */
import { describe, expect, it } from "vitest"
import {
  imagesFor,
  instagramSafeImageUrl,
  mediaItemsFor,
  platformSpec,
} from "@/lib/social/zernio"
import { effectiveMedia, mediaUrlsOf, type CompositionPlatform } from "@/lib/social/composition"
import { problemsFor } from "@/lib/social/validate"

const A = "https://cdn.example.com/a.jpg"
const B = "https://cdn.example.com/b.jpg"
const C = "https://cdn.example.com/c.jpg"

const instagram = platformSpec("instagram")
const linkedin = platformSpec("linkedin")
const reddit = platformSpec("reddit")

describe("imagesFor", () => {
  it("keeps every image, in order, for a carousel channel", () => {
    expect(imagesFor(instagram, [A, B, C])).toEqual([A, B, C])
  })

  it("caps at what the channel publishes", () => {
    const many = Array.from({ length: 14 }, (_, i) => `https://cdn.example.com/${i}.jpg`)
    expect(imagesFor(instagram, many)).toHaveLength(instagram.maxMedia)
    expect(imagesFor(instagram, many)[0]).toBe(many[0])
  })

  it("leaves a single-image channel with one image", () => {
    expect(imagesFor(linkedin, [A, B, C])).toEqual([A])
  })

  it("drops duplicates and blanks rather than sending them", () => {
    expect(imagesFor(instagram, [A, "", A, B])).toEqual([A, B])
  })

  it("returns nothing for a text-only channel", () => {
    expect(imagesFor(reddit, [A, B])).toEqual([])
  })
})

describe("mediaItemsFor", () => {
  it("sends every Instagram image, which is what makes it a carousel", () => {
    const items = mediaItemsFor(instagram, { imageUrls: [A, B, C] })
    expect(items).toHaveLength(3)
    expect(items?.map((m) => m.url)).toEqual([A, B, C])
    expect(items?.every((m) => m.type === "image")).toBe(true)
  })

  it("crops each Instagram image into the accepted aspect range, not just the first", () => {
    const wide = "https://cdn.sanity.io/images/p/dataset/abc-1200x627.png"
    const items = mediaItemsFor(instagram, { imageUrls: [wide, wide.replace("abc", "def")] })
    expect(items).toHaveLength(2)
    for (const item of items!) expect(item.url).toBe(instagramSafeImageUrl(item.url.split("?")[0]))
    expect(items!.every((m) => m.url.includes("fit=crop"))).toBe(true)
  })

  it("titles only the first frame, so the caption names the post not the picture", () => {
    const items = mediaItemsFor(instagram, { imageUrls: [A, B] }, "Post name")
    expect(items?.[0].title).toBe("Post name")
    expect(items?.[1].title).toBeUndefined()
  })

  it("keeps LinkedIn on one image", () => {
    expect(mediaItemsFor(linkedin, { imageUrls: [A, B, C] })).toEqual([{ type: "image", url: A }])
  })

  it("still lets a LinkedIn PDF displace the images entirely", () => {
    const items = mediaItemsFor(linkedin, {
      imageUrls: [A, B],
      documentUrl: "https://cdn.example.com/deck.pdf",
      documentName: "Deck",
    })
    expect(items).toEqual([{ type: "document", url: "https://cdn.example.com/deck.pdf", title: "Deck" }])
  })

  it("omits the field entirely when there is nothing to attach", () => {
    expect(mediaItemsFor(instagram, { imageUrls: [] })).toBeUndefined()
    expect(mediaItemsFor(instagram, {})).toBeUndefined()
  })
})

describe("mediaUrlsOf", () => {
  it("reads a list written by the current composer", () => {
    expect(mediaUrlsOf({ content: "", mediaUrls: [A, B] })).toEqual([A, B])
  })

  it("folds a legacy single mediaUrl row into a list", () => {
    expect(mediaUrlsOf({ content: "", mediaUrl: A } as CompositionPlatform)).toEqual([A])
  })

  it("keeps deliberate-no-image apart from no-choice-made", () => {
    expect(mediaUrlsOf({ content: "", mediaUrl: "" } as CompositionPlatform)).toEqual([])
    expect(mediaUrlsOf({ content: "" })).toBeUndefined()
  })
})

describe("effectiveMedia", () => {
  it("publishes the channel's own list, not just its first image", () => {
    expect(effectiveMedia({ content: "", mediaUrls: [A, B, C] }, undefined, instagram)).toEqual([A, B, C])
  })

  it("falls back to what is already on the Zernio draft when nothing was chosen", () => {
    expect(effectiveMedia({ content: "" }, { postId: "p1", status: "draft", mediaUrls: [A, B] }, instagram)).toEqual([
      A,
      B,
    ])
  })

  it("lets a PDF displace the images", () => {
    const draft: CompositionPlatform = { content: "", mediaUrls: [A, B], documentUrl: "https://x/d.pdf" }
    expect(effectiveMedia(draft, undefined, linkedin)).toEqual([])
  })
})

describe("problemsFor", () => {
  const constraints = { label: "Instagram", limit: 2200, needsMedia: true, supportsMedia: true, maxMedia: 10 }

  it("passes a carousel", () => {
    expect(problemsFor(constraints, { content: "hi", mediaUrls: [A, B, C] })).toEqual([])
  })

  it("still blocks Instagram with no image at all", () => {
    expect(problemsFor(constraints, { content: "hi", mediaUrls: [] })).toEqual([
      "Instagram: an image is required.",
    ])
  })

  it("blocks rather than silently dropping frames past the channel limit", () => {
    const many = Array.from({ length: 11 }, (_, i) => `https://cdn.example.com/${i}.jpg`)
    expect(problemsFor(constraints, { content: "hi", mediaUrls: many })).toEqual([
      "Instagram: 11 images is more than the 10 it can publish.",
    ])
  })

  it("keeps a text-only channel text-only", () => {
    const text = { label: "Reddit", limit: 10, needsMedia: false, supportsMedia: false, maxMedia: 0 }
    expect(problemsFor(text, { content: "hi", mediaUrls: [A] })).toEqual(["Reddit: this channel is text-only."])
  })
})
