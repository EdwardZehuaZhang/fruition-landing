import { notFound } from "next/navigation"
import { requirePortalUser } from "@/lib/portalAuth"

export const dynamic = "force-dynamic"

/**
 * Catches every /internal URL no real page claims.
 *
 * Next's own handling of an unmatched URL is the ROOT not-found, which is the
 * marketing site's 404 — the wrong answer for the portal, and actively
 * misleading for someone who is simply signed out. Matching here instead means
 * the gate runs first: signed-out visitors get the login screen and land on the
 * URL they asked for once they're in, and signed-in ones fall through to the
 * portal's own not-found.
 *
 * Static and dynamic segments both beat a catch-all in Next's route matching,
 * so this never shadows a real page.
 */
export default async function InternalCatchAll({
  params,
}: {
  params: Promise<{ unknown?: string[] }>
}) {
  const { unknown } = await params
  const path = `/internal/${(unknown ?? []).map(encodeURIComponent).join("/")}`
  await requirePortalUser({ next: path })
  notFound()
}
