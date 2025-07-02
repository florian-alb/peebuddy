import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import DynamicMap from "@/components/map/dynamicMap";
import { UserNav } from "@/components/navigation/UserNav";
import { auth, User } from "@workspace/auth";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  return (
    <>
      <div className="h-screen w-full bg-amber-100 flex flex-col items-center justify-center relative">
        {/* User Navigation */}
        <div className="absolute top-4 right-4 z-50">
          <UserNav user={session ? session.user : null} />
        </div>

        <DynamicMap />
      </div>
      <PWAInstallPrompt />
    </>
  );
}
