import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // désactive en dev
});

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      const {
        PrismaPlugin,
      } = require("@prisma/nextjs-monorepo-workaround-plugin");
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
};

export default nextConfig;

module.exports = withPWA(nextConfig);
