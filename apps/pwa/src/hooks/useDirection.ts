"use client";

import { useCallback, useRef, useState } from "react";
import { useMap } from "./useMap";
import L from "leaflet";
import "leaflet-routing-machine";

export interface RouteInfo {
  distance: number;
  duration: number;
}

export const useDirection = () => {
  const { map, userLocation } = useMap();
  const currentRouteRef = useRef<L.Routing.Control | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  // Calculate route to destination
  const calculateRoute = useCallback(
    (destination: [number, number]) => {
      if (!map || !userLocation) {
        return;
      }

      // Clear previous route if exists
      if (currentRouteRef.current) {
        map.removeControl(currentRouteRef.current);
        currentRouteRef.current = null;
      }

      const routingControl = L.Routing.control({
        router: L.Routing.mapbox(
          process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string,
          {
            profile: "mapbox/walking",
          }
        ),
        plan: L.Routing.plan(
          [
            L.latLng(userLocation[0], userLocation[1]),
            L.latLng(destination[0], destination[1]),
          ],
          {
            createMarker: function () {
              return false;
            },
          }
        ),
        routeWhileDragging: false,
        showAlternatives: false,
        fitSelectedRoutes: false,
        addWaypoints: false,
        show: false,
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
      }).on("routesfound", (e: any) => {
        const route = e.routes[0];
        const distance = route.summary.totalDistance / 1000;
        const duration = route.summary.totalTime / 60;

        setRouteInfo({ distance, duration });
      });

      routingControl.addTo(map);
      currentRouteRef.current = routingControl;
    },
    [map, userLocation]
  );

  return { calculateRoute, routeInfo };
};
