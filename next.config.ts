import type { NextConfig } from "next";
import type { Redirect } from "next/dist/lib/load-custom-routes";
import { wixRedirects } from "./src/redirects";

// Redirects added after the Wix migration (e.g. from SEO/technical audits).
// src/redirects.ts is auto-generated from the migration import — add new
// entries here instead. Placed BEFORE wixRedirects so audits override.
const auditRedirects: Redirect[] = [
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
