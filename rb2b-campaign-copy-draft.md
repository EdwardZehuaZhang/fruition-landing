# RB2B Warm Leads - Fruition - Campaign Copy Draft (v2)

Date: 2026-05-24
Status: DRAFT for boss review. Educational nurture, not sales-aggressive.

## What changed from v1

v1 was modelled on the existing Evergreen Email Messaging template (Recency lead, "we just wrapped up a build, want a free blueprint?"). That style is fine for cold outbound where the prospect has shown no signal. But these RB2B leads are different: they visited our site once. Jumping straight to "want a meeting?" reads as creepy and aggressive because the prospect knows we know they were there.

v2 reframes the whole sequence as consultative nurture, not pitch. Goal: build trust over 5 weeks by being genuinely useful, then let them raise their hand when ready. We are positioned as the helpful expert "along the way", not the salesperson chasing them.

## Strategy and principles

- **Cadence**: 5 emails, 1 week apart (5 week sequence total).
- **Tone**: educational, consultative, helpful. Not transactional.
- **Content per email is shaped by `Product Category`** (Work Management / CRM / Ticketing / All). The lead's most-visited page determines which content track they're on.
- **No hard CTAs** until Email 5, and even Email 5 is a soft "if any of this resonates, here is how to reach me". No "book a 15 min call" buttons.
- **Each email gives value first**: a guide, a comparison, an FAQ, a case study. The Fruition mention is light and at the bottom (we wrote this guide / we did this build).
- **Marketa integration (future)**: each email has a placeholder for a dynamic blog link from our Marketa RAG layer. For v2 launch we hardcode the most-relevant existing post per persona. Once Marketa is fully ingested, the link becomes auto-selected per lead based on their visited page + industry.

Sender: Josh, Director APAC - Fruition (consistent with existing voice).

Variables (Smartlead style): `{{firstName}}`, `{{lastName}}`, `{{company}}`, `{{industry}}`, `{{visited_page}}` (the most specific page from Recent Page URLs, falls back to "monday catalogue" if catalog-only), `{{persona_topic}}` (Project Management / CRM / Customer Service / monday in general). Marketa-driven variable: `{{related_blog_url}}` and `{{related_blog_title}}`.

## EMAIL 1 (Day 0) - The welcome, not the pitch

Subject: `Quick note on your {{persona_topic}} interest at {{company}}`

```
Hi {{firstName}},

Saw {{company}} stopped by our {{visited_page}} page recently and figured a quick note was worth it. Not pitching anything, just wanted to share where we usually start when teams are looking into {{persona_topic}}.

The thing we tell most teams first: don't pick the software yet. Map the 3 to 5 workflows you actually want it to fix, then look at what tools fit those workflows specifically. It saves the migration-then-regret loop a lot of teams end up in.

I'll send a few of the resources we point teams at over the next few weeks — best practices, comparisons, the questions companies ask us most. No pressure, just thought it might be useful while you're looking.

Best,
Josh
Director, APAC - Fruition

P.S. We're a monday.com Platinum Partner, 500+ implementations across construction, real estate, government, and pro services. Not relevant unless you want a hand later.
```

## EMAIL 2 (Day 7) - Best practices guide

Subject: `3 things most {{persona_topic}} rollouts get wrong`

#### Persona = Work Management

```
Hi {{firstName}},

Following up. Here are the three patterns we see most often when teams roll out project / work management software:

1. They configure the tool around how leadership wants to see status, not how the project managers actually work. Result: PMs maintain their old spreadsheet AND the new tool. Adoption dies.

2. They skip the "who owns this column" conversation. By month 2 nobody is updating status, dates drift, and trust in the dashboard collapses.

3. They try to model everything in one board. The right pattern is usually 2-3 boards (delivery pipeline + resource view + leadership rollup) connected via mirrors or automations.

If any of this rings true for {{company}}, this guide goes into more depth: {{related_blog_url}} ({{related_blog_title}})

Best,
Josh
```

#### Persona = CRM

```
Hi {{firstName}},

Following up. The three patterns we see most often when teams roll out CRM software:

1. They migrate every contact and deal they've ever had. Two months in, the database is unusable. Cleaner approach: start with active pipeline + last 6 months of closed-won, archive the rest.

2. They don't agree on stage definitions before launch. Sales says "qualified" means one thing, marketing means another, leadership reports off whatever number looks best. Numbers stop being trusted.

3. They build the CRM for the sales leader's dashboard, not for the rep's daily workflow. Reps log nothing, dashboard goes dark.

If any of this rings true for {{company}}, this guide goes into more depth: {{related_blog_url}} ({{related_blog_title}})

Best,
Josh
```

#### Persona = Ticketing

```
Hi {{firstName}},

Following up. The three patterns we see most often when teams roll out customer support / ticketing software:

1. They don't define escalation paths before launch. Tickets pile up in the queue with no clear owner. SLA breaches show up before anyone notices.

2. They over-index on form fields. Every required dropdown adds friction at intake, customers describe issues in ways the form doesn't accommodate, agents end up retyping into the description anyway.

3. They treat tickets and incidents the same. Tickets are about individual customers, incidents are about systemic issues that affect many. Mixing them buries patterns.

If any of this rings true for {{company}}, this guide goes into more depth: {{related_blog_url}} ({{related_blog_title}})

Best,
Josh
```

#### Persona = All / Skip

```
Hi {{firstName}},

Following up. Three patterns we see most often when teams pick a work platform like monday, ClickUp, or Asana:

1. They evaluate based on features, not workflows. Features look the same on a demo. Workflows are where the differences show up after 6 months.

2. They underestimate the implementation. The software is 30% of the work. The 70% is conventions, ownership, and what gets retired.

3. They don't pilot. Buying for the whole org before any team has used it for 60 days is how you end up with a contract you regret.

If any of this rings true for {{company}}, this overview is a good starting point: {{related_blog_url}} ({{related_blog_title}})

Best,
Josh
```

## EMAIL 3 (Day 14) - The honest comparison

Subject: `Honest comparison: monday vs the alternatives for {{persona_topic}}`

#### Persona = Work Management

```
Hi {{firstName}},

Most teams in the {{persona_topic}} space we talk to are weighing monday against ClickUp and Asana, sometimes Smartsheet. Here is the honest version:

- monday: best when your work is project-based AND you want non-technical people building automations. Worst when you have heavy individual task tracking with deep nesting.

- ClickUp: best when you have lots of individual tasks per person and want everything in one tool. Worst when you have many cross-team handoffs because the views get noisy.

- Asana: best for clean simple project portfolios. Worst when you need custom logic across boards.

- Smartsheet: best if your team lives in Excel today. Worst when you need a visual board view as the primary interface.

We're partial to monday, but we wouldn't recommend it if your case fits one of the others better. If you want, this longer write-up has the side-by-side: {{related_blog_url}} ({{related_blog_title}})

Best,
Josh
```

#### Persona = CRM

```
Hi {{firstName}},

Most teams we talk to in CRM are weighing monday CRM against HubSpot, Pipedrive, and Salesforce. Honest take:

- monday CRM: best when your sales process is non-standard AND you want it to live in the same tool as your delivery / ops / projects. Worst when you need deep marketing automation built in.

- HubSpot: best when sales and marketing are tightly integrated and you need both in one tool. Worst when the free tier limits start to bite (they will).

- Pipedrive: best for a pure sales team with a clear pipeline. Worst when you need anything beyond sales.

- Salesforce: best when you have 50+ reps and a dedicated admin. Worst at almost any other scale because of cost and complexity.

Side-by-side here if useful: {{related_blog_url}} ({{related_blog_title}})

Best,
Josh
```

#### Persona = Ticketing

```
Hi {{firstName}},

Teams looking at customer service / ticketing usually compare monday Service against Zendesk, Freshdesk, and Intercom. Honest take:

- monday Service: best when you want tickets, projects, and CRM in the same tool, and customer support is part of a broader ops story. Worst when you have heavy multi-channel volume (chat + email + voice all at once).

- Zendesk: best for high-volume, multi-channel support teams. Worst when budget is tight and you don't need the full stack.

- Freshdesk: best as Zendesk-alternative at lower cost. Worst when you need deep ITSM / asset management.

- Intercom: best when in-app messaging is the primary channel (SaaS support). Worst as a general ticket system, which is not really what it is.

If you want a longer write-up: {{related_blog_url}} ({{related_blog_title}})

Best,
Josh
```

#### Persona = All / Skip

```
Hi {{firstName}},

Most teams looking at monday are also looking at ClickUp, Asana, or sometimes Smartsheet. Honest one-liner per option:

- monday: visual, automation-friendly, broad. Strongest when many people need to see status, not just track tasks.
- ClickUp: feature-dense, lots of views, can do almost anything but takes setup discipline.
- Asana: clean and simple, great if your projects are linear.
- Smartsheet: the Excel-user's choice, weakest at visual boards.

If you want our full side-by-side: {{related_blog_url}} ({{related_blog_title}})

Best,
Josh
```

## EMAIL 4 (Day 21) - The FAQ

Subject: `Top questions we hear before {{persona_topic}} rollouts`

```
Hi {{firstName}},

Five questions companies usually ask us in the first conversation, with short answers:

1. **How long does implementation take?** For a single use-case team of 10-30 users, typically 3-4 weeks for {{persona_topic}}. Multi-team rollouts add 4-8 weeks. Faster than that usually means corners were cut on adoption.

2. **What does it cost in total, not just licences?** Licences + implementation + change management. Implementation runs roughly 30-50% of year-one licence cost as a one-off. Skipping the change management piece is where rollouts fail.

3. **Can we migrate from {{current_tool}}?** Almost always yes. Hard part is not the data, it's deciding what conventions to bring across and what to leave behind.

4. **Do we need a partner?** No, but ~70% of teams that try DIY come back 6 months in for a rebuild. A short partner engagement up front is usually cheaper than the rebuild.

5. **What happens after go-live?** First 30 days the adoption either takes or doesn't. We embed lightly during that window and step back once it sticks.

Happy to expand on any of these if useful. Or if your situation has a question that's not on this list, send it across and I'll answer it directly.

Best,
Josh
```

(One generic version of Email 4 for all personas. The `{{persona_topic}}` variable handles the swap.)

## EMAIL 5 (Day 28) - Soft close

Subject: `Wrapping up the {{persona_topic}} resources`

```
Hi {{firstName}},

Last note from me. Over the last few weeks I've shared:

- Where teams usually start when picking {{persona_topic}} software (Email 1)
- 3 patterns most rollouts get wrong (Email 2)
- An honest comparison of monday vs the alternatives (Email 3)
- The 5 questions companies usually ask first (Email 4)

If any of it was useful, that was the goal. If you want to go further, the three things I'd offer:

- A 30 minute conversation about {{company}}'s specific situation, no slides, no pitch
- A workflow blueprint for the use case you're closest to (we put it together based on a short intake form, free)
- An intro to one of our existing clients in {{industry}} who went through a similar rollout

Just reply with which one (or none) and I'll set it up.

Either way, thanks for letting me into your inbox for a few weeks. Glad to be on the radar.

Best,
Josh
Director, APAC - Fruition
```

## LINKEDIN sequence (HeyReach)

Unchanged from v1. Reuses existing LinkedIn Messaging templates verbatim from monday.com doc 5027677770. The LinkedIn M1-M4 already has a softer tone than the v1 email did, so it fits the v2 educational frame fine.

One small adjustment: LinkedIn M1 can reference the website visit for warmth, e.g. `Hi {first_name}, thx for connecting. Saw {company} stopped by our monday catalogue recently, thought I'd reach out.`

## Marketa integration plan (future)

Right now, `{{related_blog_url}}` and `{{related_blog_title}}` are static per persona. We pick the best matching existing blog post for each persona and hardcode it into the Smartlead template.

Once Marketa is fully ingested with Sanity blog content, the integration looks like this:

1. Marketa receives `{visited_page, industry, persona, email_step_number}` for each send.
2. Marketa RAG-retrieves the most semantically relevant blog post.
3. Marketa returns `{title, url, summary}` back to Smartlead via webhook.
4. Smartlead merge tags pick it up and render in the email body.

This gives each lead a personalised resource per email step. A Manufacturing visitor reading about CRM gets different blog links than a Healthcare visitor reading about Ticketing.

Until that's wired, use these hardcoded picks (Edward to confirm best fit from current Sanity content):

| Email | Persona | Suggested existing blog post |
|---|---|---|
| 2 | Work Management | (pick from Sanity: "3 mistakes in WM rollouts" or similar) |
| 2 | CRM | (pick: "CRM data hygiene" or "Pipeline that actually gets used") |
| 2 | Ticketing | (pick: "Service desk design patterns" or similar) |
| 2 | All | (pick: "Picking a work platform" overview) |
| 3 | Work Management | (pick: "monday vs ClickUp vs Asana") |
| 3 | CRM | (pick: "monday CRM vs HubSpot") |
| 3 | Ticketing | (pick: "monday Service vs Zendesk") |
| 3 | All | (pick: monday vs alternatives overview) |

If Sanity doesn't have content on a specific topic yet, that's also a content-gap signal worth flagging to the marketing side.

## What this v2 deliberately does NOT do

- No "schedule a 15 minute call" CTAs until Email 5.
- No urgency / scarcity language ("only this week", "limited spots").
- No "we noticed you visited and..." opener (the v1 lead). It's named once in Email 1 then dropped.
- No customer testimonial drops. Saved for Email 5 as a soft offer ("intro to one of our clients").
- No persona-targeted Email 1 or Email 5 (those are universal, just `{{persona_topic}}` swap). Persona variants only on Email 2, 3.

## Open items for boss

1. Approve / edit v2 copy. The 5-email cadence is consultative-nurture; previous v1 was sales-aggressive. v2 is the right move for warm-but-not-asking RB2B leads.
2. Confirm sender pool (Zapmail Microsoft + Google) and daily cap to start.
3. Confirm hardcoded blog links per persona for now (Edward to pick from existing Sanity content), or wait for Marketa integration to go live first.
4. HeyReach handoff timing: should LinkedIn M1-M4 start after Email 3 (parallel) or after Email 5 (sequential)?
5. Persona gating: gate Email 2 and Email 3 on `Product Category`, or send everyone the "All" variant for the first run since URL signal is still sparse?

## Changelog

- 2026-05-24: v1 created. 4-email sales-aggressive sequence with "want a free blueprint?" CTA.
- 2026-05-24: v2 (this version). Replaced with 5-email educational nurture. Weekly cadence. Soft CTA only at Email 5. Marketa integration plan added.
