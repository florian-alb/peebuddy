"use client";

import "../styles/leaflet.css";

import { MapContainer } from "./MapContainer";
import { TileLayer } from "react-leaflet";
import { MapComponentProps } from "../types/types";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  DEFAULT_TILE_LAYER,
  DEFAULT_ATTRIBUTION,
} from "../lib/utils";
import { ToiletMarker } from "./ToiletMarker";
import { MapOptions } from "leaflet";
import { Toilet } from "@workspace/db";

interface PeebuddyMapProps extends MapComponentProps {
  toilets?: Toilet[];
  onToiletClick?: (toilet: Toilet) => void;
  className?: string;
  style?: React.CSSProperties;
  mapOptions?: MapOptions;
  children?: React.ReactNode;
  showMarker?: boolean | ((toilet: Toilet) => boolean);
}

export const PeebuddyMap = ({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  toilets = [],
  onToiletClick,
  className,
  style,
  mapOptions,
  children,
  showMarker = true,
}: PeebuddyMapProps) => {
  return (
    <div className={`relative ${className || "h-full w-full"}`} style={style}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        {...mapOptions}
      >
        <TileLayer attribution={DEFAULT_ATTRIBUTION} url={DEFAULT_TILE_LAYER} />

        {/* Toilet markers */}
        {toilets.length > 0 &&
          toilets.map(
            (toilet) =>
              showMarker && (
                <ToiletMarker
                  key={toilet.id}
                  toilet={toilet}
                  onClick={onToiletClick}
                />
              )
          )}

        {children}
      </MapContainer>
    </div>
  );
};
