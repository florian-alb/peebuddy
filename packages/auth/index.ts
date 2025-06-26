import { createAuthClient } from "better-auth/client";
export type { Session } from "better-auth";
export { toNextJsHandler } from "better-auth/next-js";
export { auth } from './auth'
export const authClient = createAuthClient()