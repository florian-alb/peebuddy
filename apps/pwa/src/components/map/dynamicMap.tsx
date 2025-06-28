"use client";

import { useGeolocation } from "@/hooks/useGeolocalisation";
import dynamic from "next/dynamic";
import { LocationPermission } from "../localisation/locationPermission";

const MapComponent = dynamic(() => import("./mapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-200 animate-pulse flex items-center justify-center">
      <div className="text-gray-600">Chargement de la carte...</div>
    </div>
  ),
});

export default function DynamicMap() {
  const { permission, requestPermission, isLoading } = useGeolocation();

  const handlePermissionDenied = () => {
    console.log("Permission refusée");
  };

  // Display a loader during initial verification
  if (isLoading || permission === null) {
    return (
      <div className="h-full w-full bg-amber-100 flex items-center justify-center">
        <div className="text-gray-600">Vérification de la localisation...</div>
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

  // Si la permission est accordée ou en attente, afficher la carte
  return <MapComponent />;
}
