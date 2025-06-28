"use client";

import { useState, useEffect, useCallback } from "react";

interface GeolocationState {
  position: [number, number] | null;
  permission: "granted" | "denied" | "prompt" | null;
  isLoading: boolean;
  error: string | null;
  isLocationRequired: boolean;
}

const STORAGE_KEY = "peebuddy_geolocation_permission";

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    permission: null,
    isLoading: true,
    error: null,
    isLocationRequired: true,
  });

  // Retrieve stored permission
  const getStoredPermission = useCallback(():
    | "granted"
    | "denied"
    | "prompt"
    | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY) as
      | "granted"
      | "denied"
      | "prompt"
      | null;
  }, []);

  // Store permission
  const storePermission = useCallback(
    (permission: "granted" | "denied" | "prompt") => {
      if (typeof window === "undefined") return;
      localStorage.setItem(STORAGE_KEY, permission);
    },
    []
  );

  // Check current permission
  const checkPermission = useCallback(async () => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Géolocalisation non supportée",
        isLocationRequired: true,
        isLoading: false,
      }));
      return;
    }

    try {
      const result = await navigator.permissions.query({ name: "geolocation" });
      const storedPermission = getStoredPermission();

      // If permission has changed, update localStorage
      if (result.state !== storedPermission) {
        storePermission(result.state);
      }

      setState((prev) => ({
        ...prev,
        permission: result.state,
        isLocationRequired: result.state !== "granted",
        isLoading: false,
      }));

      // If permission granted, get position
      if (result.state === "granted") {
        getCurrentPosition();
      }
    } catch (error) {
      // Fallback if permissions API is not supported
      const storedPermission = getStoredPermission();
      if (storedPermission === "granted") {
        getCurrentPosition();
      } else {
        setState((prev) => ({
          ...prev,
          permission: "prompt",
          isLocationRequired: true,
          isLoading: false,
        }));
      }
    }
  }, [getStoredPermission, storePermission]);

  // Get current position
  const getCurrentPosition = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setState((prev) => ({
          ...prev,
          position: [latitude, longitude],
          isLoading: false,
          permission: "granted",
          isLocationRequired: false,
        }));
        storePermission("granted");
      },
      (error) => {
        console.error("Erreur de géolocalisation:", error);
        let errorMessage = "Erreur de géolocalisation";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permission refusée";
            storePermission("denied");
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Position non disponible";
            break;
          case error.TIMEOUT:
            errorMessage = "Timeout de géolocalisation";
            break;
        }

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          permission:
            error.code === error.PERMISSION_DENIED ? "denied" : "prompt",
          isLocationRequired: true,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [storePermission]);

  // Request permission
  const requestPermission = useCallback(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  // Initialization
  useEffect(() => {
    const storedPermission = getStoredPermission();

    if (storedPermission === "granted") {
      // Permission already granted, get position
      getCurrentPosition();
    } else if (storedPermission === "denied") {
      // Permission denied, but we still require it
      setState((prev) => ({
        ...prev,
        permission: "denied",
        isLocationRequired: true,
        isLoading: false,
      }));
    } else {
      // Check current permission
      checkPermission();
    }
  }, [getStoredPermission, getCurrentPosition, checkPermission]);

  return {
    ...state,
    requestPermission,
    getCurrentPosition,
  };
};
