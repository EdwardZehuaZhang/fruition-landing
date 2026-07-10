-- Design documents: PDFs restyled into Fruition-branded HTML by Claude.
--
-- Lives in the DEDICATED portal Supabase project (PORTAL_SUPABASE_*), same as
-- portal_drafts. The original PDF is not persisted — only the generated HTML.

create table if not exists public.design_docs (
  id              uuid primary key default gen_random_uuid(),
  author_id       uuid references auth.users (id) on delete set null,
  title           text not null default 'Untitled document',
  source_filename text,
  html            text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.design_docs enable row level security;

-- Docs are private to their author.
drop policy if exists design_docs_owner on public.design_docs;
create policy design_docs_owner on public.design_docs
  for all using (auth.uid() = author_id) with check (auth.uid() = author_id);
