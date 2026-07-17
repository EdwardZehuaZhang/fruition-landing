import type { NextConfig } from "next";
import type { Redirect } from "next/dist/lib/load-custom-routes";
import { wixRedirects } from "./src/redirects";

// Redirects added after the Wix migration (e.g. from SEO/technical audits).
// src/redirects.ts is auto-generated from the migration import — add new
// entries here instead. Placed BEFORE wixRedirects so audits override.
const auditRedirects: Redirect[] = [
  // WFO legal PDF links → dedicated legal pages
  {
    source: "/fruition-master-services-agreement.pdf",
    destination: "/legal/services-agreement-au",
    permanent: true,
  },

  {
    source: "/_files/ugd/39b8ef_a6e9b1be0e754503b1a0df07e3d81e6d.pdf",
    destination: "/legal/services-agreement-au",
    permanent: true,
  },
  {
    source: "/_files/ugd/39b8ef_1dc32166aa204f2f997e63c60548c9dd.pdf",
    destination: "/legal/services-agreement-us",
    permanent: true,
  },
  {
    source: "/_files/ugd/a280a5_11fba06999d94082af98412eb473461c.pdf",
    destination: "/legal/services-agreement-uk",
    permanent: true,
  },
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
