"use client";

import { useWindowSize } from "@/hooks/useWindowSize";
import {
  PeebuddyMap,
  ToiletMarkerType,
  LocationButton,
  ZoomControls,
} from "@workspace/map";
import { UserLocationMarker } from "@/components/localisation/userLocationMarker";
import { useGeolocation } from "@/hooks/useGeolocalisation";

const toilets: ToiletMarkerType[] = [
  {
    id: "1",
    position: [43.6043, 1.4437], // Toulouse
    name: "Toilette publique",
    address: "123 Rue de la Paix, Toulouse",
    rating: 4.5,
    isVerified: true,
  },
];

export default function MapComponent() {
  const { width, height } = useWindowSize();
  const { position: userLocation, error } = useGeolocation();

  if (width === 0 || height === 0) {
    return null;
  }

  // If permission is granted, display the map
  return (
    <>
      <PeebuddyMap
        style={{ width: width, height: height }}
        toilets={toilets}
        onToiletClick={(toilet: ToiletMarkerType) =>
          console.log("Toilette cliquée:", toilet)
        }
      >
        {userLocation && <UserLocationMarker position={userLocation} />}
        <LocationButton />
        <ZoomControls />
      </PeebuddyMap>

      {/* Display errors if necessary*/}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <strong>Erreur :</strong> {error}
        </div>
      )}
    </>
  );
}
