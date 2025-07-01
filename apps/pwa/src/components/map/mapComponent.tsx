"use client";

import { useState, useEffect } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import {
  PeebuddyMap,
  LocationButton,
  ZoomControls,
  MapRouting,
} from "@workspace/map";
import { UserLocationMarker } from "@/components/localisation/userLocationMarker";
import { useGeolocation } from "@/hooks/useGeolocalisation";
import { findNearestToilet } from "@/lib/utils";
import { ToiletInfo } from "@/components/infos/ToiletInfo";
import { Toilet } from "@workspace/db";

export default function MapComponent() {
  const { width, height } = useWindowSize();
  const { position: userLocation, error } = useGeolocation();
  const [selectedToilet, setSelectedToilet] = useState<Toilet | null>(null);

  const [toilets, setToilets] = useState<Toilet[]>([]);

  useEffect(() => {
    if (!userLocation) return;

    const fetchToilets = async () => {
      try {
        const toilets = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/toilets/nearby?latitude=${userLocation[0]}&longitude=${userLocation[1]}`
        );
        const { data } = await toilets.json();
        setToilets(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des toilettes:", error);
      }
    };

    fetchToilets();
  }, [userLocation]);

  // Auto-select nearest toilet when user location is available
  useEffect(() => {
    if (userLocation && !selectedToilet) {
      const nearestToilet = findNearestToilet(userLocation, toilets);
      if (nearestToilet) {
        setSelectedToilet(nearestToilet);
      }
    }
  }, [userLocation, selectedToilet]);

  const handleToiletClick = (toilet: Toilet) => {
    setSelectedToilet(toilet);
  };

  const handleCloseToilet = () => {
    setSelectedToilet(null);
  };

  function showMarker(toilet: Toilet) {
    return toilet.is_verified;
  }

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
        mapOptions={{
          zoomControl: false,
          doubleClickZoom: false,
          attributionControl: false,
        }}
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
