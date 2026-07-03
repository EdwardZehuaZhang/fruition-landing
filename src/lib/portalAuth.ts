/**
 * Internal portal auth — Supabase Auth + Google Workspace SSO.
 *
 * Replaces the shared-password gate (src/lib/internalAuth.ts). Login is Google
 * OAuth locked to the @fruitionservices.io Workspace domain. There is NO
 * Next.js middleware here (Next 16 forces it onto the Node runtime and the
 * Cloudflare OpenNext adapter can't deploy it), so every portal page / API
 * route gates itself server-side by calling requirePortalUser().
 *
 * OAuth is initiated server-side (see /internal/auth/start), so the anon key
 * never has to ship to the browser.
 *
 * Env (portal Supabase project — see docs/portal-auth-setup.md):
 *   PORTAL_SUPABASE_URL, PORTAL_SUPABASE_ANON_KEY,
 *   PORTAL_SUPABASE_SERVICE_ROLE_KEY, PORTAL_ALLOWED_EMAIL_DOMAIN
 */
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { User } from "@supabase/supabase-js"

export const LOGIN_PATH = "/internal/login"

export function allowedDomain(): string {
  return (process.env.PORTAL_ALLOWED_EMAIL_DOMAIN || "fruitionservices.io").toLowerCase()
}

function url(): string {
  const v = process.env.PORTAL_SUPABASE_URL
  if (!v) throw new Error("PORTAL_SUPABASE_URL missing")
  return v
}

function anonKey(): string {
  const v = process.env.PORTAL_SUPABASE_ANON_KEY
  if (!v) throw new Error("PORTAL_SUPABASE_ANON_KEY missing")
  return v
}

/**
 * Cookie-bound Supabase client for server components and route handlers.
 * `setAll` is a no-op-on-throw so it's safe to call from read-only server
 * components (cookies can only be written in route handlers / server actions).
 */
export async function getPortalClient() {
  const cookieStore = await cookies()
  return createServerClient(url(), anonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(items) {
        try {
          for (const { name, value, options } of items) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // Called from a server component — ignore; the session is refreshed
          // in the auth callback / route handlers where writes are allowed.
        }
      },
    },
  })
}

/** Service-role client for privileged writes (bypasses RLS). Server-only. */
export function getPortalAdmin(): SupabaseClient {
  const key = process.env.PORTAL_SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error("PORTAL_SUPABASE_SERVICE_ROLE_KEY missing")
  return createClient(url(), key, { auth: { persistSession: false } })
}

export function isAllowedEmail(email: string | undefined | null): boolean {
  if (!email) return false
  return email.toLowerCase().endsWith(`@${allowedDomain()}`)
}

export interface AuthorProfile {
  supabase_user_id: string
  email: string
  display_name: string
  role: string | null
  sanity_team_member_id: string | null
  byline: string | null
}

/** Returns the signed-in, domain-allowed user or null. Does not redirect. */
export async function getPortalUser(): Promise<User | null> {
  const supabase = await getPortalClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !isAllowedEmail(user.email)) return null
  return user
}

/**
 * Server-side gate for portal pages and API routes. Redirects to the login page
 * (pages) or returns null (API routes pass `{ api: true }` and handle the 401
 * themselves). Returns the user when allowed.
 */
export async function requirePortalUser(opts?: { next?: string }): Promise<User> {
  const user = await getPortalUser()
  if (!user) {
    const next = opts?.next ? `?next=${encodeURIComponent(opts.next)}` : ""
    redirect(`${LOGIN_PATH}${next}`)
  }
  return user
}

/** Non-redirecting variant for API route handlers. */
export async function getPortalApiUser(): Promise<User | null> {
  return getPortalUser()
}

/** Load the author profile row for a user, if any. */
export async function getAuthorProfile(userId: string): Promise<AuthorProfile | null> {
  const admin = getPortalAdmin()
  const { data } = await admin
    .from("authors")
    .select("supabase_user_id, email, display_name, role, sanity_team_member_id, byline")
    .eq("supabase_user_id", userId)
    .maybeSingle()
  return (data as AuthorProfile | null) ?? null
}

/** Insert a minimal author row on first login (idempotent). */
export async function ensureAuthorProfile(user: User): Promise<void> {
  const admin = getPortalAdmin()
  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Fruition Editorial"
  await admin
    .from("authors")
    .upsert(
      { supabase_user_id: user.id, email: user.email, display_name: displayName },
      { onConflict: "supabase_user_id", ignoreDuplicates: true },
    )
}

/** The byline to stamp on a post for this user (profile byline > display name). */
export async function bylineFor(user: User): Promise<string> {
  const profile = await getAuthorProfile(user.id)
  return (
    profile?.byline ||
    profile?.display_name ||
    (user.user_metadata?.full_name as string | undefined) ||
    "Fruition Editorial"
  )
}
