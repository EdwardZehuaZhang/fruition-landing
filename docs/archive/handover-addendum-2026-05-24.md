# RB2B to Clay / Smartlead Handover (addendum)

Date: 2026-05-24
Author: Cowork session continuation

This addendum extends the original handover.md. Nothing in the previous handover is retracted. Evergreen workbooks, the existing Smartlead campaigns, HeyReach, and the `Used Leads` table were not touched.

## What was built in this session

### Source webhook table (Pull in data from a Webhook Table)

Six read-only formula columns were added to parse the `Webhook` payload into explicit fields. The raw `Webhook` column is unchanged.

| Column | Formula | Notes |
|---|---|---|
| Profile Type | `{{Webhook}}?.ProfileType \|\| ""` | Values observed: Company. Test payload (row 1) is blank. |
| Website URL | `{{Webhook}}?.Website \|\| ""` | Full URL including https://. |
| Company Name | `{{Webhook}}?.["Company Name"] \|\| {{Webhook}}?.CompanyName \|\| ""` | Handles both JSON key variants. |
| LinkedIn URL | union of `Linked In Url`, `Linked In URL`, `LinkedInUrl`, `LinkedInURL` | Handles all observed key variants. |
| Industry | `{{Webhook}}?.Industry \|\| ""` | |
| Estimated Employee Count | union of `Estimated Employee Count`, `EstimatedEmployeeCount`, `Employee Count` | |

All 66 rows populated successfully.

### Routing action on source

A `Send table data` action column was added to the source webhook table. Configuration:

- Destination: `RB2B Company Enrichment` (new table, see below)
- Method: Send row
- Columns sent: Created At + all 6 extract columns above
- Run condition: `{{Profile Type}} == "Company"`
- Auto-run: OFF (manual `Click to run` per row)
- Update existing rows on re-run: ON
- Auto-extract new columns: ON

Rows 2 (Fruition, fruitionservices.io), 5 (monday.com visitor, Company Name `WhatsApp NSDC Digital Skills Academy`), and 13 (Savant AECOM, aecom.com) were manually triggered as a test. All three sent successfully. Action column status: 3/66 rows sent (5% complete).

### New RB2B Company Enrichment table

Created as a new tab in the `RB2B Visitors` workbook (sibling of `Pull in data from a Webhook Table`). Schema is auto-derived from the source's Send table data action, so it has the 6 parsed columns plus Created At plus an automatic `Rows from: Pull in data from a Webhook Table` link column showing provenance.

URL: still in the `RB2B Visitors` workbook at https://app.clay.com/workspaces/1035380/workbooks/wb_0tffjy4DsD7ccwpp3Ra (use the bottom tab `RB2B Company Enrichment`).

Current row count: 4 (1 placeholder + 3 test companies sent above).

### Find People at Company enrichment on RB2B Company Enrichment

Added a `Custom Waterfall` enrichment column wrapping Find People at Company. Configuration:

- Inputs: Company Domain = Website URL; Company Social Profile URL = LinkedIn URL.
- Providers configured (5/5, ordered as Clay default): Companies People Jobs (1 cr), Surfe (0.1 cr), Prospeo (or 0.3/result), Openmart (or 1/result), Pubrio APAC (or 6/row). All toggled ON.
- Estimated cost: ~1.8 credits per row.
- No per-provider ICP title filters applied yet (this is the next refinement; see Open items).

Test: row 2 (Fruition) was triggered and returned a `Regional Delivery Manager` employee. This confirms the waterfall is wired and credits are flowing. Rows 3 and 4 may still be queued.

## What was NOT done (intentional)

- No leads were pushed to Smartlead. The `Add Lead to Campaign` action on `RB2B Warm Leads - Waterfall` was not clicked. `RB2B Warm Leads - Fruition` Smartlead campaign remains in Draft.
- No edits to any Evergreen workbook table (`Work Management (ANZ) #1`, `CRM (ANZ) #1`, `Ticketing (ANZ) #1`, `Used Leads`, regional CRM tables, etc.).
- No edits to `RB2B Warm Leads - Waterfall` (the Templates-folder clone).
- No webhook source rows were deleted.
- No Person-route formula columns (First Name, Last Name, Work Email) were added to source. The 3 Person-ready candidates from the original handover (Martin Kaas, Stephanie Falconi-Brown, Pankhuri Saxena) live in `RB2B Warm Leads - Waterfall` and are still being processed there. They are NOT in `RB2B Company Enrichment` because they would be Person-typed not Company-typed.
- No write-back from `RB2B Company Enrichment` to `RB2B Warm Leads - Waterfall`. That step is queued (see Open items).

## Known limitations and open items

### Limitation 1: Find People at Company returns one person summary, not multiple

The `Find People at Company` waterfall returns a single best-match person per company into a cell. To get up to N people per company (the user requested 3), use Clay's separate `Find people` SOURCE pattern instead: it creates a new table where each ICP match becomes its own row. This is a follow-up refactor.

### Limitation 2: ICP filters not applied at the provider level

Per-provider title filters were not configured. The Evergreen workbooks do not store an ICP as a Find People filter, their rows came from CSV imports of pre-filtered people. So an ICP for Find People has to be defined fresh.

Recommended union ICP (decided in session): titles containing one of `CEO, COO, CRO, CFO, President, Founder, Owner, VP, Director, Head, Chief, Managing Director, Operations, Project, Practice, Sales, Revenue, Customer Success, Support, IT`. Cap at 3 people per company.

This ICP needs to be entered in each of the 5 providers' Full configuration, OR enforced downstream with a formula column that filters person rows by Title regex.

### Limitation 3: Website URL contains the protocol

The `Website URL` formula returns `https://...` which Clay flagged as "Some rows may not resemble a Company Domain". Providers may normalize internally so this might be fine. If results are noisy, add a formula column `Company Domain` that strips the protocol and trailing slash, e.g. `{{Website URL}}.replace(/^https?:\/\//, "").replace(/\/.*$/, "")`, and rebind the Find People input to that.

### Open item: Person-route

The original handover Step 3 says `Profile Type = Person` should go directly to `RB2B Warm Leads - Waterfall`. No Send action was set up for Person rows because (a) source has 0 visible Person rows so far and (b) the existing waterfall clone is sourced from `AI Ark - People` template, not the webhook table, so the routing target would need a small adapter mapping. Manually adding any Person rows to the waterfall (as the original handover already does) remains the path until a Person-route Send action is built.

### Open item: Push to Smartlead

Still gated as per the original handover: do not click the `Add Lead to Campaign` action on `RB2B Warm Leads - Waterfall` until final valid emails and copy are reviewed.

## Concrete next steps

1. Decide whether to refactor Find People to the `Find people` SOURCE pattern for up to 3 people per company, or accept one-per-company.
2. Optionally add a `Company Domain` formula column on the source that strips https:// from Website URL, and rebind Find People's Company Domain input to it.
3. Configure per-provider ICP title filters in the Find People waterfall (union of CRM + WM + Ticketing personas as listed above).
4. Trigger Send on remaining ~62 source rows to populate RB2B Company Enrichment fully (or flip Auto-run ON now that the filter is verified).
5. Run Find People against all rows.
6. Build the person-to-waterfall path: a Send table data action on the people output table, writing to `RB2B Warm Leads - Waterfall` with field mapping (First Name, Last Name, Company Website, LinkedIn URL).
7. Run the A-E email waterfall on the resulting person rows.
8. Manually review final valid emails and copy.
9. Only then click `Add Lead to Campaign` to push to the `RB2B Warm Leads - Fruition` Smartlead campaign.

## Links

- RB2B Visitors workbook: https://app.clay.com/workspaces/1035380/workbooks/wb_0tffjy4DsD7ccwpp3Ra
- Source webhook table (with new parsed columns): https://app.clay.com/workspaces/1035380/workbooks/wb_0tffjy4DsD7ccwpp3Ra/tables/t_0tffjyw2uEqsFkNt5NE/views/gv_0tffjyxYV3CPtgxqrZr
- RB2B Company Enrichment (new): https://app.clay.com/workspaces/1035380/workbooks/wb_0tffjy4DsD7ccwpp3Ra/tables/t_0tfj4vx9ik8KFYKEoGo/views/gv_0tfj4vxknfMME4686mP
- RB2B Warm Leads - Waterfall (unchanged): https://app.clay.com/workspaces/1035380/tables/t_0tfflsyBVj7TMzktmBX/views/gv_0t8w8c6AC2hD4gFWY5x
- Smartlead campaign (Draft, untouched): https://app.smartlead.ai/app/email-campaigns-v2/3379028/leads

## Addendum part 2 (later in same session)

### URL signal investigation

Per request, we explored mirroring the Evergreen Workbook's three-persona structure (Work Mgmt / CRM / Ticketing) by routing RB2B visitors based on which Fruition product page they hit. Three new columns were added to the source webhook table to support this:

- `Recent Page URLs` — formula extracting the page URL list from the webhook payload, joined as a comma-separated string for human readability.
- `RB2B Persona` — an experimental Use AI column that asked an LLM to classify each visitor into Work Mgmt / CRM / Ticketing / All using Industry + Company Name + Estimated Employee Count + Recent Page URLs. Ran on 10 test rows at ~3 credits/row.
- `Product Category` — a deterministic formula returning `Ticketing` (if URLs contain `/monday-service`), `CRM` (if `/monday-crm-consulting` or `/solar-crm-solution`), `Work Management` (if `/monday-project-management` or `/monday-product-management`), else `Skip`.

### Finding: URL signal is sparse in current data

Across the first 12 inspected source rows, the deterministic Product Category formula returned `Skip` for every single row. The first 10 rows from the AI fallback returned mostly chatty refusals like "Insufficient data to classify" or "I cannot classify..." rather than a clean persona label, with only 2 of 10 rows producing a usable persona (Fruition self-visit = All, West Noble School = Work Management).

Root cause: most visitors only landed on `/monday-consulting-solutions/catalog` and the homepage `/`. RB2B's Recent Page URLs do not capture in-page interactions (clicks, hovers, scroll depth) — only the URLs visited. Without a visit to a specific product page like `/monday-crm-consulting`, there is no way to route by URL.

The columns and formulas remain in place. When traffic patterns shift toward product-specific pages in the future, `Product Category` will start returning real persona labels and a routing layer can be added on top. Until then, building three persona-segmented tables would result in two empty tables and one nearly empty table, plus 3x credit cost.

### Pivot: one unified RB2B People table

New table added as a sibling tab in the RB2B Visitors workbook: `RB2B People`. Built using Clay's `Find people` SOURCE pattern. Configuration:

- Source: `Pull in data from a Webhook Table` (Clay auto-detected 62 Company-typed rows as input).
- Seniority filter: Founder, Owner, C-suite, VP, Director, Head.
- Limit per company: 3.
- Other ICP filters (Job functions, Job title, Location): not set.

Output: 106 people across 62 companies, with First Name, Last Name, Company Table Data link, and additional columns auto-generated by Find People. Structure mirrors `Work Management (ANZ) #1`'s people-level shape, so the existing A-E email waterfall pattern can be cloned onto this table later.

### What was deliberately NOT done in this addendum extension

- No `Work Email` enrichment added to RB2B People. Adding it at ~2.1 credits per row would cost ~$390 to enrich all 106 people. Defer until you are ready to actually push to Smartlead.
- No A-E email waterfall column added to RB2B People. The existing `RB2B Warm Leads - Waterfall` clone has that schema and can either be reused (by routing person rows into it) or copied to RB2B People.
- No three-persona-tables built (decided against given URL signal evidence).
- No Smartlead push.
- Existing Evergreen workbooks untouched.

### Concrete next steps (revised)

1. Spot-check the 106 RB2B People for quality — are the surfaced contacts useful Fruition ICP?
2. Optionally tighten Find people filters (e.g., add `Job title is similar to: CEO, COO, CRO, CFO, Founder, Director, Head of Operations, Head of Sales, Operations Manager, Project Manager`).
3. Add Work Email enrichment column on RB2B People. ~$390 in credits at 106 rows. Or reuse the existing A-E waterfall by routing person rows into `RB2B Warm Leads - Waterfall`.
4. Validate emails via MillionVerifier / TryKitt as in the existing waterfall.
5. Review the final-valid emails and Smartlead campaign copy.
6. Only after manual approval, click `Add Lead to Campaign` to push to `RB2B Warm Leads - Fruition` Smartlead campaign.
7. When/if visitor URL patterns shift toward product pages, the existing `Product Category` formula will start labelling rows. At that point, a routing layer can split RB2B People into persona-specific tables retroactively.

### Updated link list

- Source webhook table (with parsed + persona columns): https://app.clay.com/workspaces/1035380/workbooks/wb_0tffjy4DsD7ccwpp3Ra/tables/t_0tffjyw2uEqsFkNt5NE/views/gv_0tffjyxYV3CPtgxqrZr
- RB2B Company Enrichment: https://app.clay.com/workspaces/1035380/workbooks/wb_0tffjy4DsD7ccwpp3Ra/tables/t_0tfj4vx9ik8KFYKEoGo/views/gv_0tfj4vxknfMME4686mP
- RB2B People (new, 106 rows): https://app.clay.com/workspaces/1035380/workbooks/wb_0tffjy4DsD7ccwpp3Ra/tables/t_0tfj93u8hBkSzAQRGoT/views/gv_0tfj93vBRkMFTdqJD6H
