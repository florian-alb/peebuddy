"use client";

import { useState, useEffect } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import {
  PeebuddyMap,
  ToiletMarkerType,
  LocationButton,
  ZoomControls,
  MapRouting,
} from "@workspace/map";
import { UserLocationMarker } from "@/components/localisation/userLocationMarker";
import { useGeolocation } from "@/hooks/useGeolocalisation";
import { findNearestToilet } from "@/lib/utils";
import { ToiletInfo } from "@/components/infos/ToiletInfo";

const toilets: ToiletMarkerType[] = [
  {
    id: "1",
    position: [43.6043, 1.4437],
    name: "Toilette publique",
    address: "123 Rue de la Paix, Toulouse",
    rating: 4.5,
    isVerified: true,
  },
  {
    id: "2",
    position: [43.610667, 1.428229],
    name: "Toilette Centre-ville",
    address: "456 Avenue des Fleurs, Toulouse",
    rating: 4.2,
    isVerified: true,
  },
];

export default function MapComponent() {
  const { width, height } = useWindowSize();
  const { position: userLocation, error } = useGeolocation();
  const [selectedToilet, setSelectedToilet] = useState<ToiletMarkerType | null>(
    null
  );

  function showMarker(toilet: ToiletMarkerType) {
    return toilet.isVerified;
  }

  // Auto-select nearest toilet when user location is available
  useEffect(() => {
    if (userLocation && !selectedToilet) {
      const nearestToilet = findNearestToilet(userLocation, toilets);
      if (nearestToilet) {
        setSelectedToilet(nearestToilet);
      }
    }
  }, [userLocation, selectedToilet]);

  const handleToiletClick = (toilet: ToiletMarkerType) => {
    setSelectedToilet(toilet);
  };

  const handleCloseToilet = () => {
    setSelectedToilet(null);
  };

  if (width === 0 || height === 0) {
    return null;
  }

  return (
    <>
      <PeebuddyMap
        style={{ width: width, height: height }}
        toilets={toilets}
        onToiletClick={handleToiletClick}
        showMarker={showMarker}
      >
        {userLocation && <UserLocationMarker position={userLocation} />}
        <LocationButton />
        <ZoomControls />
        <MapRouting selectedToilet={selectedToilet} />
      </PeebuddyMap>

      {/* Display toilet info */}
      {selectedToilet && (
        <ToiletInfo toilet={selectedToilet} onClose={handleCloseToilet} />
      )}

      {/* Display errors if necessary*/}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <strong>Erreur :</strong> {error}
        </div>
      )}
    </>
  );
}
