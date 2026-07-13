-- Blog drafts become a shared team workspace.
--
-- Product intent: each draft has ONE link that any signed-in portal user can
-- open, edit, and publish — not a per-author silo. The portal is already
-- domain-locked to @fruitionservices.io in the app layer (src/lib/portalAuth.ts),
-- so "authenticated" here means "a Fruition portal user".
--
-- Note: app queries currently use the service-role client (getPortalAdmin),
-- which bypasses RLS, so this policy is defense-in-depth — it keeps the schema
-- honest and prevents shared drafts from silently disappearing if any code ever
-- switches to the anon/cookie-bound client.

drop policy if exists drafts_owner on public.portal_drafts;

create policy drafts_shared on public.portal_drafts
  for all
  to authenticated
  using (true) with check (true);
