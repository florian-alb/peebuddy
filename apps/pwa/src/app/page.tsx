import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import DynamicMap from "@/components/map/dynamicMap";

export default function Page() {
  return (
    <>
      <div className="h-screen w-full bg-amber-100 flex flex-col items-center justify-center">
        <DynamicMap />
      </div>
      <PWAInstallPrompt />
    </>
  );
}
