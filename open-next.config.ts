import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";

// Persistent ISR cache in Workers KV (NEXT_INC_CACHE_KV binding in
// wrangler.jsonc). Without it every isolate re-rendered pages from scratch,
// firing the full set of Sanity queries per render — which is what blew the
// Sanity API CDN request quota. The regional cache layer keeps hot entries in
// the colo's Cache API to cut KV reads too.
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(kvIncrementalCache, { mode: "long-lived" }),
});
