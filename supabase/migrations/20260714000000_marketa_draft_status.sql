-- Marketa draft pipeline: add status, Google Doc, LinkedIn columns to portal_drafts
ALTER TABLE public.portal_drafts 
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'drafted';

ALTER TABLE public.portal_drafts
  ADD COLUMN IF NOT EXISTS google_doc_url text;

ALTER TABLE public.portal_drafts
  ADD COLUMN IF NOT EXISTS linkedin_copy text;

ALTER TABLE public.portal_drafts
  ADD COLUMN IF NOT EXISTS linkedin_doc_url text;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_drafts_status_check') THEN
    ALTER TABLE public.portal_drafts ADD CONSTRAINT portal_drafts_status_check 
    CHECK (status IN ('drafted', 'edited', 'published'));
  END IF;
END $$;
