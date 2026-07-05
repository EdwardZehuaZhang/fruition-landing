/**
 * Mints short-lived Google API access tokens from a service-account key.
 *
 * The key is provided as base64-encoded JSON in `GOOGLE_SA_KEY_B64` (server-only
 * secret). Signing uses Web Crypto (SubtleCrypto) so this runs on both Node and
 * the Cloudflare Workers runtime (no `googleapis` dependency).
 *
 * Grant the service account read access in the Google products you query:
 *   - GA4:  Admin → Property Access Management → Viewer
 *   - GSC:  Settings → Users and permissions → Full
 */

interface ServiceAccount {
  client_email: string
  private_key: string
  token_uri?: string
}

function decodeBase64(b64: string): string {
  if (typeof atob === "function") return atob(b64)
  return Buffer.from(b64, "base64").toString("utf8")
}

function readServiceAccount(): ServiceAccount {
  const b64 = process.env.GOOGLE_SA_KEY_B64
  if (!b64) throw new Error("GOOGLE_SA_KEY_B64 missing")
  const sa = JSON.parse(decodeBase64(b64)) as ServiceAccount
  if (!sa.client_email || !sa.private_key) {
    throw new Error("GOOGLE_SA_KEY_B64 is not a valid service-account key")
  }
  return sa
}

function base64url(bytes: Uint8Array): string {
  let bin = ""
  for (const b of bytes) bin += String.fromCharCode(b)
  const b64 = typeof btoa === "function" ? btoa(bin) : Buffer.from(bin, "binary").toString("base64")
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

/** PEM (PKCS#8) private key → ArrayBuffer for crypto.subtle.importKey. */
function pemToArrayBuffer(pem: string): ArrayBuffer {
  const body = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "")
  const bin = decodeBase64(body)
  const buf = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i)
  return buf.buffer
}

// Access tokens live ~1h; cache per scope-set within the isolate.
const cache = new Map<string, { token: string; exp: number }>()

export async function getGoogleAccessToken(scopes: string[]): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const cacheKey = scopes.slice().sort().join(" ")
  const hit = cache.get(cacheKey)
  if (hit && hit.exp - 60 > now) return hit.token

  const sa = readServiceAccount()
  const tokenUri = sa.token_uri || "https://oauth2.googleapis.com/token"

  const header = base64url(new TextEncoder().encode(JSON.stringify({ alg: "RS256", typ: "JWT" })))
  const claims = base64url(
    new TextEncoder().encode(
      JSON.stringify({
        iss: sa.client_email,
        scope: scopes.join(" "),
        aud: tokenUri,
        iat: now,
        exp: now + 3600,
      }),
    ),
  )
  const signingInput = `${header}.${claims}`

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(sa.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const signature = new Uint8Array(
    await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(signingInput)),
  )
  const assertion = `${signingInput}.${base64url(signature)}`

  const res = await fetch(tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  })
  if (!res.ok) {
    throw new Error(`Google token exchange failed: ${res.status} ${await res.text()}`)
  }
  const data = (await res.json()) as { access_token: string; expires_in: number }
  cache.set(cacheKey, { token: data.access_token, exp: now + data.expires_in })
  return data.access_token
}
