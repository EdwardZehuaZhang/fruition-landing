import { NextResponse } from "next/server"
import { getPortalClient } from "@/lib/portalAuth"

export const runtime = "nodejs"

async function handle(req: Request) {
  const origin = new URL(req.url).origin
  const supabase = await getPortalClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL("/internal/login", origin))
}

export async function POST(req: Request) {
  return handle(req)
}

// Allow GET too, so a plain link can sign out.
export async function GET(req: Request) {
  return handle(req)
}
