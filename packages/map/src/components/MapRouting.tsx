"use client";

import { useEffect } from "react";
import { useRouting } from "../hooks/useRouting";
import { ToiletMarkerType } from "../types/types";

interface MapRoutingProps {
  selectedToilet: ToiletMarkerType | null;
}

export const MapRouting = ({ selectedToilet }: MapRoutingProps) => {
  const { calculateRoute } = useRouting();

  // Calculate route when toilet is selected
  useEffect(() => {
    if (selectedToilet) {
      // Convert LatLngExpression to [number, number]
      const position: [number, number] = Array.isArray(selectedToilet.position)
        ? [selectedToilet.position[0], selectedToilet.position[1]]
        : [selectedToilet.position.lat, selectedToilet.position.lng];

      calculateRoute(position);
    }
  }, [selectedToilet, calculateRoute]);

  // This component doesn't render anything visible
  // It just handles the routing logic inside the Leaflet context
  return null;
};
