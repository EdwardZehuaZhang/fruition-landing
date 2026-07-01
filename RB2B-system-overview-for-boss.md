# RB2B Website Visitor → Outbound Pipeline — System Overview

For: Boss
From: Edward (with Claude pair-programming)
Date: 2026-05-24
Status: Wired end to end, NOT yet activated. Ready for review.

## TL;DR

Website visitors identified by RB2B now flow into Clay automatically, get ICP-filtered into a people table that matches the same shape as our Evergreen pipeline (`Work Management (ANZ) #1` etc.), and are wired to push into the same email-finding waterfall and Smartlead campaign structure we already use. We mirrored every step of the existing Evergreen process and added one new advantage on top: when a visitor hits a product-specific page (`/monday-crm-consulting`, `/monday-service`, `/monday-project-management`, etc.), the persona is auto-tagged so we can route them to the right pitch.

Nothing is turned on yet. Activation is a 4-step flip-the-switch process and we estimate roughly USD 600 to fully enrich and validate the first batch of 106 RB2B-sourced leads end to end.

## The pipeline (left to right)

```
RB2B website visitor identified
        ↓ (webhook, already live)
Clay: Pull in data from a Webhook Table (66 visitors so far)
        ↓ (parsed: Profile Type, Website URL, Company, LinkedIn, Industry,
                  Estimated Headcount, Recent Page URLs, Product Category)
        ↓ (filter: Profile Type = Company → 62 companies)
Clay: RB2B Company Enrichment (intermediate, 3 test rows so far)
        ↓ (Find people SOURCE: seniority = Founder + Owner + C-suite + VP + Director + Head,
                               max 3 per company)
Clay: RB2B People (people-level, 106 contacts — mirrors Work Management (ANZ) #1 shape)
        ↓ (Send table data, configured, Auto-run OFF)
Clay: RB2B Warm Leads - Waterfall (existing 76-column waterfall clone — 1 test row landed)
        ↓ (existing A-E email waterfall: MillionVerifier / Prospeo / TryKitt / Findymail)
        ↓ (existing !! Final Valid !! (A+B+C+D+E) column)
        ↓ (existing Add Lead to Campaign action, configured but NOT yet triggered)
Smartlead: RB2B Warm Leads - Fruition campaign (Draft, no leads, no copy)
        ↓ (after N days no reply)
HeyReach: LinkedIn sequence (NOT YET WIRED, two options below)
```

## What was actually built

### On the Clay side

1. **Source webhook table** — `Pull in data from a Webhook Table` in `RB2B Visitors` workbook now has 8 parsed columns (Profile Type, Website URL, Company Name, LinkedIn URL, Industry, Estimated Employee Count, Recent Page URLs, Product Category). All 66 visitors so far are populated. RB2B keeps feeding new visitors automatically.

2. **RB2B Company Enrichment** — new intermediate table that takes `Profile Type = Company` rows from the source via a `Send table data` action. Currently has 3 test rows (Fruition, monday.com visitor, AECOM). Set to manual trigger so we control flow.

3. **RB2B People** — new people-level table, 106 contacts (62 companies × up to 3 each). Seniority filter is the union of CRM and Work Management Evergreen patterns (Founder + Owner + C-suite + VP + Director + Head). Columns mirror Work Management (ANZ) #1: First Name, Last Name, Full Name, Job Title, Location, Company Domain, LinkedIn Profile.

4. **Send action wired** — RB2B People → existing `RB2B Warm Leads - Waterfall` clone. Tested with one row (Jamil Farshchi, EVP CTO Equifax) — confirmed it lands correctly in the waterfall. Auto-run OFF, manual trigger only.

5. **Persona signal carried through** — visitors who hit a product-specific page get a `Product Category` tag (`Work Management`, `CRM`, `Ticketing`). The tag rides through to the waterfall as additional data, so we can pull persona-targeted copy in Smartlead.

### On the documentation side

6. **Campaign copy draft** — 4-email sequence (Day 0, 3, 7, 12) with persona-aware Email 2 (3 variants for Work Mgmt, CRM, Ticketing, plus a generic "All" fallback). Modelled on the existing Email Messaging doc (which only had Project Management). LinkedIn M1-M4 sequence reuses the existing LinkedIn Messaging doc verbatim. See `rb2b-campaign-copy-draft.md` for full copy.

7. **Documentation chain** — original handover.md, addendum part 1 (formula columns, Company Enrichment), addendum part 2 (URL signal pivot, RB2B People), and this overview. All in the `fruition-landing` folder.

## What I deliberately did NOT do

- **No Work Email enrichment runs.** This is the expensive step (about USD 2.10 per row × ~106 rows × waterfall providers = USD 200-300 just for email finding, then add MillionVerifier validation on top).
- **No Smartlead campaign launch.** The campaign `RB2B Warm Leads - Fruition` (ID 3379028) is still in Draft, no leads attached, no sender accounts assigned, no sequence configured. Adding leads and sequence copy requires conscious approval.
- **No edits to Evergreen.** All 3 regional workbooks (AUS/NZ, UK/IRE, US/CAN) and their tables are unchanged. The Smartlead Evergreen campaigns are unchanged. HeyReach is unchanged.
- **No HeyReach setup.** Per Edward's own SOP doc, HeyReach exists in the stack but is not currently wired into Clay or Smartlead automatically. We did not change that.

## Cost to activate (estimates)

| Stage | Tool | Cost per row | 106 rows | Notes |
|---|---|---|---|---|
| Find work email (A-E waterfall) | Prospeo / TryKitt / Findymail / Clay | ~$2.10 | ~$223 | Average across providers; some rows may stop at A |
| Email validation | MillionVerifier | ~$0.04 | ~$4 | Validation is cheap |
| Push to Smartlead | Smartlead API | $0 | $0 | Already paid in $94/mo Smartlead Pro |
| LinkedIn enrolment | HeyReach | $0 incremental | $0 | Already paid $316/mo, capacity covers this volume |
| **Total to activate** | | | **~$230** | |

If the campaign performs and you want to scale (e.g. push to RB2B's typical 200 to 500 visitors per month), monthly cost runs ~$430 to $1,080 in Clay credits at the same per-lead rate. All sender-side infrastructure (Zapmail, Smartlead, HeyReach) is already paid and has capacity.

## How to activate (the actual flip-the-switch)

Step 1: **Trigger the Send actions on RB2B source rows.**
On `Pull in data from a Webhook Table`, scroll to the `Send table data` column. Either click `Click to run` per row, or toggle Auto-run ON to flow all 62 Company-typed rows into `RB2B Company Enrichment` automatically. Cost: $0.

Step 2: **Run the Send action on RB2B People.**
On `RB2B People`, scroll to the `Send table data` column. Click `Click to run` per row, or toggle Auto-run ON. Cost: $0. Lands all 106 rows in `RB2B Warm Leads - Waterfall`.

Step 3: **Run the A-E email waterfall in the existing clone.**
The existing `RB2B Warm Leads - Waterfall` clone has the full A-E find-work-email waterfall already wired (cloned from the Evergreen template). Trigger the columns for the new rows. Cost: ~$230 total for 106 leads.

Step 4: **In Smartlead, configure the campaign and turn it on.**
- Open `RB2B Warm Leads - Fruition` (campaign ID 3379028).
- Assign sender mailboxes (Zapmail accounts, recommended split across Microsoft + Google).
- Paste in the email sequence copy from `rb2b-campaign-copy-draft.md` (review/edit first).
- Set send caps (recommended 25-40/day/mailbox to start).
- Trigger the `Add Lead to Campaign` action in Clay (on `RB2B Warm Leads - Waterfall` clone, where rows with valid emails will appear).
- Launch the campaign in Smartlead.

Step 5 (optional): **HeyReach handoff.**
Pick option 1 (manual export of non-responders after 14 days) or option 2 (Smartlead webhook to HeyReach API). Use the existing LinkedIn M1-M4 sequence from monday doc 5027677770.

## Risks and open questions

1. **URL signal density.** Most of the 66 RB2B visitors so far only hit the catalog/homepage, not specific product pages. So `Product Category` is `Skip` for ~95% of current visitors, and persona-targeted Email 2 only fires for the small slice that drilled in. This will improve as traffic to specific product pages grows, but for now most leads get the generic Email 2.

2. **Company Domain mapping.** The Send action sends Company Domain (`equifax.com`) but the existing waterfall has a column called Company Website. They didn't auto-map, so the new column appears as a fresh field. Easy fix: toggle Auto-map ON in the Send action settings before the mass push, OR add a quick formula in the waterfall that mirrors Company Domain → Company Website.

3. **Lead quality at the C-suite level.** Find People returned strong C-suite results (CEOs of Equifax, Discovery Limited, Dyson all in the test sample). These are global C-levels at billion-dollar companies — high reply rates are unlikely. Worth asking: do we want to keep the seniority bar at C-suite for big enterprises, or step down to Director / Head when a Founder/CEO can't realistically be reached? Recommendation: leave it as-is for the first run, measure reply rate, then adjust.

4. **Sender domain warmup.** Existing Zapmail mailboxes have been warming since March 2026. Should be good for ~30-40 sends/day each. If we want to ramp faster, we'd need additional warmed domains.

5. **HeyReach automation gap.** Per Edward's SOP doc, the Evergreen workflow does NOT currently auto-handoff to HeyReach. If we want to build that automation properly for the RB2B campaign, it's a separate small project (a few hours).

## What the boss is being asked to decide

- Approve the email copy in `rb2b-campaign-copy-draft.md` (or send back edits).
- Approve the ~$230 spend to enrich the first 106 leads end to end.
- Approve sender mailbox split and daily cap.
- HeyReach handoff: option 1 (manual export) for first run, then plan option 2 later? Or skip LinkedIn for the first run entirely?
- Persona-aware Email 2: gate on Product Category, or send everyone the generic "All" variant for the first batch since URL signal is currently sparse?

Once those are settled, the flip-the-switch is the 4 steps above. Estimated end-to-end time from "go" to first email actually sending: ~30 minutes of Clay + Smartlead clicks, plus whatever email warmup and send-cap considerations you want.

## File index

- `handover.md` — original handover from May 22 session
- `handover-addendum-2026-05-24.md` — first addendum (formula columns, RB2B Company Enrichment, URL signal pivot, RB2B People)
- `rb2b-campaign-copy-draft.md` — full email and LinkedIn sequence copy for boss review
- `RB2B-system-overview-for-boss.md` — this document
