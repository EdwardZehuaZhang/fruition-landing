import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

// Persistent ISR cache in Workers KV (NEXT_INC_CACHE_KV binding in
// wrangler.jsonc). Without it every isolate re-rendered pages from scratch,
// firing the full set of Sanity queries per render — which is what blew the
// Sanity API CDN request quota. The regional cache layer keeps hot entries in
// the colo's Cache API to cut KV reads too.
//
// The tag cache (D1, NEXT_TAG_CACHE_D1) is what makes `revalidatePath()` work.
// Without it the adapter falls back to the "dummy" tag cache, on-demand
// revalidation is a silent no-op, and a cached page stays frozen until the
// next deploy — which is why editing a published blog post never showed up on
// the site. The portal's publish route revalidates the affected paths; see
// src/lib/revalidateSite.ts.
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(kvIncrementalCache, { mode: "long-lived" }),
  tagCache: d1NextTagCache,
});
