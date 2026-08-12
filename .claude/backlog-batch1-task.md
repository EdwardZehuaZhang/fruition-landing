# Fruition Website Backlog Batch 1

Work in /Users/astrid/Github/worktrees/backlog-batch1 on branch backlog-batch1-20260812.
Commit ONE item at a time. Do NOT merge or deploy. Run build to verify after all changes.

## Item 1 — #21 Remove double hyphens (Monday #2821026218)
Search entire src/ for text-content double hyphens `--` (NOT CSS var(--foo), NOT comment dividers). Replace with single hyphen `-`. Edward prefers NO em dashes.

## Item 2 — #14 Bengaluru to Delhi (Monday #2819235883)
Replace all Bengaluru references with Delhi:
- src/components/sections/BookingSection.tsx line 670: Bengaluru to Delhi
- src/components/sections/WorldMap.tsx: add delhi coords, update bengaluru entry
- src/data/teamRoster.ts line 67: update comment
- Any other Bengaluru references

## Item 3 — #3 Hero heading issue (Monday #2773675499)
Inspect src/components/home/HeroNetwork.tsx. The h1 has class "text-display text-foreground lg:text-[52px] lg:leading-[1.16]" with style textWrap pretty. The text is "Implementation, integration and AI advisory for monday.com, Atlassian and HubSpot." — very long. Ensure it renders properly at all breakpoints. Add responsive sizing and overflow handling.

## Item 4 — #8 Setup redirects (Monday #2816307976)
Redirect system exists (next.config.ts auditRedirects, src/redirects.ts wixRedirects, middleware). Audit existing redirects. Add any missing common redirects. Check for popular old URLs that should redirect.

## Item 5 — #9 UK monday.com UTM Tracker (Monday #2817806806)
Find all monday.com signup links in src/app/monday-partner-uk/MondayPartnerUkContent.tsx and add UTM tracking: ?utm_source=fruition and utm_medium=referral and utm_campaign=uk_partner_page. Also check monday-partner-uk/page.tsx for Sanity-driven links.

## Item 6 — #13 US and Singapore links (Monday #2819235763)
Check nav-v2.ts for US/Singapore links. Pages exist at /monday-partner-singapore and /monday-partner-us. Add missing nav links or cross-links.

## Item 7 — #12 Footer linkage (Monday #2819295283)
Inspect Footer.tsx. Verify: office location links, phone tel: links, email link, partner logo rendering, social links, legal links. Fix any issues.

## Item 8 — #19 FAQ changes not applying (Monday #2819519127)
FAQ data flow: Sanity CMS -> getFaqItemsForPage() in queries.ts -> groupFaqsIntoTabs() -> FaqAccordion.
Sanity client uses useCdn: true (~60s cache). revalidate = 60 in layout.tsx.
Fix: Create a non-CDN freshClient in src/sanity/client.ts and use it for FAQ queries.

## Item 9 — #17 Phone icon popup (Monday #2819283074)
Create src/components/RegionalPhonePopup.tsx: phone icon button that opens a dialog showing all regional office phone numbers from siteSettings.offices, with clickable tel: links. Wire into Footer.tsx replacing inline phone list.

## Item 10 — #15 Awfis Delhi (Monday #2819325148)
Add Awfis Delhi office to site settings. Check scripts/ for seed data or create office entry. Properties: flag IN, city Delhi India, label Awfis Delhi Office, href /monday-partner-india.

## Item 11 — #16 WeWork Philippines (Monday #2819325255)
Add WeWork Philippines office. Properties: flag PH, city Manila Philippines, label WeWork Philippines Office, href /monday-partner-philippines.

## Final
Run: npm run build. If fails, fix. Then: git push origin backlog-batch1-20260812.
Report each commit hash, any failures, and build status.
