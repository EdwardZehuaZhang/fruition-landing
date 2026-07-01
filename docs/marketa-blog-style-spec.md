# Fruition Blog Style Spec & Eval Rubric

**Purpose:** Define how a *real, published* Fruition blog is written, so the Marketa pipeline can reproduce it — and so generated drafts can be scored against a concrete target. This is both a style guide and the scoring rubric for the eval harness (`scripts/marketa-harness/eval.ts`).

**Built from:** 3 published posts (the ground truth, in Sanity / synced) vs. 3 pipeline drafts that the current pipeline produced from the same topics.

| Topic | Real (published) | Generated (pipeline draft) |
|---|---|---|
| Purchase Orders in monday | "How to Manage Purchase Orders in monday.com? Your Order Management Guide for 2026" | "Purchase Order Management in monday: Guide" |
| monday AI Pricing | "monday AI Pricing Model for 2026: A Deep Dive Into Credit Consumption, Cost, and More" | "monday AI Pricing Model for 2026" |
| Product/AI Roadmap | "monday.com Product and AI Roadmap for 2026-2027: Everything You Need to Know" | "monday.com Product and AI Roadmap for 2026-2027" |

---

## The headline finding

The generated drafts are **not badly written**. They read as fluent, opinionated, consultant-voice essays — arguably more pleasant to read than the real posts. That is exactly the problem. In chasing "conversational, human, not-AI," the pipeline produced a *generic good blog* and dropped the **SEO/AEO scaffolding that makes a post recognizably Fruition**.

The real Fruition post is an **SEO/AEO content asset**, not an essay. It is engineered to (a) win Google AI Overview / featured-snippet answers, (b) interlink the rest of the Fruition blog, and (c) convert with proof + a CTA. The pipeline is currently optimizing for prose quality and ignoring all three.

This traces directly to the live voice guide (`voice-guide-fruition`, v0.2-ishani), which encodes readability and "sound human" rules but says nothing about title craft, snippet openers, inline cited stats, internal linking, proof blocks, CTAs, FAQs, or meta descriptions. A few of its rules actively suppress the real style (see "Rules that backfired").

---

## How the real writer actually works

### 1. Title craft — the topic is reframed, never copied
The Slack/brief topic is a *seed*, not the title. The writer expands it into an SEO title with three moving parts:

`[Question or topic] + [year/recency] + [benefit/promise suffix]`

- "How to Manage Purchase Orders in monday.com? **Your Order Management Guide for 2026**"
- "monday AI Pricing Model for 2026**: A Deep Dive Into Credit Consumption, Cost, and More**"
- "monday.com Product and AI Roadmap for 2026-2027**: Everything You Need to Know**"

Patterns: leads with "How to…?" / "What is…?" where natural; always carries the year; ends with a value promise ("Your … Guide," "A Deep Dive Into…," "Everything You Need to Know"). **The generated titles are the raw topic string** — flat, no year-promise, no hook.

### 2. The bolded Q&A snippet opener (AEO play)
Every real post opens — *before* any narrative — with a **bolded question** that restates the title, immediately answered in the first sentence:

> **Can you manage purchase orders in monday.com?**
> Yes, managing purchase orders is straightforward when using monday Work Management…

This is a deliberate featured-snippet / AI-Overview target. The generated drafts open with a narrative scene-setter ("Marketing teams spend more on outside vendors than almost any other function…") — good prose, zero snippet capture.

### 3. Inline authority stats as section hooks (E-E-A-T)
Nearly every section opens or turns on a **cited external statistic**, hyperlinked to a recognized authority:

> "[Gartner reports that](…) 60% of brands will use Agentic AI…"
> "Digital channels will soon [take over 52%](…) of all revenue."
> "[IBM reports that](…) digital procurement tools eliminate bottlenecks…"

Sources used: Gartner, Forbes, IBM, McKinsey, Salesforce, BusinessWire, etc. The stat is **woven into the body as a hook**, not parked in a list. The generated drafts cite real sources too — but as a **bare "Sources" list at the bottom**, with almost no inline authority stats driving the sections. (The pipeline's `[Source N]` convention produces end-list citations, not woven hooks.)

### 4. Heavy internal linking to fruitionservices.io
Every product/feature mention links to a related Fruition post:

> "[monday AI Blocks](https://www.fruitionservices.io/post/monday-ai-blocks)", "[monday Sidekick](…/post/what-is-monday-sidekick)", "[monday MCP](…/post/what-is-monday-mcp)", "[Enterprise vs Pro](…/post/mondaycom-enterprise-pricing-plan-vs-pro)" …

This is the site's interlinking / topical-authority strategy. **The generated drafts contain zero fruitionservices.io internal links** — a major SEO miss and the single most mechanical gap to close.

### 5. A proof / credentials block near the end ("How Fruition Helps")
A dedicated section pitches Fruition with hard, repeated, verifiable partner stats:

> "Fruition is a Platinum monday.com Partner with **500+ implementations** worldwide. With a **4.7/5 CSAT** score, we've completed **9,000+ billable hours** with **700+ satisfied clients**. Our team of **27+ monday experts**…"

These numbers recur across posts (sometimes 27+, sometimes 37+ consultants). The generated drafts replace this with a soft, honest "Where Fruition fits" paragraph and **omit the credential stats entirely** — because the voice guide bans "performance numbers without a Fruition-conducted measurement." (That rule was meant to ban *invented client results*, not Fruition's own published partner credentials. See below.)

### 6. Explicit CTA close
Real posts end with a "To End With" / "The Endnotes" section and a direct CTA: "Contact Fruition to get a free quote." Generated drafts end with a softer, no-ask close ("we run this every week… we'll tell you when it's not the right tool").

### 7. FAQ section (3 Q&As) at the very end
Every real post closes with an **## FAQs** block of ~3 question/answer pairs — another AEO/snippet surface. Generated drafts have **no FAQ**.

### 8. Meta description
Real posts carry a `Meta-Description:` line up top (140–160 chars). Generated drafts leave it as `TODO`.

### 9. Micro-style (these the pipeline mostly gets right, keep them)
- Short, punchy sentences; one idea each. Frequent one-line "payoff" sentences: "The result? End-to-end purchase order management without email chains."
- Rhetorical-question transitions: "The result?", "Why?", "So, is automating everything the solution? Yes, and no."
- Conversational hooks: "Did you know?", "Let's consider this:", "Think of it this way:".
- Bulleted lists with **bolded lead-ins**: "**Workflow Automation**: …".
- British/global spelling ("centralise", "optimise", "organisation").
- Question-style H2/H3 headers ("Why monday.com Is Built for Purchase Order Management?").

---

## Rules in the current voice guide that backfired

These live rules pushed the generator *away* from house style. The rewrite reconciles each:

1. **"No performance numbers without a Fruition-conducted measurement."** Intended to ban invented client outcomes. Effect: also killed the credentials block (Platinum Partner, 500+ implementations, 4.7/5 CSAT, 27+ experts) — which are *published, verifiable* facts. → Carve out an explicit allow-list of approved Fruition credential stats.
2. **"Show, don't tell… industry-focused over product-pitchy."** Effect: suppressed the "How Fruition Helps" pitch + CTA that every real post ends with. → Require a proof section + CTA as part of the template.
3. **Sources = a list at the end + `[Source N]`.** Effect: end-list citations, no inline authority hooks. → Require inline hyperlinked stats as section hooks (the `[Source N]` list can remain as an internal QA aid, stripped before publish).
4. **"Output only the blog post… the only thing after is Sources."** Effect: no meta description, no FAQ, no title reframing instructions. → Add title formula, meta description, and FAQ to the required output.
5. **Nothing about internal linking.** → Add an explicit "link every product/feature mention to its fruitionservices.io post" rule.

The readability rules (short sentences, Q&A rhythm, scannability, "sound human," verify facts) are **good and stay**. The fix is additive: layer the SEO/AEO template on top.

---

## Scoring rubric (used by the eval harness)

Each generated draft is scored 0–100 against the real post for the same topic. Weighted checks (mix of deterministic regex + LLM-judge):

| # | Dimension | Weight | Pass condition |
|---|---|--:|---|
| 1 | **Title reframed** | 10 | Title differs from raw topic; carries year and/or a benefit-promise suffix; not a verbatim copy of the brief title |
| 2 | **Q&A snippet opener** | 12 | First content block is a bolded question restating the title, answered in sentence 1 |
| 3 | **Inline cited stats** | 14 | ≥4 hyperlinked external authority stats woven into section bodies (not just an end list) |
| 4 | **Internal links** | 14 | ≥3 links to fruitionservices.io/post/… on product/feature mentions |
| 5 | **Credentials/proof block** | 12 | A "How Fruition Helps"-style section with ≥2 approved credential stats |
| 6 | **CTA close** | 8 | Explicit ask in the final section (quote / contact / engagement) |
| 7 | **FAQ section** | 10 | An FAQs section with ≥3 Q&A pairs |
| 8 | **Meta description** | 5 | A 140–160 char meta description present |
| 9 | **Readability** | 8 | Median sentence < 20 words; paragraphs ≤ 3 sentences (keep Ishani's wins) |
| 10 | **Keyword usage** | 4 | Primary keyword in H1, first paragraph, ≥1 H2; not stuffed |
| 11 | **No AI-tells** | 3 | None of the banned phrases; varied paragraph rhythm |

**Target:** a draft is "good enough to hand to an editor" at **≥ 80**, with no single structural check (2–7) scoring zero. The three current drafts would score roughly 35–45 (strong on 9–11, near-zero on 1–8).

---

## What changes in the pipeline

1. **Voice guide (`voice-guide-fruition`)** — rewritten to encode this template (title formula, snippet opener, inline stats, internal links, credential allow-list, CTA, FAQ, meta description), while keeping the readability/sourcing rules. *Highest leverage — injected verbatim into both n8n and the harness.* **(applied, v0.3-seo-template-2026-06)**
2. **Internal links resolve to real URLs** — the harness fetches a menu of real published `/post/<slug>` URLs from Sanity and forbids the model from inventing slugs. Generated drafts now carry 6-21 real internal links. **(done)**
3. **Inline cited stats via a stat menu** — with the web_search tool active during the write, Claude footnotes citations as metadata instead of inline-linking. Fix: a pre-fetch web-search call returns 6 verified `{claim, url}` stats as JSON, then the write runs with web search OFF and inline-links them from the menu (same pattern as internal links). **(done)**
4. **Eval harness** — `scripts/marketa-harness/eval.ts` regenerates drafts from existing Sanity titles and scores them with this rubric, so the guide can be tuned until generations clear 80. **(done; run on the Mac, native node_modules)**

### Measured progression (topic: "monday.com Agile Sprint Management", opus + brain + web)
Baseline drafts ~35-45 → voice guide v0.3 = **73** → scorer/CTA + title fixes = **82-86** → internal-link menu + stat menu = **96/100**.

### Production (n8n) follow-up — not auto-applied
To get the same result in the live n8n flow (`n8n/marketa-draft-blog.json`):

1. **Soften the "Claude: write draft" system line** `"Industry-focused over product-pitchy"` — it contradicts the v0.3 proof+CTA requirement. Change to "industry-led but always close with a Fruition proof block + CTA". Edit in the n8n UI (REST edits are rejected).
2. **Add an internal-link menu node** — query Sanity for recent `blogPost` slugs, format as `- title -> https://www.fruitionservices.io/post/<slug>`, inject into the prompt with "link only from this menu, never invent slugs".
3. **Add a stat pre-fetch node** — one Claude+web_search call returning JSON stats, then run the main draft node with web search OFF and the STAT MENU injected. This is what unlocks inline-linked stats.
4. **Bump the Claude model** if `claude-opus-4-7` is stale.
