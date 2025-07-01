"use client";

import { useEffect } from "react";
import { useDirection } from "@/hooks/useDirection";
import { DivIcon, Icon, LatLngExpression } from "leaflet";

export interface MarkerProps {
  position: LatLngExpression;
  title?: string;
  popup?: React.ReactNode;
  icon?: Icon | DivIcon;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const MapRouting = ({
  selectedToilet,
}: {
  selectedToilet: MarkerProps | null;
}) => {
  const { calculateRoute } = useDirection();

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
