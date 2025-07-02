"use client";

import { LatLngLiteral } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function MapCenterListener({
  onCenterChange,
}: {
  onCenterChange: (center: LatLngLiteral) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const handleMoveEnd = () => {
      const center = map.getCenter();
      onCenterChange(center);
    };

    map.on("moveend", handleMoveEnd);

    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [map, onCenterChange]);

  return null;
}
