import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal Cloudflare config. Caching uses the default in-worker behaviour.
// To enable persistent ISR/SSG caching later, create an R2 bucket and add an
// `incrementalCache: r2IncrementalCache` override here plus the matching
// NEXT_INC_CACHE_R2_BUCKET binding in wrangler.jsonc.
export default defineCloudflareConfig({});
