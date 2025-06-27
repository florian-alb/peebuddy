import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // désactive en dev
});

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
};

export default nextConfig;

module.exports = withPWA(nextConfig);
