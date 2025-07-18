"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import { useWindowSize } from "@/hooks/useWindowSize";
import { useGeolocation } from "@/hooks/useGeolocalisation";

import { Toilet } from "@workspace/db";

import { UserLocationMarker } from "@/components/localisation/userLocationMarker";
import { ToiletInfo } from "@/components/infos/ToiletInfo";

import {
  DEFAULT_ATTRIBUTION,
  DEFAULT_CENTER,
  DEFAULT_TILE_LAYER,
  DEFAULT_ZOOM,
  findNearestToilet,
} from "@/lib/utils";

import { LatLngLiteral } from "leaflet";
import { MapCenterListener } from "@/components/map/mapCenterListener";
import { ToiletMarker } from "@/components/map/ToiletMarker";
import { MapControls } from "@/components/map/MapControls";
import { MapRouting } from "@/components/map/MapRouting";
import { ToiletWithReviewsAndPictures } from "@/types/toilets";
import { RouteInfo } from "@/hooks/useDirection";
import { AddToiletModal } from "../toilets/AddToiletModal";

export default function MapComponent() {
  const { width, height } = useWindowSize();
  const { position: userLocation, error } = useGeolocation();
  const [selectedToilet, setSelectedToilet] =
    useState<ToiletWithReviewsAndPictures | null>(null);
  const [toilets, setToilets] = useState<ToiletWithReviewsAndPictures[]>([]);
  const [mapCenter, setMapCenter] = useState<LatLngLiteral>(DEFAULT_CENTER);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  useEffect(() => {
    if (!mapCenter) return;

    const fetchToilets = async () => {
      try {
        const toiletsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/toilets/nearby?latitude=${mapCenter.lat}&longitude=${mapCenter.lng}`
        );
        const { data } = await toiletsResponse.json();

        // i need to add toilets to toilets array if they are not already in the array
        const newToilets = data.filter(
          (toilet: Toilet) => !toilets.some((t) => t.id === toilet.id)
        );

        setToilets([...toilets, ...newToilets]);
      } catch (error) {
        console.error("Erreur lors de la récupération des toilettes:", error);
      }
    };

    fetchToilets();
  }, [mapCenter]);

  // Auto-select nearest toilet when user location is available
  useEffect(() => {
    if (userLocation && !selectedToilet) {
      try {
        const nearestToilet = findNearestToilet(userLocation, toilets);
        if (nearestToilet) {
          setSelectedToilet(nearestToilet);
        }
      } catch (error) {
        console.error("Impossible de trouver de toilette proche.");
      }
    }
  }, [userLocation, selectedToilet]);

  const handleToiletClick = (toilet: ToiletWithReviewsAndPictures) => {
    setSelectedToilet(toilet);
  };

  const handleMapCenterChange = (center: LatLngLiteral) => {
    setMapCenter(center);
  };

  function showMarker(toilet: Toilet) {
    return !toilet.is_verified;
  }

  const getRouteInfo = (routeInfo: RouteInfo | null) => {
    setRouteInfo(routeInfo);
  };

  if (width === 0 || height === 0) {
    return null;
  }

  return (
    <>
      <div
        className="relative h-full w-full"
        style={{ width: width, height: height }}
      >
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={true}
          doubleClickZoom={false}
          attributionControl={false}
          zoomControl={false}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution={DEFAULT_ATTRIBUTION}
            url={DEFAULT_TILE_LAYER}
          />

          <MapCenterListener onCenterChange={handleMapCenterChange} />

          {/* Toilet markers */}
          {toilets.length > 0 &&
            toilets.map(
              (toilet) =>
                showMarker(toilet) && (
                  <ToiletMarker
                    key={toilet.id}
                    toilet={toilet}
                    onClick={() => handleToiletClick(toilet)}
                  />
                )
            )}

          {userLocation && <UserLocationMarker position={userLocation} />}
          <MapControls />
          {selectedToilet && (
            <MapRouting
              onRouteCalculated={getRouteInfo}
              selectedToilet={{
                position: [
                  parseFloat(selectedToilet.latitude),
                  parseFloat(selectedToilet.longitude),
                ],
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Display toilet info */}
      {selectedToilet && (
        <ToiletInfo toilet={selectedToilet} routeInfo={routeInfo} />
      )}

      <AddToiletModal />

      {/* Display errors if necessary*/}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <strong>Erreur :</strong> {error}
        </div>
      )}
    </>
  );
}
