/**
 * A channel's images have to survive the round trip through a save.
 *
 * The regression this guards: the composer picks images per channel and sends
 * them as `mediaUrls`, but the save path only ever read the pre-carousel
 * `mediaUrl`. Every picture chosen for Instagram was dropped on the way into
 * the database, so the post published with the wrong media or none at all.
 */
import { describe, expect, it } from "vitest"
import { mediaUrlsOf, platformsFromInput } from "@/lib/social/composition"

const A = "https://cdn.sanity.io/images/p/production/aaa-1080x1350.png"
const B = "https://cdn.sanity.io/images/p/production/bbb-1080x1350.png"

describe("platformsFromInput", () => {
  it("keeps the carousel a channel was given", () => {
    const parsed = platformsFromInput({ instagram: { content: "hi", mediaUrls: [A, B] } })
    expect(parsed?.instagram?.mediaUrls).toEqual([A, B])
  })

  it("keeps the order, because that is the order they are swiped", () => {
    const parsed = platformsFromInput({ instagram: { content: "hi", mediaUrls: [B, A] } })
    expect(mediaUrlsOf(parsed!.instagram!)).toEqual([B, A])
  })

  it("still reads a client that sends the single pre-carousel url", () => {
    const parsed = platformsFromInput({ linkedin: { content: "hi", mediaUrl: A } })
    expect(mediaUrlsOf(parsed!.linkedin!)).toEqual([A])
  })

  it("keeps a deliberate none apart from no choice at all", () => {
    const none = platformsFromInput({ instagram: { content: "hi", mediaUrls: [] } })
    expect(mediaUrlsOf(none!.instagram!)).toEqual([])
    const unset = platformsFromInput({ instagram: { content: "hi" } })
    expect(mediaUrlsOf(unset!.instagram!)).toBeUndefined()
  })

  it("drops junk entries rather than sending them to Zernio", () => {
    const parsed = platformsFromInput({
      instagram: { content: "hi", mediaUrls: [A, "", 7, null, B] },
    })
    expect(parsed?.instagram?.mediaUrls).toEqual([A, B])
  })

  it("ignores platform keys it does not know", () => {
    const parsed = platformsFromInput({ myspace: { content: "hi", mediaUrls: [A] } })
    expect(parsed).toEqual({})
  })

  it("returns undefined when there is nothing to read", () => {
    expect(platformsFromInput(undefined)).toBeUndefined()
    expect(platformsFromInput("nope")).toBeUndefined()
  })
})
