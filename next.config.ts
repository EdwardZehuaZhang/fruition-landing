import type { NextConfig } from "next";
import { wixRedirects } from "./src/redirects";

const nextConfig: NextConfig = {
  async redirects() {
    return wixRedirects;
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
