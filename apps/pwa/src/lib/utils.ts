import { Picture, Review, Toilet } from "@workspace/db";
import L, { Icon, LatLngLiteral } from "leaflet";

export const DEFAULT_TILE_LAYER = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`;
export const DEFAULT_ATTRIBUTION = "© OpenStreetMap contributors";

export const DEFAULT_CENTER: LatLngLiteral = {
  lat: 43.6043,
  lng: 1.4437,
};
export const DEFAULT_ZOOM = 5;

// Calculate distance between two points using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

// Find the nearest toilet to a given location
export function findNearestToilet(
  userLocation: [number, number],
  toilets: (Toilet & { reviews: Review[] } & { pictures: Picture[] })[]
): (Toilet & { reviews: Review[] } & { pictures: Picture[] }) | null {
  if (toilets.length === 0) return null;

  let nearestToilet: Toilet | null = null;
  let minDistance = Infinity;

  toilets.forEach((toilet) => {
    const distance = calculateDistance(
      userLocation[0],
      userLocation[1],
      parseFloat(toilet.latitude),
      parseFloat(toilet.longitude)
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestToilet = toilet;
    }
  });

  return nearestToilet;
}

// Filter toilets by distance from a given location
export function filterToiletsByDistance(
  userLocation: [number, number],
  toilets: Toilet[],
  maxDistance: number = 5 // 5km default
): Toilet[] {
  return toilets.filter((toilet) => {
    const distance = calculateDistance(
      userLocation[0],
      userLocation[1],
      parseFloat(toilet.latitude),
      parseFloat(toilet.longitude)
    );
    return distance <= maxDistance;
  });
}

// Sort toilets by distance from a given location
export function sortToiletsByDistance(
  userLocation: [number, number],
  toilets: Toilet[]
): Toilet[] {
  return [...toilets].sort((a, b) => {
    const distanceA = calculateDistance(
      userLocation[0],
      userLocation[1],
      parseFloat(a.latitude),
      parseFloat(a.longitude)
    );
    const distanceB = calculateDistance(
      userLocation[0],
      userLocation[1],
      parseFloat(b.latitude),
      parseFloat(b.longitude)
    );
    return distanceA - distanceB;
  });
}

// Format distance for display
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
}

// Create a bounds object from an array of toilets
export function createBoundsFromToilets(
  toilets: Toilet[]
): L.LatLngBounds | null {
  if (toilets.length === 0) return null;

  const lats = toilets.map((t) => parseFloat(t.latitude));
  const lngs = toilets.map((t) => parseFloat(t.longitude));

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return L.latLngBounds([minLat, minLng], [maxLat, maxLng]);
}

// custom icon for toilets
export const createToiletIcon = (isVerified: boolean = false): Icon => {
  return new Icon({
    iconUrl: isVerified ? "/icons/toilet-verified.png" : "/icons/toilet.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};
