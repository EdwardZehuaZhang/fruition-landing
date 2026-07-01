-- Per-channel social post variants, keyed by (monday item, channel).
--
-- Why: the social-publishing approval loop generates one variant per channel
-- (LinkedIn, X, Instagram, YouTube, Pinterest) and posts them to Slack with
-- Approve/Edit/Skip buttons. On a button click, the interactivity endpoint must
-- re-read the exact approved text — but Slack button `value` caps at 2,000
-- chars and monday long_text truncates at ~2,000 too. So, exactly like
-- blog_drafts, the full variants live here and the click reads them back.
--
-- Written by src/app/api/webhooks/monday-blog (the "Ready to socialise" stage),
-- read + status-updated by src/app/api/webhooks/slack-interactivity.

create table if not exists public.social_variants (
  monday_item_id  text        not null,
  channel         text        not null,
  post_text       text        not null,
  title           text,                       -- youtube/pinterest carry a title
  media_urls      jsonb       not null default '[]'::jsonb,
  blog_url        text,
  status          text        not null default 'pending', -- pending|approved|published|skipped|error
  ayrshare_post_id text,
  result_summary  text,
  updated_at      timestamptz not null default now(),
  primary key (monday_item_id, channel)
);

comment on table public.social_variants is
  'Per-channel Marketa social variants for the approval loop. Sidesteps Slack button value + monday long_text length caps. Written by the monday-blog social stage, read/updated by slack-interactivity.';
