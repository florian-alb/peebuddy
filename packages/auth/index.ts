import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
export { auth } from "./auth";
import { customSessionClient } from "better-auth/client/plugins";
export type { Session, User } from "better-auth";
export { toNextJsHandler } from "better-auth/next-js";
export const authClient = createAuthClient({
  plugins: [customSessionClient<typeof auth>()],
});
