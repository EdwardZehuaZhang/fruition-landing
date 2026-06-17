-- Full blog drafts, keyed by monday item id.
--
-- Why: monday.com long-text columns cap at ~2,000 characters and silently
-- truncate anything longer, which chopped Marketa's blog drafts down to the
-- intro (~360 words). The n8n draft workflow now writes the FULL Claude output
-- here, and the auto-docs builder (src/app/api/webhooks/monday-blog/route.ts)
-- reads the complete draft from this table to build the Google Doc — instead
-- of the truncated monday column. monday keeps only a short preview + the URLs.

create table if not exists public.blog_drafts (
  monday_item_id text        primary key,
  body           text        not null,
  updated_at     timestamptz not null default now()
);

comment on table public.blog_drafts is
  'Full (untruncated) Marketa blog drafts. Written by the n8n draft workflow, read by the monday-blog auto-docs route. Sidesteps monday long_text 2000-char cap.';
