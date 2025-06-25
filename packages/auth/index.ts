import { createAuthClient } from "better-auth/client";
export { toNextJsHandler } from "better-auth/next-js";
export const authClient = createAuthClient()
export { auth } from './auth'