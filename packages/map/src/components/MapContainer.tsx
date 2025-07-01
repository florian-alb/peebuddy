"use client";

import { useEffect } from "react";
import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";
import { MapComponentProps } from "../types/types";
import { DEFAULT_TILE_LAYER, DEFAULT_ATTRIBUTION } from "../lib/utils";
import { Map } from "leaflet";

// component to handle the map events
const MapEvents = ({ onMapReady }: { onMapReady?: (map: Map) => void }) => {
  const map = useMap();

  useEffect(() => {
    if (map && onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
};

export const MapContainer = ({
  center,
  zoom,
  className = "h-full w-full",
  style,
  mapOptions = {},
  children,
  onMapReady,
}: MapComponentProps & { onMapReady?: (map: Map) => void }) => {
  return (
    <div className={className} style={style}>
      <LeafletMapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        {...mapOptions}
      >
        <TileLayer attribution={DEFAULT_ATTRIBUTION} url={DEFAULT_TILE_LAYER} />
        <MapEvents onMapReady={onMapReady} />
        {children}
      </LeafletMapContainer>
    </div>
  );
};
