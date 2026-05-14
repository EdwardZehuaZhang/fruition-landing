import { createHmac, timingSafeEqual } from "node:crypto"

export const INTERNAL_COOKIE = "fruition_internal"
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days

function getSecret(): string {
  const s = process.env.INTERNAL_AUTH_SECRET
  if (!s || s.length < 32) {
    throw new Error("INTERNAL_AUTH_SECRET missing or too short (need >= 32 chars)")
  }
  return s
}

function getPassword(): string {
  const p = process.env.INTERNAL_ONBOARDING_PASSWORD
  if (!p) throw new Error("INTERNAL_ONBOARDING_PASSWORD missing")
  return p
}

export function checkPassword(input: string): boolean {
  const expected = Buffer.from(getPassword(), "utf8")
  const got = Buffer.from(input ?? "", "utf8")
  if (got.length !== expected.length) return false
  return timingSafeEqual(expected, got)
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex")
}

export function issueToken(now: number = Date.now()): string {
  const issuedAt = Math.floor(now / 1000)
  const payload = `ok|${issuedAt}`
  const sig = sign(payload)
  return `${payload}|${sig}`
}

export function verifyToken(token: string | undefined, now: number = Date.now()): boolean {
  if (!token) return false
  const parts = token.split("|")
  if (parts.length !== 3) return false
  const [tag, tsStr, sig] = parts
  if (tag !== "ok") return false
  const ts = Number(tsStr)
  if (!Number.isFinite(ts)) return false
  const ageSeconds = Math.floor(now / 1000) - ts
  if (ageSeconds < 0 || ageSeconds > SESSION_TTL_SECONDS) return false
  let expected: string
  try {
    expected = sign(`${tag}|${tsStr}`)
  } catch {
    return false
  }
  const a = Buffer.from(sig, "hex")
  const b = Buffer.from(expected, "hex")
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
}
