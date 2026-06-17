-- Marketa RAG brain — Sanity content vector store.
--
-- Mirrors the design in docs/marketa.md (Part A). One table, one vector store
-- ("the brain"). Sanity stays canonical; this is a queryable mirror that
-- Marketa retrieves from when drafting blogs.
--
-- Embeddings: Google Gemini `gemini-embedding-001` → 768-dim vectors. If the
-- embedding model ever changes, the column dimension and EVERY stored vector
-- must change together (re-embed the whole corpus), so the dimension is pinned
-- here on purpose. Keep this in lockstep with EMBEDDING_MODEL / EMBEDDING_DIM.
--
-- Run order: enable extension → table → indexes → retrieval function.
-- Apply against the brain project (Yash's Supabase) via the Supabase SQL
-- editor or `supabase db push`.

-- 1. pgvector
create extension if not exists vector;

-- 2. The brain table.
-- One row per chunk. A Sanity document fans out to N chunks (chunk_index
-- 0..N-1). On re-ingest we delete-then-insert all chunks for a source_id, so
-- (source_id, chunk_index) is unique but never carries stale tail chunks.
create table if not exists public.content_chunks (
  id                   bigint generated always as identity primary key,
  source_id            text        not null,             -- Sanity _id
  source_rev           text,                             -- Sanity _rev at embed time
  source_type          text        not null default 'sanity',
  source_path          text,                             -- slug.current
  chunk_index          int         not null default 0,
  body                 text        not null,             -- plaintext chunk
  embedding            vector(768),                     -- gemini gemini-embedding-001
  metadata             jsonb       not null default '{}'::jsonb,
  -- Sanity website content is public by definition; this lets the retrieval
  -- function stay simple and skips RLS complexity (see docs/marketa.md §7).
  confidentiality_level text       not null default 'public',
  token_count          int,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (source_id, chunk_index)
);

-- 3. Indexes.
-- HNSW for cosine ANN search (pgvector >= 0.5.0). cosine ops because we
-- normalise on similarity = 1 - distance in match_content_chunks below.
create index if not exists content_chunks_embedding_hnsw
  on public.content_chunks using hnsw (embedding vector_cosine_ops);

create index if not exists content_chunks_source_id_idx
  on public.content_chunks (source_id);

-- Industry is the only metadata field the draft retrieval filters on today.
create index if not exists content_chunks_industry_idx
  on public.content_chunks ((metadata->>'industry'));

-- 4. Retrieval RPC.
-- Returns the top `match_count` public chunks ordered by cosine distance.
-- When filter_industry is null or 'general', industry is ignored (global
-- retrieval). Otherwise it matches metadata.industry case-insensitively.
create or replace function public.match_content_chunks(
  query_embedding  vector(768),
  match_count      int  default 8,
  filter_industry  text default null
)
returns table (
  source_id   text,
  source_path text,
  body        text,
  metadata    jsonb,
  similarity  float
)
language sql stable
as $$
  select
    c.source_id,
    c.source_path,
    c.body,
    c.metadata,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.content_chunks c
  where c.confidentiality_level = 'public'
    and (
      filter_industry is null
      or filter_industry = 'general'
      or lower(c.metadata->>'industry') = lower(filter_industry)
    )
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

comment on table public.content_chunks is
  'Marketa RAG brain: chunked + embedded mirror of public Sanity website content. Ingested by /api/sanity-ingest. See docs/marketa.md Part A.';
comment on function public.match_content_chunks is
  'Top-k cosine retrieval over content_chunks, optionally filtered by metadata.industry. Used by the marketa-draft-blog n8n workflow.';
