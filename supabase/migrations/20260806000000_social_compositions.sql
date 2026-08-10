-- Standalone social posts ("compositions") composed in the portal.
--
-- Why a table at all: blog-sourced social posts need no local storage — they're
-- found by scanning recent Zernio posts and filtering on post `metadata`
-- (src/lib/social/zernio.ts findSocialPosts). That doesn't work for ad-hoc posts:
--   * you can't save a half-written post without pushing a junk draft to Zernio;
--   * there's no author attribution ("who scheduled this?");
--   * the scan is O(all posts) and ad-hoc volume will dwarf blog volume.
--
-- What this table is NOT: a status mirror. Zernio stays the source of truth for
-- status, live URLs and analytics; this row holds identity + intent only, and
-- the composer merges live Zernio state on every read (same as buildPanelState).
-- `status` here is a cached rollup for list sorting/filtering, never trusted for
-- publish decisions.
--
-- Written + read by src/app/api/internal/social/compose/**, portal project
-- (PORTAL_SUPABASE_URL), accessed through the service-role client getPortalAdmin.

create table if not exists public.social_compositions (
  id            uuid        primary key default gen_random_uuid(),
  title         text        not null,                          -- internal name, never published
  brief         text,                                          -- the idea prompt used for AI generation
  link          text,                                          -- optional URL, appended per platform rules
  master_content text,                                         -- shared caption the per-platform copy derives from
  media_urls    jsonb       not null default '[]'::jsonb,       -- this composition's uploaded images (Sanity CDN URLs)
  platforms     jsonb       not null default '{}'::jsonb,       -- platformKey -> {zernioPostId, content, title, subreddit, boardId, mediaUrl}
  post_ids      text[]      not null default '{}',              -- flat Zernio post ids, for reverse lookup from the dashboard
  scheduled_for timestamptz,
  timezone      text,                                           -- IANA zone Zernio interprets scheduled_for in
  status        text        not null default 'draft',           -- draft|scheduled|publishing|published|mixed|failed (cached rollup)
  created_by    text,                                           -- portal user email
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.social_compositions is
  'Standalone (non-blog) social posts composed in the portal. Identity + intent only — Zernio remains source of truth for status, live URLs and analytics. One composition fans out to one Zernio post per platform, linked by metadata.marketaCompositionId.';

-- Dashboard: given a Zernio post id, find the composition it belongs to.
create index if not exists social_compositions_post_ids_idx
  on public.social_compositions using gin (post_ids);

-- List view: newest first, and the scheduled queue.
create index if not exists social_compositions_created_at_idx
  on public.social_compositions (created_at desc);
create index if not exists social_compositions_scheduled_idx
  on public.social_compositions (scheduled_for)
  where scheduled_for is not null;

-- Shared team workspace, exactly like portal_drafts: any signed-in portal user
-- can open and edit any composition. The portal is domain-locked in the app
-- layer (src/lib/portalAuth.ts). App queries use the service-role client which
-- bypasses RLS, so this is defense-in-depth.
alter table public.social_compositions enable row level security;

drop policy if exists social_compositions_shared on public.social_compositions;
create policy social_compositions_shared on public.social_compositions
  for all
  to authenticated
  using (true) with check (true);
