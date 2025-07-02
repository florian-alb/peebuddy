import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@workspace/db"],
  },
  webpack: (config) => {
    config.externals.push({
      "@workspace/db": "@workspace/db",
    });
    return config;
  },
};

export default nextConfig;
