"use client";

import { useGeolocation } from "@/hooks/useGeolocalisation";
import dynamic from "next/dynamic";
import { LocationPermission } from "../localisation/locationPermission";
import { Loader2Icon } from "lucide-react";

const MapComponent = dynamic(
  () => import("./mapComponent"),

  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-amber-100 animate-pulse flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2Icon className="animate-spin" />
          <span>Chargement de la carte...</span>
        </div>
      </div>
    ),
  }
);

export default function DynamicMap() {
  const { permission, requestPermission, isLoading } = useGeolocation();

  const handlePermissionDenied = () => {
    console.log("Permission refusée");
  };

  // Display a loader during initial verification
  if (isLoading || permission === null) {
    return (
      <div className="h-full w-full bg-amber-100 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2Icon className="animate-spin" />
          <span>Vérification de la localisation...</span>
        </div>
      </div>
    );
  }

  // Display the popup only if the permission is explicitly denied
  if (permission === "denied") {
    return (
      <div className="h-full w-full bg-amber-100 flex items-center justify-center">
        <LocationPermission
          onPermissionGranted={requestPermission}
          onPermissionDenied={handlePermissionDenied}
          isLoading={isLoading}
        />
      </div>
    );
  }
  return <MapComponent />;
}
