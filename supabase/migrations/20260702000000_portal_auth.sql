-- Internal portal auth + editorial data.
--
-- Lives in the DEDICATED portal Supabase project (PORTAL_SUPABASE_*), separate
-- from the Marketa "brain" project (MARKETA_SUPABASE_*). See docs/portal-auth-setup.md.
--
-- Login is Google Workspace SSO locked to @fruitionservices.io (enforced by the
-- Internal Google consent screen + a server-side email/hd check in
-- src/lib/portalAuth.ts). These tables hold author identity and draft posts.

-- Author identity: links a Supabase auth user to their public Sanity teamMember.
create table if not exists public.authors (
  supabase_user_id      uuid primary key references auth.users (id) on delete cascade,
  email                 text not null,
  display_name          text not null,
  role                  text,
  sanity_team_member_id text,          -- Sanity teamMember _id (created via onboarding)
  byline                text,          -- overrides display_name as the blog byline when set
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Optional explicit allow-list for revocation (belt-and-suspenders over the domain check).
create table if not exists public.authorized_users (
  email    text primary key,
  active    boolean not null default true,
  added_at  timestamptz not null default now()
);

-- Editorial drafts saved from the portal before publishing to Sanity.
-- Separate from Marketa's blog_drafts table (which is in the brain project).
create table if not exists public.portal_drafts (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid references auth.users (id) on delete set null,
  sanity_doc_id text,                  -- set once published (blog-portal-<slug>)
  title         text,
  body_markdown text,
  metadata      jsonb not null default '{}'::jsonb,  -- excerpt, industry, categoryIds, seo, coverAssetId
  updated_at    timestamptz not null default now()
);

alter table public.authors       enable row level security;
alter table public.portal_drafts enable row level security;

-- Authors read/update only their own row.
drop policy if exists authors_self on public.authors;
create policy authors_self on public.authors
  for all using (auth.uid() = supabase_user_id) with check (auth.uid() = supabase_user_id);

-- Drafts are private to their author.
drop policy if exists drafts_owner on public.portal_drafts;
create policy drafts_owner on public.portal_drafts
  for all using (auth.uid() = author_id) with check (auth.uid() = author_id);
