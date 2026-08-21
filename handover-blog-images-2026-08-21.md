# Handover — blurred blog images

Everything that could be fixed in code is done and on PR #147
(`claude/blurred-images-older-blogs-k0zhgk`). What is left needs network and a
Sanity write token, neither of which the agent sandbox had.

**Your job is two commands.** Step 1 tells you whether this is a 10-minute fix
or a 10-minute fix plus some screenshot work.

---

## 0. Before you start

**Rotate the Sanity token.** A write token was pasted into the chat transcript in
plaintext. Treat it as compromised: revoke it at
<https://www.sanity.io/manage> → project `bt6nb58h` → API → Tokens, and issue a
fresh one with **Editor** rights.

Then, in the repo root:

```bash
git fetch origin
git checkout claude/blurred-images-older-blogs-k0zhgk
npm ci
```

Put the **new** token in `.env.local` (git-ignored):

```
SANITY_WRITE_TOKEN=sk...
```

Nothing else is needed — the project id and dataset are hardcoded in
`scripts/sanity-client.ts`.

---

## 1. Find out if the old Wix site is still up ← **do this first**

You spotted `www.fruition-services.io` (hyphenated) serving `/post/<slug>`, the
old Wix URL shape. If it is still the Wix site, **every** lost screenshot is
recoverable and none need retaking. This is the single fact that decides the
size of the job.

```bash
npx tsx scripts/fix-blurry-blog-images.ts --plan \
  --source-base https://www.fruition-services.io \
  --report mirror-plan.json
```

Read-only — it writes nothing. Takes a couple of minutes.

**Interpreting it**, from the summary block at the end:

| `recoverable` | meaning | go to |
| --- | --- | --- |
| **~100+** | it *is* the Wix site. Jackpot — everything comes back | step 2a |
| **~20** | it is the new site on another domain; only covers recover | step 2b |
| **0** and lots of `fetch failed` | domain unreachable or blocking; retry with `--delay 3000` | — |

The distinction the script uses: a page only counts as a source if it actually
serves `static.wixstatic.com` media. A capture or mirror of the *new* site is
rejected, so a wrong answer here fails closed rather than writing garbage.

---

## 2a. If the mirror is the real Wix site

Do one post first and look at it on the site before doing the rest.

```bash
# one post, writes to Sanity
npx tsx scripts/fix-blurry-blog-images.ts --apply \
  --source-base https://www.fruition-services.io \
  --only monday-crm-service-2026-roadmap
```

Check <https://www.fruitionservices.io/post/monday-crm-service-2026-roadmap> —
the twelve screenshots should be sharp and full width. Sanity serves the new
asset immediately; the page may need a cache purge or a redeploy to pick it up.

Happy? Do the lot:

```bash
npx tsx scripts/fix-blurry-blog-images.ts --apply \
  --source-base https://www.fruition-services.io \
  --report applied.json
```

## 2b. If it is not the Wix site

Recover what the archives can reach — about 20 images, 17 of them covers:

```bash
npx tsx scripts/fix-blurry-blog-images.ts --plan --report plan.json   # look first
npx tsx scripts/fix-blurry-blog-images.ts --apply --report applied.json
```

This one is slow (10–30 min): it walks the Wayback Machine and Common Crawl with
rate-limit delays. The remaining ~90 images need new screenshots — see §5.

---

## 3. Verify

Re-run the audit; it needs no token and writes nothing:

```bash
npx tsx scripts/fix-blurry-blog-images.ts
```

`visibly blurry (<740px)` was **106** before any repair. Or query Sanity
directly — this is the number that matters:

```groq
{
  "coversBelowSlot": count(*[_type=="blogPost" && coverImage.asset->metadata.dimensions.width < 740]),
  "bodyBelowSlot": count(*[_type=="blogPost"].body[_type=="image" && asset->metadata.dimensions.width < 740])
}
```

Baseline was `coversBelowSlot: 12`, `bodyBelowSlot: 99`.

---

## 4. Ship the render fixes

PR #147 is green and independent of any of the above. It fixes three separate
causes of soft images:

1. **Under-sized images were stretched across the column.** A 147px scrape blown
   up to 740px is a 5× upscale. They now lay out at their true size.
2. **`quality={90}` was silently being served as 75** on *every* blog image
   since the Next 16 upgrade — `images.qualities` now declares `[75, 90]`. This
   one affects all 652 images, not just the broken ones.
3. **The scrapers** that created the placeholders now refuse any image that
   decodes narrower than 400px.

Merge it whenever; it does not depend on the data repair.

---

## 5. What no tool can fix

If step 1 said "not the Wix site", ~90 screenshots exist only as 49–147px
blurred thumbnails. Their originals are not in the Wayback Machine (the posts
were only live on Wix about five weeks and it never crawled them), not in Common
Crawl's pre-migration crawls, not in the repo, not on any monday item, and not
in search-engine image caches.

Those need retaking. The per-post worklist — slug, position, and the alt text
saying what each screenshot showed — is in
[`docs/blog-image-repair.md`](docs/blog-image-repair.md#worklist--images-that-need-re-shooting).

Once you have a replacement image, the quickest route in is Studio: open the
post at `/studio`, click the image block, upload. No script needed.

---

## 6. Safety and rollback

The script is conservative by design:

- Writes **only** when the replacement downloads, decodes, and is meaningfully
  wider than what is there. A failed recovery leaves the post untouched.
- Only `asset._ref` moves. Alt text, captions and `_key`s stay put, so nothing
  reorders and no copy changes.
- Idempotent — repaired images stop matching the filter, so re-running is safe.
- Old assets are not deleted, so a bad swap is reversible from Sanity's history
  (Studio → the document → the revision list).

`--apply` refuses to start without `SANITY_WRITE_TOKEN`, so a dry run can never
half-write.

---

## Reference

| | |
| --- | --- |
| Repair script | `scripts/fix-blurry-blog-images.ts` (`--help` lists all flags) |
| Findings, sources ruled out, worklist | `docs/blog-image-repair.md` |
| CI workflow (same thing, in Actions) | `.github/workflows/blog-image-repair.yml` |
| Branch / PR | `claude/blurred-images-older-blogs-k0zhgk` / #147 |

If you would rather run it in CI than locally: add `SANITY_WRITE_TOKEN` under
Settings → Secrets and variables → Actions, merge the PR so the workflow reaches
the default branch, then Actions → **Blog image repair** → Run workflow. Same
script, same flags, with an audit trail.

**One thing to undo before merging:** the workflow currently hardcodes
`SOURCE_BASE` to `https://www.fruition-services.io` for push-triggered runs —
that was the probe from step 1. If the mirror turns out not to be the Wix site,
set it back to `''`.
