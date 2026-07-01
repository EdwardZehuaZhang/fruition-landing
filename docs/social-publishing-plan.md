# Marketa — Social Publishing (Ayrshare) Build Plan

**Status:** Proposed · **Owners:** Edward, Nikhil · **Date:** 2026-06-18

## Goal

Cut social-post creation from ~15 hrs/week to ~5 hrs/week and expand beyond our current channels (add YouTube, Pinterest, and others). Humans move from *making* posts to *approving* them.

## Why Ayrshare

One API that posts, schedules, and pulls analytics across 13 networks — Bluesky, Facebook, Google Business, Instagram, LinkedIn, Pinterest, Reddit, Snapchat, Telegram, Threads, TikTok, X, and **YouTube**. That covers the two channels we want to add plus room to grow, without building a separate integration per platform.

**Cost:** Fruition posts on its *own* channels, so the **Premium plan (~$149/mo)** is the likely fit — it gives one company profile with all networks linked and API access. The Business plan ($499–599/mo, 30 profiles) is built for agencies managing many clients, which we don't need yet. Confirm against final channel count during setup.

## What we already have (reuse, don't rebuild)

The blog pipeline already gives us most of the plumbing:

- A **monday board** as the work surface with stage-driven automation.
- An **n8n workflow** triggered by monday stage changes (webhook → draft → write back).
- The **Sanity → Supabase RAG brain** for on-brand, grounded content.
- A working **LinkedIn post generator** (OpenRouter) — the first per-channel formatter.
- The **Slack approval pattern** (thread replies + Block Kit buttons).

Social publishing is largely a new *output stage* on top of this, not a new system.

## Proposed flow

1. **Trigger** — a new "Ready to socialise" stage (or a dedicated Social board) marks content for distribution. Source can be a published blog, a standalone idea, or a monday item.
2. **Generate per-channel variants** — n8n calls the model once per target channel using channel-specific prompts (LinkedIn long-form, X short + thread, Instagram caption + hashtags, YouTube title/description, Pinterest pin title/description). Reuses the brain for voice + the existing LinkedIn generator as the template.
3. **Human approval** — variants posted to a Slack thread (or written to monday columns) with Approve / Edit / Skip buttons per channel. Nothing publishes without a click.
4. **Publish / schedule** — on approval, n8n calls the **Ayrshare `/post` API** with the approved text, media, target platforms, and optional `scheduleDate`. Ayrshare handles the per-network mechanics.
5. **Log results** — write the Ayrshare post IDs + status back to monday; optionally pull analytics later via Ayrshare's analytics endpoints.

## Channels & formatting notes

- **LinkedIn** — already built; reuse.
- **X** — short hook; optionally a thread for longer pieces.
- **Instagram** — caption + hashtag block; requires an image/video (media pipeline needed).
- **YouTube** — title + description + tags (best for repurposing video; needs a video asset).
- **Pinterest** — pin title + description + destination link + image.

Image/video handling is the main *new* capability — text-only channels are easy; visual channels need a media source (uploaded asset, generated image, or blog hero image).

## Phased build

- **Phase 1 — Foundation (text channels).** Ayrshare account + connect channels, store `AYRSHARE_API_KEY`, add an n8n "publish via Ayrshare" node, wire the Slack approval loop. Ship with LinkedIn + X + a blog-link post. *Highest ROI, lowest complexity.*
- **Phase 2 — Visual channels.** Add Instagram + Pinterest + YouTube, plus a media step (reuse blog hero image or generate one). Per-channel formatters.
- **Phase 3 — Scheduling & analytics.** Calendar-based scheduling (post at optimal times) and an analytics pull-back into monday/Slack for reporting.

## Rough effort

- Phase 1: ~2–3 days (mostly n8n wiring + approval loop; the pattern already exists).
- Phase 2: ~3–4 days (media handling is the unknown).
- Phase 3: ~2 days.

## Decisions needed before we start

1. **Channels for v1** — which 3–4 do we launch with? (Suggest LinkedIn, X, + the blog-link post, then Pinterest/YouTube in Phase 2.)
2. **Plan tier** — confirm Premium ($149/mo) covers our channel set, or whether we need more profiles.
3. **Approval surface** — Slack buttons (matches the blog flow) vs. a monday view.
4. **Source of truth for media** — reuse blog images, generate, or require manual upload for visual channels.

## Open risks

- **Media is the hard part** — text is trivial; image/video sourcing and per-platform spec compliance (aspect ratios, length) is where effort concentrates.
- **Channel auth upkeep** — social tokens expire; Ayrshare manages most reconnections but YouTube/Instagram occasionally need re-auth.
- **Approval discipline** — to hit the 5-hour target, keep humans on approve/skip, not rewriting. Quality of the generated variants (same voice-guide work we just did for blogs) determines how often they edit.

---

*Sources: [Ayrshare API overview](https://www.ayrshare.com/docs/apis/overview), [Ayrshare social network list (GitHub)](https://github.com/ayrshare/social-media-api), [Ayrshare pricing](https://www.ayrshare.com/pricing/), [Ayrshare Business plan overview](https://www.ayrshare.com/docs/multiple-users/business-plan-overview).*
