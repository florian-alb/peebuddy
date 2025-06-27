"use client";

import "../styles/leaflet.css";

import { useMap } from "react-leaflet";
import { MapContainer } from "./MapContainer";
import { TileLayer } from "react-leaflet";
import { ToiletMarkerType, MapComponentProps } from "../types/types";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  DEFAULT_TILE_LAYER,
  DEFAULT_ATTRIBUTION,
} from "../lib/utils";
import { useEffect, useState } from "react";
import { LocationButton, ZoomControls } from "./MapControls";
import { ToiletMarker } from "./ToiletMarker";
import { Map } from "leaflet";

// Composant pour gérer les événements de la carte
const MapEvents = ({
  onMapReady,
  autoLocate,
  onLocationClick,
  isLoadingLocation,
}: {
  onMapReady?: (map: Map) => void;
  autoLocate?: boolean;
  onLocationClick?: () => void;
  isLoadingLocation?: boolean;
}) => {
  const map = useMap();

  useEffect(() => {
    if (map && onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  // Gestion de la géolocalisation automatique
  useEffect(() => {
    if (autoLocate && map) {
      const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              map.setView([latitude, longitude], 15);
            },
            (error) => {
              console.error("Erreur de géolocalisation:", error);
            }
          );
        }
      };
      getLocation();
    }
  }, [map, autoLocate]);

  return null;
};

interface PeebuddyMapProps extends MapComponentProps {
  toilets?: ToiletMarkerType[];
  onToiletClick?: (toilet: ToiletMarkerType) => void;
  showControls?: boolean;
  autoLocate?: boolean;
}

export const PeebuddyMap = ({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  toilets = [],
  onToiletClick,
  showControls = true,
  autoLocate = true,
  className,
  style,
  mapOptions,
  children,
}: PeebuddyMapProps) => {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const handleMapReady = (mapInstance: any) => {
    // Map instance is ready
  };

  const handleLocationClick = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // La carte sera mise à jour via le composant MapEvents
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          setIsLoadingLocation(false);
        }
      );
    }
  };

  return (
    <div className={`relative ${className || "h-full w-full"}`} style={style}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        {...mapOptions}
      >
        <TileLayer attribution={DEFAULT_ATTRIBUTION} url={DEFAULT_TILE_LAYER} />

        <MapEvents
          onMapReady={handleMapReady}
          autoLocate={autoLocate}
          onLocationClick={handleLocationClick}
          isLoadingLocation={isLoadingLocation}
        />

        {/* Marqueurs des toilettes */}
        {toilets.map((toilet) => (
          <ToiletMarker
            key={toilet.id}
            toilet={toilet}
            onClick={onToiletClick}
          />
        ))}

        {/* Contrôles de la carte */}
        {showControls && (
          <>
            <LocationButton
              onLocationClick={handleLocationClick}
              isLoadingLocation={isLoadingLocation}
            />
            <ZoomControls />
          </>
        )}

        {/* Enfants personnalisés */}
        {children}
      </MapContainer>
    </div>
  );
};
