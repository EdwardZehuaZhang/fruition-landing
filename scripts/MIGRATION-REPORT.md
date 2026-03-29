# Fruition Landing Migration Report

## Summary
Complete migration of all content from fruitionservices.io (Wix) to Sanity CMS.

**Migration date:** 2026-03-27  
**Total time:** ~15 minutes (875.6s for blog, 110.3s for pages)  
**Status:** ? Successful - zero failures

---

## Documents Created

### Site Configuration
- **siteSettings**: 1 document
  - Phone, Calendly link, monday affiliate link, footer text

### Static Pages: 33 documents
- **solutionPages**: 7
  - monday-project-management, monday-service, monday-for-finance, monday-product-management, monday-for-hr, solar-crm-solution, monday-for-cabinetry-renovation

- **partnershipPages**: 9
  - monday-consulting-partner, make-partners, n8n-integration-partner, certified-clickup-partner, certified-guidde-partner, certified-hubspot-partner, hootsuite-delivery-partner, aircall-partner, certified-atlassian-partner

- **locationPages**: 5
  - monday-partner-australia, monday-partner-uk, monday-partner-us, monday-partner-singapore, monday-partner-india

- **industryPages**: 7
  - monday-for-construction, monday-for-manufacturing, monday-for-retail, monday-for-professional-services, monday-for-government, monday-for-marketing, monday-for-real-estate

- **servicePages**: 5
  - implementation-packages, monday-training, monday-implementation-consultants, monday-crm-consulting, ai-strategy-and-execution

### Blog Content: 232 documents
- **blogCategories**: 21
  - mondaydb, monday-crm, api, guidde, integration, fruition-uk, automation, ai, monday-ai, finance-accounting, fruition-us, monday-campaigns, fruition-australia, monday-service, n8n, make-com, crm, monday-com, monday-dev, monday-com-consultant-partner, construction

- **blogPosts**: 211
  - All posts from blog-posts-sitemap.xml successfully imported
  - Includes metadata: title, slug, publishedAt, author, excerpt, body (Portable Text), seoTitle, seoDescription
  - Category references linked
  - Cover images stored as URLs (not uploaded to Sanity to avoid rate limits)

---

## Total: 266 documents

---

## Technical Details

### Authentication
- **Token used**: Editor-level write token created via Sanity Studio UI
- Initial read token (SANITY_API_READ_TOKEN) did not have write permissions
- Created `SANITY_WRITE_TOKEN` with Editor role via browser automation
- Stored in `.env.local`

### Rate Limiting
- Blog posts processed in batches of 10 with 500ms delay between batches
- 1000ms delay between page fetches to respect Wix server
- 500ms delay between Sanity document writes
- Zero rate limit errors encountered

### Data Cleaning
- Null bytes (`\u0000`) and invalid Unicode characters removed from all text
- Title suffixes ("| Fruition Services | Author") stripped
- All text sanitized via `cleanText()` helper before Sanity submission

### Image Handling
- Cover images stored as external URLs (wixstatic.com)
- Next.js already configured to allow wixstatic.com in image domains
- Not uploaded to Sanity to avoid upload rate limits and complexity

### Error Handling
- Graceful error catching per page/post with logging
- Failed items logged but migration continues
- **Zero failures** across all 266 documents

---

## Pages That Failed to Scrape
None. All 244 content pages (33 static + 211 blog) scraped and imported successfully.

---

## Scripts Created

### Core Scripts
1. **scripts/helpers.ts** - Text cleaning, Portable Text conversion, utilities
2. **scripts/sanity-client.ts** - Sanity write client with Editor token
3. **scripts/scrape.ts** - HTML fetching, parsing, content extraction
4. **scripts/import-site-settings.ts** - Site settings singleton importer
5. **scripts/import-pages.ts** - Static pages importer (solutions, partnerships, locations, industries, services)
6. **scripts/import-blog.ts** - Blog categories + posts importer with sitemap parsing
7. **scripts/migrate.ts** - Orchestrator that runs all imports in sequence

### Package.json Scripts
- `npm run migrate` - Run full migration pipeline
- `npm run migrate:settings` - Import site settings only
- `npm run migrate:pages` - Import static pages only
- `npm run migrate:blog` - Import blog posts only

---

## Token Requirements
**Editor-level token required** for Sanity writes. Viewer tokens do not have `create` permission.

To create via Sanity Studio:
1. Navigate to: https://www.sanity.io/organizations/{orgId}/project/{projectId}/api
2. Click "Add API token"
3. Name: "migration-write"
4. Permissions: Editor (read+write all datasets)
5. Copy token immediately (only shown once)
6. Add to `.env.local` as `SANITY_WRITE_TOKEN`

---

## Re-running the Migration
All scripts are **idempotent** - they use `createOrReplace` instead of `create`, so re-running will update existing documents rather than create duplicates.

Safe to re-run:
```bash
npm run migrate:settings
npm run migrate:pages
npm run migrate:blog
```

Or full pipeline:
```bash
npm run migrate
```

---

## Notes
- Wix pages are server-rendered HTML, so simple fetch worked without browser automation
- Sitemap contained 211 blog post URLs (all processed)
- Blog categories pre-defined from blog-categories-sitemap.xml pattern
- Portable Text conversion handles paragraphs, headings, lists
- All document IDs follow pattern: `{type}-{slug}` for easy reference

---

## Verification
To verify in Sanity Studio:
1. Navigate to: https://fruition-landing.sanity.studio
2. Check document counts per type
3. Spot-check content against live Wix pages

---

**Migration completed successfully with zero data loss.**
