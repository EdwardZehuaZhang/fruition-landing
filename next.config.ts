import type { NextConfig } from "next";
import type { Redirect } from "next/dist/lib/load-custom-routes";
import { wixRedirects } from "./src/redirects";

// Redirects added after the Wix migration (e.g. from SEO/technical audits).
// src/redirects.ts is auto-generated from the migration import — add new
// entries here instead. Placed BEFORE wixRedirects so audits override.
const auditRedirects: Redirect[] = [
  // ── Consolidations (July 2026 traffic audit) ──
  // Case-study hub folded into the ranked client-stories library.
  { source: "/case-studies", destination: "/customer-testimonials", permanent: true },
  // Legacy Wix partnerships hub → the curated credentials directory.
  { source: "/partnerships", destination: "/certifications-and-awards", permanent: true },
  // Duplicate Aircall / Make pages → their canonical partner pages.
  { source: "/integrations/aircall", destination: "/partnerships/aircall-partner", permanent: true },
  { source: "/monday-consulting-solutions/aircall", destination: "/partnerships/aircall-partner", permanent: true },
  { source: "/integrations/make", destination: "/partnerships/make-partners", permanent: true },
  // Accidental duplicate blog post.
  { source: "/post/monday-com-vs-clickup-1", destination: "/post/monday-com-vs-clickup", permanent: true },
  // n8n service page folded into the certified-partner page (Aircall pattern).
  { source: "/ai-consulting/n8n", destination: "/partnerships/n8n-integration-partner", permanent: true },
  // monday-products cluster (July 2026 build, zero traffic) pruned into
  // the ranked monday.com service pages.
  { source: "/monday-products", destination: "/implementation-packages", permanent: true },
  { source: "/monday-products/crm", destination: "/monday-crm-consulting", permanent: true },
  { source: "/monday-products/service", destination: "/monday-consulting-solutions/monday-service", permanent: true },
  { source: "/monday-products/work-management", destination: "/implementation-packages", permanent: true },
  { source: "/monday-products/dev", destination: "/implementation-packages", permanent: true },
  { source: "/monday-products/ai", destination: "/implementation-packages", permanent: true },
  { source: "/monday-products/enterprise", destination: "/implementation-packages", permanent: true },

  // ── Legacy Wix URLs still receiving traffic (GA4, July 2026) ──
  { source: "/leadership", destination: "/fruition-team", permanent: true },
  { source: "/members", destination: "/fruition-team", permanent: true },
  { source: "/people", destination: "/fruition-team", permanent: true },
  { source: "/speakers", destination: "/fruition-team", permanent: true },
  { source: "/board", destination: "/fruition-team", permanent: true },
  { source: "/advisory-board", destination: "/fruition-team", permanent: true },
  { source: "/alumni", destination: "/fruition-team", permanent: true },
  { source: "/cohort", destination: "/fruition-team", permanent: true },
  { source: "/committee", destination: "/fruition-team", permanent: true },
  { source: "/faculty", destination: "/fruition-team", permanent: true },
  { source: "/graduates", destination: "/fruition-team", permanent: true },
  { source: "/blogs", destination: "/consulting-blog", permanent: true },
  { source: "/directory", destination: "/certifications-and-awards", permanent: true },
  { source: "/contact", destination: "/contact-us", permanent: true },
  { source: "/contacts", destination: "/contact-us", permanent: true },
  { source: "/enquiry", destination: "/contact-us", permanent: true },
  { source: "/enquiries", destination: "/contact-us", permanent: true },
  { source: "/agenda", destination: "/", permanent: true },
  { source: "/thank-you-page-1", destination: "/", permanent: true },
  // Broken trailing-dot variant seen in analytics.
  { source: "/monday-implementation-consultants.", destination: "/monday-implementation-consultants", permanent: true },
  {
    source: "/_files/ugd/a280a5_11fba06999d94082af98412eb473461c.pdf",
    destination: "/legal/deprecated/uk",
    permanent: true,
  },

  // WFO Legal agreements → Google Docs
  {
    source: "/legal/wfo-agreement-au",
    destination: "https://docs.google.com/document/d/1LPRN-5sS-dRKTsOgD-sAn6vH3_PpprTdchu_kqj-hgQ/edit?tab=t.0",
    permanent: true,
  },
  {
    source: "/legal/wfo-agreement-uk",
    destination: "https://docs.google.com/document/d/1C8SdBihVPCeWI4Fshs15mlpmNbAVcEz8YLPkdcEjrEE/edit?tab=t.0",
    permanent: true,
  },
  {
    source: "/legal/wfo-agreement-us",
    destination: "https://docs.google.com/document/d/1Pq-BsYgWVZhSGP3ZaTLiUQMdA7BbY6eE1K4wFwUJi5M/edit?tab=t.0",
    permanent: true,
  },
  // Managed Service agreements → Google Docs
  {
    source: "/legal/managed-service-agreement-au",
    destination: "https://docs.google.com/document/d/1knbbSPyIGg1CxfbPBjrwPuD6E6O38qgG7M7g5chu-JE/edit?tab=t.0",
    permanent: true,
  },
  {
    source: "/legal/managed-service-agreement-uk",
    destination: "https://docs.google.com/document/d/1g2pckxr4Ig1o_TZdkLfNy1Z_H-QUhSA5ulK10eWTLTk/edit?tab=t.0",
    permanent: true,
  },
  {
    source: "/legal/managed-service-agreement-us",
    destination: "https://docs.google.com/document/d/1WsFnSKy1XK4W75tDVQLBAxw_YbJrLG_IVGw7rgOgiiw/edit?tab=t.0",
    permanent: true,
  },
  //

  {
    source: "/solutions/monday-com-manufacturing",
    destination: "/monday-for-manufacturing",
    permanent: true,
  },

  // ── Dead-end repairs (August 2026 redirect audit) ──
  // Both of these were the tail of a Wix chain that landed on a page which
  // no longer exists, so the visitor got a 301 straight into a 404.
  { source: "/monday-com-training", destination: "/monday-training", permanent: true },
  { source: "/monday-crm-demo", destination: "/monday-crm-consulting", permanent: true },

  // ── Common URLs that were 404ing (August 2026 redirect audit) ──
  // Legal and policy shorthands people type or link directly.
  { source: "/privacy", destination: "/data-privacy", permanent: true },
  { source: "/privacy-policy", destination: "/data-privacy", permanent: true },
  { source: "/cookie-policy", destination: "/data-privacy", permanent: true },
  { source: "/gdpr", destination: "/data-privacy", permanent: true },
  { source: "/terms", destination: "/terms-and-conditions", permanent: true },
  { source: "/tos", destination: "/terms-and-conditions", permanent: true },
  { source: "/terms-of-service", destination: "/terms-and-conditions", permanent: true },
  // Singular/alternate spellings of pages that already exist.
  { source: "/faq", destination: "/faqs", permanent: true },
  { source: "/our-team", destination: "/fruition-team", permanent: true },
  { source: "/company", destination: "/about-us", permanent: true },
  { source: "/about-fruition", destination: "/about-us", permanent: true },
  { source: "/news", destination: "/consulting-blog", permanent: true },
  { source: "/partners", destination: "/certifications-and-awards", permanent: true },
  { source: "/training", destination: "/monday-training", permanent: true },
  { source: "/jobs", destination: "/careers", permanent: true },
  { source: "/work-with-us", destination: "/careers", permanent: true },
  { source: "/clients", destination: "/customer-testimonials", permanent: true },
  { source: "/testimonials", destination: "/customer-testimonials", permanent: true },
  { source: "/reviews", destination: "/customer-testimonials", permanent: true },
  { source: "/case-study", destination: "/customer-testimonials", permanent: true },
  { source: "/index", destination: "/", permanent: true },
  { source: "/sitemap", destination: "/sitemap.xml", permanent: true },
  // High-intent booking / enquiry shorthands. Consultation and quote land on
  // the packages page, matching the existing /book-online and
  // /service-page/free-consult-indicative-quote entries above.
  { source: "/book", destination: "/contact-us", permanent: true },
  { source: "/booking", destination: "/contact-us", permanent: true },
  { source: "/book-a-call", destination: "/contact-us", permanent: true },
  { source: "/book-a-demo", destination: "/contact-us", permanent: true },
  { source: "/demo", destination: "/contact-us", permanent: true },
  { source: "/schedule", destination: "/contact-us", permanent: true },
  { source: "/get-started", destination: "/contact-us", permanent: true },
  { source: "/contact-sales", destination: "/contact-us", permanent: true },
  { source: "/support", destination: "/contact-us", permanent: true },
  { source: "/help", destination: "/contact-us", permanent: true },
  { source: "/quote", destination: "/implementation-packages", permanent: true },
  { source: "/free-consultation", destination: "/implementation-packages", permanent: true },
  // Platform shorthands, matching where the Wix /monday-com chain already ends.
  { source: "/monday", destination: "/partnerships/monday-consulting-partner", permanent: true },
  { source: "/monday-com-consulting", destination: "/monday-implementation-consultants", permanent: true },
  { source: "/atlassian", destination: "/atlassian-consulting", permanent: true },
  { source: "/hubspot", destination: "/hubspot-consulting", permanent: true },
  { source: "/ai", destination: "/ai-consulting", permanent: true },
  { source: "/ai-consulting-services", destination: "/ai-consulting", permanent: true },
  // Country shorthands for the regional partner pages. `/au` is the only one
  // that already exists as a path prefix (the two AU landing routes), and an
  // exact-path redirect does not shadow `/au/<page>`.
  { source: "/au", destination: "/monday-partner-australia", permanent: true },
  { source: "/australia", destination: "/monday-partner-australia", permanent: true },
  { source: "/uk", destination: "/monday-partner-uk", permanent: true },
  { source: "/us", destination: "/monday-partner-us", permanent: true },
  { source: "/usa", destination: "/monday-partner-us", permanent: true },
  { source: "/monday-partner-usa", destination: "/monday-partner-us", permanent: true },
  { source: "/monday-partner-united-states", destination: "/monday-partner-us", permanent: true },
  { source: "/india", destination: "/monday-partner-india", permanent: true },
  { source: "/singapore", destination: "/monday-partner-singapore", permanent: true },
  { source: "/philippines", destination: "/monday-partner-philippines", permanent: true },
];

/**
 * Collapse redirect chains to a single hop.
 *
 * The Wix table was generated per-URL, so a slug that was renamed twice
 * produces `/partnership/make` → `/partnership/make-partner` →
 * `/platforms/make-partner` → … → `/partnerships/make-partners`: five 301s
 * for one visitor. Chains cost a round trip each, and search engines stop
 * following (and stop passing link equity) after a few hops.
 *
 * Rather than hand-flatten 49 entries and re-flatten every time one is added,
 * resolve each destination through the table at config build time. Every
 * source in both tables is a literal path with no `:param` or `has:`
 * conditions, so a plain map lookup is exact. The first hop's `permanent`
 * flag is kept, since that is the status code the visitor was already served.
 */
function flattenRedirectChains(list: Redirect[]): Redirect[] {
  // First definition wins, matching Next's own first-match-wins ordering.
  const bySource = new Map<string, string>();
  for (const r of list) {
    if (!bySource.has(r.source)) bySource.set(r.source, r.destination);
  }

  return list.map((r) => {
    let destination = r.destination;
    const seen = new Set<string>([r.source]);
    // External destinations and self-references terminate immediately.
    while (!/^https?:/.test(destination) && bySource.has(destination)) {
      if (seen.has(destination)) break; // cycle guard
      seen.add(destination);
      destination = bySource.get(destination)!;
    }
    return destination === r.destination ? r : { ...r, destination };
  });
}

const nextConfig: NextConfig = {
  // Barrel-file tree-shaking for heavy libraries — keeps only the icons/charts
  // actually used out of the server bundle (Cloudflare Worker 10 MiB limit).
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "recharts",
      "@sanity/ui",
      "@sanity/icons",
      "date-fns",
    ],
  },
  async redirects() {
    return flattenRedirectChains([...auditRedirects, ...wixRedirects]);
  },
  async rewrites() {
    return [
      // Old Wix WFO PDF URLs → deprecation pages
      {
        source: "/_files/ugd/39b8ef_a6e9b1be0e754503b1a0df07e3d81e6d.pdf",
        destination: "/legal/deprecated/au",
      },
      {
        source: "/_files/ugd/39b8ef_1dc32166aa204f2f997e63c60548c9dd.pdf",
        destination: "/legal/deprecated/us",
      },
      // The UK PDF is not listed here: redirects run before rewrites, and
      // auditRedirects already 301s that exact path to /legal/deprecated/uk,
      // so a rewrite for it could never match.
      // Old NAM MSA PDF path → US deprecation page
      {
        source: "/fruition-master-services-agreement.pdf",
        destination: "/legal/deprecated/us",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
    ],
  },
};

export default nextConfig;

// Cloudflare (OpenNext) local-dev integration: lets `next dev` access
// Cloudflare bindings and keeps the dev server aligned with the Workers runtime.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
