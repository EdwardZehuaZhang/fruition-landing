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

  // ── Orphaned Wix pages (September 2026, fruitionmonday.com cutover) ──
  // Found by replaying the retired Wix site's sitemap against this one: of its
  // 52 page paths these seven were the only ones with no live successor. All
  // 241 /post/<slug> URLs already resolved and were checked for a real <h1>,
  // not just a 200. Destinations come from each old page's own <title>.
  { source: "/monday-com-training", destination: "/monday-training", permanent: true },
  { source: "/monday-crm-demo", destination: "/monday-crm-consulting", permanent: true },
  // Titled "Certified Monday.com Platinum Partner in the UK" — a Google Ads
  // landing page, so it may still be taking paid traffic.
  { source: "/google-ads-uk-landing", destination: "/monday-partner-uk", permanent: true },
  { source: "/license-procurement-page", destination: "/pricing", permanent: true },
  // Wix editor scaffolding with no real content — park on the homepage.
  { source: "/button-redirect-page", destination: "/", permanent: true },
  { source: "/new-menu", destination: "/", permanent: true },
  // Titled "monday.com Consultants" on the old site. It has no route file here,
  // so /partnerships/[slug] was serving it as a 200 with an empty shell — a
  // soft 404 that a status-code sweep cannot see (see /page-authoring).
  { source: "/partnerships/consultants", destination: "/monday-implementation-consultants", permanent: true },

  // ── Blog consolidation (August 2026 content audit, board item 2816307976) ──
  // Sixteen thin/overlapping consultant posts folded into the canonical piece
  // for each cluster. Source and destination are taken verbatim from the
  // "Edward:" instructions in the audit sheet.
  //
  // NOTE: every source below still serves its own content. These are only safe
  // once Ishani's "get useful content and merge" step is done for that row —
  // otherwise the merge loses the material it was supposed to pull across.
  { source: "/post/mondaycom-implementation-consultants", destination: "/post/mondaycom-implementation-roi", permanent: true },
  { source: "/post/mondaycom-implementation-consultant-diy-self-service", destination: "/post/mondaycom-consulting-packages-vs-diy", permanent: true },
  { source: "/post/monday-crm-implementation-consultant", destination: "/post/monday-crm-for-sales-teams-implementing-strategies", permanent: true },
  { source: "/post/monday-crm-sales-teams-implementing-strategies", destination: "/post/monday-crm-for-sales-teams-implementing-strategies", permanent: true },
  { source: "/post/monday-crm-consultants", destination: "/post/monday-crm-for-sales-teams-implementing-strategies", permanent: true },
  { source: "/post/monday-crm-implementation", destination: "/monday-implementation-consultants", permanent: true },
  { source: "/post/monday-crm-consultant", destination: "/post/how-to-find-the-right-monday-crm-consultant", permanent: true },
  { source: "/post/monday-consultants", destination: "/post/how-to-find-the-right-monday-crm-consultant", permanent: true },
  { source: "/post/monday-com-partner-fruition-services", destination: "/post/how-to-find-the-right-monday-crm-consultant", permanent: true },
  { source: "/post/monday-com-implementation-certified-experts", destination: "/post/how-to-find-the-right-monday-crm-consultant", permanent: true },
  { source: "/post/how-can-you-find-a-reliable-monday-com-certified-partner-for-your-business", destination: "/post/how-to-find-the-right-monday-crm-consultant", permanent: true },
  { source: "/post/hire-mondaycom-partner-questions", destination: "/post/how-to-find-the-right-monday-crm-consultant", permanent: true },
  { source: "/post/monday-com-implementation", destination: "/post/mondaycom-consulting-packages-vs-diy", permanent: true },
  { source: "/post/hire-monday-com-experts", destination: "/post/mondaycom-consulting-packages-vs-diy", permanent: true },
  { source: "/post/monday-com-consultants-help", destination: "/monday-crm-consulting", permanent: true },
  { source: "/post/monday-com-consultant-implementation-framework", destination: "/monday-crm-consulting", permanent: true },

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
];

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
    return [...auditRedirects, ...wixRedirects];
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
      {
        source: "/_files/ugd/a280a5_11fba06999d94082af98412eb473461c.pdf",
        destination: "/legal/deprecated/uk",
      },
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
