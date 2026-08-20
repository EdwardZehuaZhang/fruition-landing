# Blurred blog images — what happened and how to fix them

## The bug

Wix server-renders `<img src>` with a lazy-load **placeholder**: a 49px or 147px
crop with a gaussian blur baked in (`…/v1/fill/w_147,h_83,…,blur_2/…`). The real
image sits behind the same media id, one URL rewrite away.

Two scrapers took that `src` at face value:

| script | what it did | result |
| --- | --- | --- |
| `scripts/import-blog.ts` | uploaded `img.src` verbatim | body images stored at 147×83 / 49×25 |
| `scripts/migrate-blog-images.ts` | rewrote `w_`/`h_` **only inside a `fill` transform** | silently a no-op for `fit` and `crop` URLs |

Covers escaped because they come from `og:image`, which Wix already serves at
full size. That is why a post can have a crisp header and blurred screenshots
below it.

Those assets are then rendered into the 740px article column
(`BlogPostTemplate.tsx`), so a 147px image is upscaled 5×. The blur is in the
stored pixels — no render-side change can undo it.

## The damage (audit, August 2026)

248 posts (234 published), 652 image references.

| | covers | body images | total |
| --- | --- | --- | --- |
| references | 247 | 405 | 652 |
| under 740px — **visibly blurry** | 12 | 99 | **111** |
| under 1480px — soft on a 2× display | 200 | 348 | 548 |

- 94 of the 99 bad body images are under 200px — straight Wix placeholders.
- They cluster in **16 posts**; `monday-crm-service-2026-roadmap` has 12.
- **214 posts** kept the original Wix URL in `coverImageUrl`, so their covers are
  recoverable from data we already hold (11 of the 12 blurry covers included).
- No body image kept its source URL — those recover from an archived copy of the
  Wix post page.

## The fix

```bash
npx tsx scripts/fix-blurry-blog-images.ts                 # audit only, no writes
npx tsx scripts/fix-blurry-blog-images.ts --plan          # resolve replacements, still no writes
npx tsx scripts/fix-blurry-blog-images.ts --apply         # upload + repoint the references
```

`--plan` is worth reading before `--apply`: it reports, per image, whether a
larger original was found, fetched and decoded. Run `--apply` for one post first
(`--only monday-crm-service-2026-roadmap`) and eyeball the result.

How it recovers each image:

1. **`coverImageUrl`** → strip the Wix transform → the full-resolution upload.
   Covers only, no external crawl needed.
2. **Archived Wix post page** → every `<img>`/`<wow-image>` in the post body,
   normalised the same way. Defaults to the Wayback Machine pinned to before the
   site left Wix (`--before`, default `20260301`) — captures after that are of
   the *new* site and carry the blurred images we are replacing. If the old Wix
   site is still reachable anywhere, point at it with `--source-base` instead and
   skip the archive entirely.

Images are matched to slots by alt text first, then by the scrape order recorded
in each asset's filename (`<slug>-body-7`).

Nothing is written unless the replacement downloads, decodes, and is
meaningfully wider than what is already there — a failed recovery leaves the
post exactly as it was. Alt text, captions and `_key`s never move; only
`asset._ref` does. Re-running is safe: repaired images no longer match the
filter.

Whatever the archive cannot supply has to be re-shot by hand. `--report out.json`
lists those as `unresolved`.

## Why it cannot happen again

- `src/lib/wixImage.ts` — one place that knows how to turn any Wix media URL
  into its original. Unit-tested against the real placeholder shapes.
- `scripts/html-to-portable-text.ts` now prefers the widest `srcset` candidate
  and pipes every URL through it.
- Both ingest scripts refuse any image that decodes narrower than 400px
  (`src/lib/imageSize.ts`), whatever the URL claimed.

## Related, not fixed here

272 image assets under 400px are referenced from non-blog documents (page
builder blocks, logo sets, site settings). Most are logos and icons that are
*meant* to be small. Auditing those needs the render size of each block, not a
single column width, so it is a separate job.
