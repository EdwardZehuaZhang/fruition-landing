import { describe, expect, it } from "vitest"
import { withImage } from "@/lib/social/carousel"
import { imagesForPlatform, platformSpec } from "@/lib/social/zernio"
import { problemsFor, type PlatformConstraints } from "@/lib/social/validate"

const instagram = platformSpec("instagram")
const gbp = platformSpec("gbp-au")
const reddit = platformSpec("reddit")

function constraints(over: Partial<PlatformConstraints> = {}): PlatformConstraints {
  return {
    label: "Instagram",
    limit: 2200,
    needsMedia: true,
    supportsMedia: true,
    maxMedia: 10,
    ...over,
  }
}

describe("imagesForPlatform", () => {
  it("sends every image a carousel channel was given, in order", () => {
    const urls = ["https://x.test/a.jpg", "https://x.test/b.jpg", "https://x.test/c.jpg"]
    expect(imagesForPlatform(instagram, urls)).toEqual(urls)
  })

  it("keeps a single-image channel at one", () => {
    expect(imagesForPlatform(gbp, ["https://x.test/a.jpg", "https://x.test/b.jpg"])).toEqual([
      "https://x.test/a.jpg",
    ])
  })

  it("trims a carousel to the platform cap", () => {
    const urls = Array.from({ length: 14 }, (_, i) => `https://x.test/${i}.jpg`)
    expect(imagesForPlatform(instagram, urls)).toHaveLength(10)
  })

  it("drops duplicates and blanks", () => {
    expect(imagesForPlatform(instagram, ["https://x.test/a.jpg", "", "https://x.test/a.jpg"])).toEqual([
      "https://x.test/a.jpg",
    ])
  })

  it("attaches nothing to a text-only channel", () => {
    expect(imagesForPlatform(reddit, ["https://x.test/a.jpg"])).toEqual([])
  })

  it("crops each Instagram slide into the accepted aspect range", () => {
    const wide = "https://cdn.sanity.io/images/p/d/abc-1200x627.png"
    const [cropped] = imagesForPlatform(instagram, [wide])
    expect(cropped).toContain("fit=crop")
    expect(cropped).toContain("fm=jpg")
  })
})

describe("withImage", () => {
  it("appends on a carousel channel, so the pick order is the swipe order", () => {
    expect(withImage(["a"], "b", 10)).toEqual(["a", "b"])
  })

  it("replaces on a single-image channel", () => {
    expect(withImage(["a"], "b", 1)).toEqual(["b"])
  })

  it("refuses to go past the cap rather than dropping a slide", () => {
    const full = Array.from({ length: 10 }, (_, i) => String(i))
    expect(withImage(full, "extra", 10)).toEqual(full)
  })

  it("ignores an image the channel already carries", () => {
    expect(withImage(["a", "b"], "a", 10)).toEqual(["a", "b"])
  })
})

describe("problemsFor media rules", () => {
  it("passes an Instagram carousel", () => {
    expect(problemsFor(constraints(), { content: "hello", mediaUrls: ["a", "b", "c"] })).toEqual([])
  })

  it("still requires at least one image where the platform demands it", () => {
    expect(problemsFor(constraints(), { content: "hello", mediaUrls: [] })).toEqual([
      "Instagram: an image is required.",
    ])
  })

  it("blocks more images than the channel takes", () => {
    const problems = problemsFor(
      constraints({ label: "Google Business AU", maxMedia: 1, needsMedia: false }),
      { content: "hello", mediaUrls: ["a", "b"] },
    )
    expect(problems).toEqual(["Google Business AU: takes one image, and 2 are attached."])
  })

  it("blocks an image on a text-only channel", () => {
    const problems = problemsFor(
      constraints({ label: "Reddit", needsMedia: false, supportsMedia: false, maxMedia: 0, titleRequired: true }),
      { content: "hello", title: "t", mediaUrls: ["a"] },
    )
    expect(problems).toEqual(["Reddit: this channel is text-only."])
  })
})
