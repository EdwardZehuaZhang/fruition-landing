# Blurred blog images — what happened, what was recoverable, what was not

## The bug

Wix server-renders `<img src>` with a lazy-load **placeholder**: a 49px or 147px
crop with a gaussian blur baked in (`…/v1/fill/w_147,h_83,…,blur_2/…`). The real
image sat behind the same media id, one URL rewrite away.

Two scrapers took that `src` at face value:

| script | what it did | result |
| --- | --- | --- |
| `scripts/migrate-blog-images.ts` | rewrote `w_`/`h_` **only inside a `fill` transform** — a silent no-op for the other transform shapes | the 90 placeholder body images, all named `<slug>-body-N` |
| `scripts/import-blog.ts` | uploaded `img.src` verbatim | the handful of `<slug>-img-N` images at 480–717px |

Covers mostly escaped because they come from `og:image`, which Wix already
serves at full size — which is why a post can have a crisp header and blurred
screenshots below it.

Those assets were then stretched across the 740px article column, so a 147px
image was upscaled 5×.

## The damage (audit, August 2026)

248 posts (234 published), 652 image references.

| | covers | body images | total |
| --- | --- | --- | --- |
| references | 247 | 405 | 652 |
| under 740px — **visibly blurry** | 12 | 99 | **111** |
| under 1480px — soft on a 2× display | 200 | 348 | 548 |

94 of the 99 bad body images are under 200px — straight Wix placeholders,
clustered in 15 published posts.

## What could actually be recovered: almost nothing

A full `--plan` pass ran on a GitHub Actions runner
(`.github/workflows/blog-image-repair.yml`, run
[32423257510](https://github.com/Fruition-Service/fruition-website-monorepo/actions/runs/32423257510)).
Of 625 images checked and 527 below the sharpness target:

| outcome | images |
| --- | --- |
| a better source exists | **17** — *all covers* |
| already the best source available | 155 |
| no source found | 355 |
| fetch failed | 0 |

**The Wayback Machine never captured the Wix post pages.** 54 posts were probed
and every one came back `no archived copy`. Body images kept no source URL of
their own, so with no archived page there is nothing left to point at — the
original pixels are gone.

Sources ruled out, so nobody repeats the search:

- **Wayback Machine** — no captures of `/post/*`.
- **A live Wix mirror** — none; the domain now serves the Next.js site, and its
  images are the blurred Sanity ones.
- **`coverImageUrl`** — covers only. This is where all 17 recoveries come from,
  and only 2 of those are images that were actually blurry; the rest are covers
  going from 1000–1200px to 2×.
- **Repo artifacts** (`scripts/extracted-content.json` and friends) — no Wix
  media URLs survive anywhere in the repo.
- **monday.com** — no `blogPost` carries a `mondayItemId`, so there is no item
  to pull attachments from.
- **Search-engine image indexes** — re-crawled; they now return the current
  `cdn.sanity.io` URLs, not the Wix originals.

## What was done instead

**1. Stop upscaling.** `articleImageProps()` in `src/sanity/image.ts` reads the
intrinsic size off the asset reference (no network call) and lays an image out
at its own width when it cannot fill the column — small, but sharp. It also
stops asking the CDN for more pixels than the asset holds, which removes the
same softness for the 548 images sitting between column width and 2×.
Column-width and wider images render exactly as before.

This does not put lost detail back. It stops a 147px thumbnail being blown up
5× and presented as a hero.

**2. The 17 real recoveries** are one workflow run away — see below.

**3. The rest need new screenshots.** The worklist is at the end of this file.

## Running the repair

Use the workflow — **Actions → Blog image repair → Run workflow**. `plan` is
read-only and needs no credentials; `apply` needs a `SANITY_WRITE_TOKEN` repo
secret (Settings → Secrets and variables → Actions) and fails fast without one.

Locally, if you have the token in `.env.local`:

```bash
npx tsx scripts/fix-blurry-blog-images.ts                 # audit only, no writes
npx tsx scripts/fix-blurry-blog-images.ts --plan          # resolve replacements, still no writes
npx tsx scripts/fix-blurry-blog-images.ts --apply         # upload + repoint the references
```

Nothing is written unless the replacement downloads, decodes, and is
meaningfully wider than what is already there — a failed recovery leaves the
post exactly as it was. Alt text, captions and `_key`s never move; only
`asset._ref` does. Re-running is safe.

If the old Wix site ever turns out to be reachable somewhere, `--source-base
<url>` skips the archive and everything below becomes recoverable again. That is
the one thing that would change this outcome.

## Why it cannot happen again

- `src/lib/wixImage.ts` — one place that knows how to turn any Wix media URL
  into its original. Unit-tested against the real placeholder shapes.
- `scripts/html-to-portable-text.ts` prefers the widest `srcset` candidate and
  pipes every URL through it.
- Both ingest scripts refuse any image that decodes narrower than 400px
  (`src/lib/imageSize.ts`), whatever the URL claimed.

## Worklist — images that need re-shooting

94 body images across 15 published posts. Alt text is given because it says what
each screenshot was of; the filename records the position it held in the
original post.

| post | images | sizes |
| --- | --- | --- |
| `ai-call-recording-apps` | 13 | 49–147px |
| `monday-crm-service-2026-roadmap` | 12 | 147px |
| `australian-standards-for-building-materials-with-mondaycom` | 11 | 49–147px |
| `monday-ai-work-management-updates-2026` | 9 | 147px |
| `5-mondaycom-consultants-us` | 8 | 49–147px |
| `makecom-use-cases-multi-step-logic` | 8 | 49–147px |
| `ai-agent-playbook-deploy-without-draining-budget` | 7 | 49–147px |
| `build-buy-orchestrate-enterprise-ai-vendor-decision-2026` | 7 | 49–147px |
| `mondaycom-agile-sprint-management` | 6 | 49–147px |
| `change-management-for-software-new-tool-fatigue` | 4 | 49–147px |
| `mondaycom-ai-feature-prioritisation-risk-detection` | 4 | 49–147px |
| `monday-ai-pricing-model-2026` | 2 | 568px |
| `scoro-vs-monday-com` | 1 | 717px |
| `ai-consulting-firm-8-factors-to-consider` | 1 | 700px |
| `manage-purchase-orders-in-mondaycom` | 1 | 480px |

The bottom four rows are only mildly undersized (480–717px against a 740px
column) and now render at their own width, so they read as slightly small rather
than blurry. The 90 images at 49–147px are the ones worth re-shooting.

To regenerate this list at any time:

```groq
*[_type=="blogPost" && count(body[_type=="image" && asset->metadata.dimensions.width < 740]) > 0]{
  "slug": slug.current,
  "bad": body[_type=="image" && asset->metadata.dimensions.width < 740]{
    alt, "w": asset->metadata.dimensions.width, "file": asset->originalFilename
  }
}
```

## Related, not fixed here

272 image assets under 400px are referenced from non-blog documents (page
builder blocks, logo sets, site settings). Most are logos and icons that are
*meant* to be small. Auditing those needs the render size of each block, not a
single column width, so it is a separate job.
