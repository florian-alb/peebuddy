import MapComponent from "@/components/map/mapComponent";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";

export default function Page() {
  return (
    <>
      <div className="h-screen w-full bg-amber-100 flex flex-col items-center justify-center">
        <MapComponent />
      </div>
      <PWAInstallPrompt />
    </>
  );
}
