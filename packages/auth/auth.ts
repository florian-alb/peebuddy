import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@workspace/db";
import { bearer, customSession } from "better-auth/plugins";

async function findUserRoles(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user?.role || "user";
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const userRole = await findUserRoles(user.id);
      return {
        user: {
          ...user,
          role: userRole,
        },
        session,
      };
    }),
    bearer(),
  ],
  trustedOrigins: [
    "http://localhost:3001/*",
    "http://localhost:3001",

    "http://localhost:3000/*",
    "http://localhost:3000",

    "https://peebuddy.vercel.app/*",
    "https://peebuddy.vercel.app",

    "https://peebuddy-api.vercel.app/*",
    "https://peebuddy-api.vercel.app",

    "https://peebuuddy-dashboard.vercel.app/*",
    "https://peebuuddy-dashboard.vercel.app",
  ],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    roblox: {
      clientId: process.env.ROBLOX_CLIENT_ID as string,
      clientSecret: process.env.ROBLOX_CLIENT_SECRET as string,
    },
  },
});
