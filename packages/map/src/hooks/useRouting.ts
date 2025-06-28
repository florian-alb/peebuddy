"use client";

import { useCallback } from "react";
import { useMap } from "./useMap";
import L from "leaflet";
import "leaflet-routing-machine";

export const useRouting = () => {
  const { map, userLocation } = useMap();

  // Calculate route to destination
  const calculateRoute = useCallback(
    (destination: [number, number]) => {
      if (!map || !userLocation) {
        return;
      }

      // Clear any existing routes
      map.eachLayer((layer) => {
        if (layer instanceof L.Routing.Control) {
          map.removeControl(layer);
        }
      });

      // Create and add routing control (no UI, only the route line)
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userLocation[0], userLocation[1]),
          L.latLng(destination[0], destination[1]),
        ],
        routeWhileDragging: false,
        showAlternatives: false,
        fitSelectedRoutes: true,
        addWaypoints: false,
        show: false, // Hide the default UI
        lineOptions: {
          styles: [
            {
              color: "#fbbf24",
              opacity: 0.8,
              weight: 6,
            },
          ],
          extendToWaypoints: true,
          missingRouteTolerance: 0,
        },
      });

      routingControl.addTo(map);
    },
    [map, userLocation]
  );

  return { calculateRoute };
};
