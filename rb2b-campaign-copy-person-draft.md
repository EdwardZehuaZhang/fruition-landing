# RB2B Warm Leads (PERSON / Individual Visitor) — Fruition — Campaign Copy Draft (v1)

Date: 2026-07-10
Status: DRAFT for boss review. Companion to `rb2b-campaign-copy-draft.md` (the Company chain).

## Why this is a separate chain

We run two RB2B routes, and they are not the same lead:

| | **Company chain** (`rb2b-campaign-copy-draft.md`) | **Person chain** (this doc) |
|---|---|---|
| RB2B `Profile Type` | Company | Person |
| Who visited | The company (anonymous individual) | **A named human**, identified by RB2B |
| Who we email | A decision-maker Clay's **waterfall** dug up (up to 3/company, seniority-filtered) — they never personally visited | **The actual visitor** |
| Clay enrichment | Company Enrichment → Find People → email waterfall | **None needed for the person** — RB2B already hands us the human. (Business email still runs MillionVerifier before send.) |
| Data we have | Company, industry, size, visited page | First name, last name, **job title**, company, business email, LinkedIn, **exact page hit**, **repeat-visit flag**, industry, location |
| Signal strength | Weaker — we inferred the contact | **Hotter** — this specific person engaged with a specific page |

Because the signal is hotter and personal, the copy is **more role-aware** (we know their title) and, critically, **more careful about the creepiness line** — see below.

## The creepiness guardrail (read before editing)

The Company chain could safely say "Saw {{company}} stopped by our page" because it's attributing the visit to an org, not a person. **Here we literally know it was this individual.** Saying "I saw *you* visited our pricing page" reads as surveillance and kills the reply.

So the **default copy does NOT reveal the individual visit.** It reaches out role-relevant and topic-relevant, the way good targeted outbound already reads — the visit is the *trigger*, not the *content*. For each email I've included an optional **"warm opener"** line the boss can swap in if we want to acknowledge the visit softly. Recommendation: launch with the default (no reveal); A/B the warm opener on repeat visitors only, where the intent is undeniable.

## Strategy and principles

- **Cadence:** 5 emails, 1 week apart (mirrors the Company chain, drop-in to the same Smartlead structure). Because the signal is hotter, the boss may opt to compress to ~5-day gaps or pull the soft CTA forward to Email 4 — flagged as an open item, default kept at weekly for consistency.
- **Tone:** educational, consultative, helpful. Not transactional. Same v2 philosophy as the Company chain.
- **Role-personalised:** we use `{{jobTitle}}` (the Company chain can't — it doesn't have a reliable title for a Clay-found contact).
- **Persona-branched on Email 2 & 3** (Work Management / CRM / Ticketing / All), driven by the page they actually hit — and here the persona signal is *stronger* than the Company chain, because this person personally viewed that page rather than us inferring it from the company.
- **No hard CTAs** until Email 5, and Email 5 is a soft "if any of this resonates, here's how to reach me."
- **Value first every time:** a guide, a comparison, an FAQ. The Fruition mention stays light and at the bottom.
- **Marketa integration (future):** `{{related_blog_url}}` / `{{related_blog_title}}` are hardcoded per persona for v1; later auto-selected per lead by visited page + industry via the Marketa RAG layer (same plan as the Company chain).

Sender: Josh, Director APAC — Fruition (consistent with the Company chain and existing voice).

Variables (Smartlead style): `{{firstName}}`, `{{lastName}}`, `{{jobTitle}}`, `{{company}}`, `{{industry}}`, `{{visited_page}}` (most specific page from RB2B Captured URL; falls back to "monday catalogue"), `{{persona_topic}}` (Project Management / CRM / Customer Service / monday in general). Marketa-driven: `{{related_blog_url}}`, `{{related_blog_title}}`. Segmentation flag (not a merge tag): `is_repeat_visit` — route repeat visitors to the warm-opener variant.

---

## EMAIL 1 (Day 0) — the role-led hello, not the pitch

Subject: `Where we'd start with {{persona_topic}} at {{company}}`

```
Hi {{firstName}},

I work with a lot of people in your seat weighing up {{persona_topic}}, so a quick note to {{company}} felt worth it. Not pitching anything — just where we usually tell teams to start.

The one thing we say first: don't pick the software yet. Map the 3 to 5 workflows you actually need it to fix, then judge tools against those specifically. It's the difference between a rollout that sticks and the migrate-then-regret loop a lot of teams fall into.

I'll send a couple of the resources we point teams at over the next few weeks — best practices, an honest comparison, the questions we get asked most. No pressure, just useful reading while you're looking.

Best,
Josh
Director, APAC — Fruition

P.S. We're a monday.com Platinum Partner, 500+ implementations across construction, real estate, government and pro services. Only relevant if you want a hand later.
```

> **Optional warm opener** (swap in for line 1 if we decide to acknowledge the visit — higher risk, recommend repeat-visitors only):
> `Saw {{company}} was reading up on {{persona_topic}} on our site and figured, given your role, it might be worth a quick note.`

---

## EMAIL 2 (Day 7) — best-practices guide

Subject: `3 things most {{persona_topic}} rollouts get wrong`

#### Persona = Work Management

```
Hi {{firstName}},

Following up. As someone who'd own this, here are the three patterns we see most often when teams roll out project / work management software:

1. They configure the tool around how leadership wants to see status, not how the project managers actually work. Result: PMs keep their old spreadsheet AND the new tool. Adoption dies.

2. They skip the "who owns this column" conversation. By month 2 nobody's updating status, dates drift, and trust in the dashboard collapses.

3. They try to model everything in one board. The right pattern is usually 2-3 boards (delivery pipeline + resource view + leadership rollup) connected via mirrors or automations.

If any of this rings true for {{company}}, this goes deeper: {{related_blog_url}} ({{related_blog_title}})

Best,
Josh
```

#### Persona = CRM

```
Hi {{firstName}},

Following up. The three patterns we see most often when teams roll out CRM software:

1. They migrate every contact and deal they've ever had. Two months in, the database is unusable. Cleaner approach: start with active pipeline + last 6 months of closed-won, archive the rest.

2. They don't agree on stage definitions before launch. Sales says "qualified" means one thing, marketing another, leadership reports off whatever number looks best. Numbers stop being trusted.

3. They build the CRM for the sales leader's dashboard, not the rep's daily workflow. Reps log nothing, dashboard goes dark.

If any of this rings true for {{company}}, this goes deeper: {{related_blog_url}} ({{related_blog_title}})

Best,
Josh
```

#### Persona = Ticketing

```
Hi {{firstName}},

Following up. The three patterns we see most often when teams roll out customer support / ticketing software:

1. They don't define escalation paths before launch. Tickets pile up with no clear owner. SLA breaches show up before anyone notices.

2. They over-index on form fields. Every required dropdown adds friction at intake, customers describe issues in ways the form doesn't fit, agents end up retyping into the description anyway.

3. They treat tickets and incidents the same. Tickets are about individual customers; incidents are systemic issues affecting many. Mixing them buries patterns.

If any of this rings true for {{company}}, this goes deeper: {{related_blog_url}} ({{related_blog_title}})

Best,
Josh
```

#### Persona = All / Skip

```
Hi {{firstName}},

Following up. Three patterns we see most often when teams pick a work platform like monday, ClickUp, or Asana:

1. They evaluate on features, not workflows. Features look the same in a demo. Workflows are where the differences show up after 6 months.

2. They underestimate the implementation. The software is 30% of the work. The 70% is conventions, ownership, and what gets retired.

3. They don't pilot. Buying for the whole org before any team's used it for 60 days is how you end up with a contract you regret.

If any of this rings true for {{company}}, this overview is a good starting point: {{related_blog_url}} ({{related_blog_title}})

Best,
Josh
```

---

## EMAIL 3 (Day 14) — the honest comparison

Subject: `Honest comparison: monday vs the alternatives for {{persona_topic}}`

#### Persona = Work Management

```
Hi {{firstName}},

Most teams weighing {{persona_topic}} are looking at monday against ClickUp and Asana, sometimes Smartsheet. The honest version:

- monday: best when work is project-based AND you want non-technical people building automations. Worst for heavy individual task tracking with deep nesting.
- ClickUp: best when you have lots of individual tasks per person and want everything in one tool. Worst when there are many cross-team handoffs — the views get noisy.
- Asana: best for clean, simple project portfolios. Worst when you need custom logic across boards.
- Smartsheet: best if your team lives in Excel today. Worst when a visual board view is the primary interface.

We're partial to monday, but we wouldn't recommend it if your case fits one of the others better. The side-by-side: {{related_blog_url}} ({{related_blog_title}})

Best,
Josh
```

#### Persona = CRM

```
Hi {{firstName}},

Most teams weighing CRM are looking at monday CRM against HubSpot, Pipedrive, and Salesforce. Honest take:

- monday CRM: best when your sales process is non-standard AND you want it in the same tool as delivery / ops / projects. Worst when you need deep marketing automation built in.
- HubSpot: best when sales and marketing are tightly integrated and you need both in one tool. Worst when the free-tier limits start to bite (they will).
- Pipedrive: best for a pure sales team with a clear pipeline. Worst when you need anything beyond sales.
- Salesforce: best when you have 50+ reps and a dedicated admin. Worst at almost any other scale, on cost and complexity.

Side-by-side here: {{related_blog_url}} ({{related_blog_title}})

Best,
Josh
```

#### Persona = Ticketing

```
Hi {{firstName}},

Teams looking at customer service / ticketing usually compare monday Service against Zendesk, Freshdesk, and Intercom. Honest take:

- monday Service: best when you want tickets, projects, and CRM in one tool and support is part of a broader ops story. Worst for heavy multi-channel volume (chat + email + voice all at once).
- Zendesk: best for high-volume, multi-channel support teams. Worst when budget's tight and you don't need the full stack.
- Freshdesk: best as a lower-cost Zendesk alternative. Worst when you need deep ITSM / asset management.
- Intercom: best when in-app messaging is the primary channel (SaaS support). Worst as a general ticket system — not really what it is.

Longer write-up: {{related_blog_url}} ({{related_blog_title}})

Best,
Josh
```

#### Persona = All / Skip

```
Hi {{firstName}},

Most teams looking at monday are also looking at ClickUp, Asana, or sometimes Smartsheet. Honest one-liner each:

- monday: visual, automation-friendly, broad. Strongest when many people need to see status, not just track tasks.
- ClickUp: feature-dense, lots of views, can do almost anything but takes setup discipline.
- Asana: clean and simple, great if your projects are linear.
- Smartsheet: the Excel-user's choice, weakest at visual boards.

Our full side-by-side: {{related_blog_url}} ({{related_blog_title}})

Best,
Josh
```

---

## EMAIL 4 (Day 21) — the FAQ

Subject: `Top questions we hear before {{persona_topic}} rollouts`

```
Hi {{firstName}},

Five questions companies usually ask us in the first conversation, with short answers:

1. **How long does implementation take?** For a single use-case team of 10-30 users, typically 3-4 weeks for {{persona_topic}}. Multi-team rollouts add 4-8 weeks. Faster than that usually means corners were cut on adoption.

2. **What does it cost in total, not just licences?** Licences + implementation + change management. Implementation runs roughly 30-50% of year-one licence cost as a one-off. Skipping the change-management piece is where rollouts fail.

3. **Can we migrate from what we use now?** Almost always yes. The hard part isn't the data, it's deciding what conventions to bring across and what to leave behind.

4. **Do we need a partner?** No, but ~70% of teams that try DIY come back 6 months in for a rebuild. A short partner engagement up front is usually cheaper than the rebuild.

5. **What happens after go-live?** The first 30 days decide whether adoption takes. We embed lightly during that window and step back once it sticks.

Happy to expand on any of these. Or if your situation has a question that's not on this list, send it across and I'll answer it directly.

Best,
Josh
```

(One generic version of Email 4 for all personas — the `{{persona_topic}}` variable handles the swap.)

---

## EMAIL 5 (Day 28) — soft close

Subject: `Wrapping up the {{persona_topic}} resources`

```
Hi {{firstName}},

Last note from me. Over the last few weeks I've shared:

- Where teams usually start when picking {{persona_topic}} software (Email 1)
- 3 patterns most rollouts get wrong (Email 2)
- An honest comparison of monday vs the alternatives (Email 3)
- The 5 questions companies usually ask first (Email 4)

If any of it was useful, that was the goal. If you want to go further, three things I'd offer:

- A 30-minute conversation about {{company}}'s specific situation — no slides, no pitch
- A workflow blueprint for the use case you're closest to (we put it together off a short intake form, free)
- An intro to one of our existing clients in {{industry}} who went through a similar rollout

Just reply with which one (or none) and I'll set it up.

Either way, thanks for letting me into your inbox for a few weeks. Glad to be on the radar.

Best,
Josh
Director, APAC — Fruition
```

---

## LinkedIn sequence (HeyReach)

Same handling as the Company chain: reuse the existing LinkedIn M1-M4 templates (monday.com doc 5027677770). For the Person route we already have the individual's LinkedIn URL directly from RB2B (no company→person lookup), so M1 can go out immediately after email Email 3. Keep M1 role-relevant; do **not** reference the site visit on LinkedIn (same creepiness guardrail).

## Marketa integration plan (future)

Identical to the Company chain: for v1, `{{related_blog_url}}` / `{{related_blog_title}}` are hardcoded per persona; once Marketa is ingested with Sanity content, it RAG-retrieves the most relevant post per `{visited_page, industry, persona, email_step_number}` and returns `{title, url, summary}` to Smartlead via webhook. The Person route feeds a *stronger* `visited_page` signal (the individual personally viewed it), so Marketa's per-lead selection should be more accurate here than on the Company chain.

## What this v1 deliberately does NOT do

- **Does not reveal the individual's visit** in the default copy (creepiness guardrail). Warm-opener variants are opt-in and recommended for repeat visitors only.
- No "schedule a 15-minute call" CTAs until Email 5.
- No urgency / scarcity language.
- No persona targeting on Emails 1, 4, 5 (universal, `{{persona_topic}}` swap only). Persona variants live on Email 2 and 3.
- No Clay decision-maker waterfall — this route emails the identified person directly (business email still validated via MillionVerifier before send).

## Open items for boss

1. Approve / edit v1 copy. Same consultative-nurture philosophy as the approved Company chain, reframed for a named individual.
2. **Reveal or not:** launch with the default (no visit reveal), or A/B the warm opener on repeat visitors? Recommendation: default now, warm-opener A/B on `is_repeat_visit = true` only.
3. **Cadence:** keep 5×weekly for parity with the Company chain, or compress to ~5-day gaps / pull soft CTA to Email 4 given the hotter signal?
4. Confirm hardcoded blog links per persona (Edward to pick from current Sanity content), or wait for Marketa to go live.
5. HeyReach handoff timing: LinkedIn M1 after Email 3 (parallel) or after Email 5 (sequential)?
6. Suppression: ensure a person identified here is suppressed from the Company chain (and vice-versa) so a lead can't land in both sequences.

## Changelog

- 2026-07-10: v1 created. Person / individual-visitor chain — 5-email educational nurture, weekly cadence, role-personalised, visit not revealed by default. Companion to the Company chain in `rb2b-campaign-copy-draft.md`.
