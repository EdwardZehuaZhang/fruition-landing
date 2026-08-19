-- Internal portal invoices.
--
-- Apply by hand in the portal Supabase project's SQL editor — there are no
-- local credentials for DDL on that project, and nothing runs this file
-- automatically. Safe to re-run.
--
-- The API routes talk to these tables with the service-role key, which
-- bypasses RLS; the policies below only matter if the tables are ever read
-- with a user's own JWT.

-- Invoices table
CREATE TABLE IF NOT EXISTS fruition_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_no TEXT NOT NULL,
  invoice_date TEXT NOT NULL,
  billing_month TEXT,
  billing_period TEXT,
  currency TEXT DEFAULT 'USD',
  consultant_name TEXT,
  consultant_address TEXT,
  consultant_phone TEXT,
  consultant_email TEXT,
  wise_name TEXT,
  wise_tag TEXT,
  billing_address TEXT,
  notes TEXT,
  line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  region TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- The list route filters by user_id and orders by created_at.
CREATE INDEX IF NOT EXISTS fruition_invoices_user_created_idx
  ON fruition_invoices (user_id, created_at DESC);

ALTER TABLE fruition_invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can CRUD own invoices" ON fruition_invoices;
CREATE POLICY "Users can CRUD own invoices" ON fruition_invoices
  FOR ALL USING (auth.uid() = user_id);

-- Consultant profiles
CREATE TABLE IF NOT EXISTS fruition_consultant_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  consultant_name TEXT DEFAULT 'Edward (Zehua) Zhang',
  consultant_address TEXT,
  consultant_phone TEXT,
  consultant_email TEXT,
  wise_name TEXT,
  wise_tag TEXT,
  region TEXT DEFAULT 'APAC',
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE fruition_consultant_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can CRUD own profile" ON fruition_consultant_profiles;
CREATE POLICY "Users can CRUD own profile" ON fruition_consultant_profiles
  FOR ALL USING (auth.uid() = user_id);
