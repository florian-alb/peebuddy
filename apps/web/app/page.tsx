import { Button } from "@workspace/ui/components/button";
import Auth from "@/components/auth";
import { auth } from "@workspace/auth";
import { headers } from "next/headers";

export default async function Page() {
  // Get session on server-side using the auth instance
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log("Session data:", session);
  console.log("Session user:", session?.user);

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        {session?.user && (
          <div>
            <p>Logged in as: {session.user.name}</p>
            <p>Role: {session.user.roles || "No role"}</p>
          </div>
        )}
        <Button size="sm">Button</Button>
        <Auth />
      </div>
    </div>
  );
}
