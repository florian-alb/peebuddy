/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure environment variables are available to the server
  env: {
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  },
};

export default nextConfig;
