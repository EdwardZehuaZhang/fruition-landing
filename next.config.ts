import type { NextConfig } from "next";
import type { Redirect } from "next/dist/lib/load-custom-routes";
import { wixRedirects } from "./src/redirects";

// Redirects added after the Wix migration (e.g. from SEO/technical audits).
// src/redirects.ts is auto-generated from the migration import — add new
// entries here instead.
const auditRedirects: Redirect[] = [
  {
    source: "/_files/ugd/39b8ef_1dc32166aa204f2f997e63c60548c9dd.pdf",
    destination: "/legal/services-agreement-au",
    permanent: true,
  },
  {
    source: "/solutions/monday-com-manufacturing",
    destination: "/monday-for-manufacturing",
    permanent: true,
  },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [...wixRedirects, ...auditRedirects];
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
