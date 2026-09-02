import { describe, it, expect } from "vitest"
import { readableContent } from "./social"

describe("readableContent", () => {
  // LinkedIn stores mentions as @[Name](urn:li:organization:123). Left raw, the
  // top-posts list reads as URNs rather than post text.
  it("keeps the display name and drops the urn", () => {
    expect(readableContent("@[Fruition](urn:li:organization:91348738) India merger")).toBe(
      "@Fruition India merger",
    )
  })

  it("handles several mentions in one post", () => {
    expect(
      readableContent("@[monday.com](urn:li:organization:2525169) and @[Fruition](urn:li:person:abc) ship"),
    ).toBe("@monday.com and @Fruition ship")
  })

  it("collapses the whitespace that survives a paste", () => {
    expect(readableContent("line one\n\n  line two\t")).toBe("line one line two")
  })

  it("leaves ordinary text alone", () => {
    expect(readableContent("Just a quick question")).toBe("Just a quick question")
  })
})
