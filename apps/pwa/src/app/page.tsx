import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import DynamicMap from "@/components/map/dynamicMap";
import { UserNav } from "@/components/navigation/UserNav";

export default function Page() {
  return (
    <>
      <div className="h-screen w-full bg-amber-100 flex flex-col items-center justify-center relative">
        {/* User Navigation */}
        <div className="absolute top-4 right-4 z-50">
          <UserNav />
        </div>

        <DynamicMap />
      </div>
      <PWAInstallPrompt />
    </>
  );
}
