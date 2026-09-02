import { describe, expect, it } from "vitest"
import { buildVideoObject } from "./videoObject"
import { GENERATED_VIDEO_CATALOG } from "./videoCatalog.generated"

// The video Search Console flagged: monday-for-manufacturing's hero embed,
// which the page titles "Manufacturing on monday.com: Fruition".
const MANUFACTURING_ID = "ug5TyvMd-3Y"

describe("buildVideoObject", () => {
  it("emits uploadDate for a catalogued video", () => {
    const obj = buildVideoObject({ id: MANUFACTURING_ID, title: "Manufacturing on monday.com: Fruition" })
    expect(obj).toMatchObject({
      "@type": "VideoObject",
      name: "Manufacturing on monday.com: Fruition",
      uploadDate: GENERATED_VIDEO_CATALOG[MANUFACTURING_ID].uploadDate,
      embedUrl: `https://www.youtube.com/embed/${MANUFACTURING_ID}`,
    })
    expect(typeof obj?.description).toBe("string")
  })

  it("emits nothing rather than markup missing uploadDate", () => {
    // An id that is not in the catalog — the state that produced
    // `Missing field "uploadDate"` in Search Console.
    expect(buildVideoObject({ id: "notInCatalog1", title: "A real title" })).toBeNull()
  })

  it("still emits when the caller supplies its own uploadDate", () => {
    const obj = buildVideoObject({
      id: "notInCatalog1",
      title: "A real title",
      uploadDate: "2024-01-02T03:04:05Z",
    })
    expect(obj).toMatchObject({ uploadDate: "2024-01-02T03:04:05Z" })
  })

  it("falls back to the catalog title for placeholder titles", () => {
    // BlogPostTemplate numbers unnamed embeds "Video 1", "Video 2", …
    for (const placeholder of ["Video", "video", "Video 2", "YouTube video"]) {
      const obj = buildVideoObject({ id: MANUFACTURING_ID, title: placeholder })
      expect(obj?.name).toBe(GENERATED_VIDEO_CATALOG[MANUFACTURING_ID].name)
    }
  })

  it("keeps every catalog entry valid for Google", () => {
    for (const [id, entry] of Object.entries(GENERATED_VIDEO_CATALOG)) {
      expect(entry.name.length, id).toBeGreaterThan(0)
      // ISO 8601 with an offset — Google wants the time zone included.
      expect(entry.uploadDate, id).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/)
      if (entry.duration) expect(entry.duration, id).toMatch(/^PT(\d+H)?(\d+M)?(\d+S)?$/)
    }
  })
})
