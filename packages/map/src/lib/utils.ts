import { LatLngExpression, Icon } from "leaflet";

// default tile layer
export const DEFAULT_TILE_LAYER = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmluamF3aWxsNTQzIiwiYSI6ImNsZDRidWdrNjBvbDczcW9jajU5c3UxdXAifQ._jM-ztlL3-V9_0WjlFB01A`;
export const DEFAULT_ATTRIBUTION = "© OpenStreetMap contributors";

// default position (Toulouse)
export const DEFAULT_CENTER: LatLngExpression = [43.6043, 1.4437];
export const DEFAULT_ZOOM = 13;

// custom icon for toilets
export const createToiletIcon = (isVerified: boolean = false): Icon => {
  return new Icon({
    iconUrl: isVerified ? "/icons/toilet-verified.png" : "/icons/toilet.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// function to calculate the distance between two points
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// function to format the distance
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

// function to get the current position of the user
export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
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
  });
};
