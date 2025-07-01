import { useState, useCallback, useEffect } from "react";
import { useMap as useLeafletMap } from "react-leaflet";
import { DEFAULT_CENTER } from "../lib/utils";

export const useMap = () => {
  const map = useLeafletMap();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const getLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by this browser."));
            return;
          }

          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position),
            (error) => reject(error),
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 60000,
            }
          );
        }
      );

      const { latitude, longitude } = position.coords;
      setUserLocation([latitude, longitude]);

      if (map) {
        map.setView([latitude, longitude], 15);
      }
    } catch (error) {
      console.error("Error getting location:", error);
      // Fallback to default center
      if (map) {
        map.setView(DEFAULT_CENTER, 13);
      }
    } finally {
      setIsLoadingLocation(false);
    }
  }, [map]);

  const flyToLocation = useCallback(
    (lat: number, lng: number, zoom: number = 15) => {
      if (map) {
        map.flyTo([lat, lng], zoom);
      }
    },
    [map]
  );

  const fitBounds = useCallback(
    (bounds: [[number, number], [number, number]]) => {
      if (map) {
        map.fitBounds(bounds);
      }
    },
    [map]
  );

  useEffect(() => {
    // Auto-get location when map is ready
    if (map && !userLocation) {
      getLocation();
    }
  }, [map, userLocation, getLocation]);

  return {
    map,
    userLocation,
    isLoadingLocation,
    getLocation,
    flyToLocation,
    fitBounds,
  };
};
