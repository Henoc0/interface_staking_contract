import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ← désactivation de ESLint au build
  },
  webpack: (config) => {
    config.externals = [
      ...(Array.isArray(config.externals) ? config.externals : []),
      'pino',
      'thread-stream',
    ]
    return config
  },
};

export default nextConfig;