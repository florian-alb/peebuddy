import {betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
import {prisma} from "@repo/db"

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {    
        enabled: true
    },
    trustedOrigins: ['http://localhost:3001/*'],
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string
        },
        roblox: {
            clientId: process.env.ROBLOX_CLIENT_ID as string,
            clientSecret: process.env.ROBLOX_CLIENT_SECRET as string
        }
    }
})
