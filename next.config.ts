import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Turbopack configuration for Next.js 16
  turbopack: {
    resolveAlias: {
      // Add any aliases if needed
    },
  },
};

export default nextConfig;
