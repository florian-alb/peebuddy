import { ToiletMarkerType } from "@workspace/map";

// Function to find nearest toilet
export const findNearestToilet = (
  userLocation: [number, number],
  toilets: ToiletMarkerType[]
): ToiletMarkerType | null => {
  if (!userLocation || toilets.length === 0) return null;

  let nearestToilet = toilets[0];
  let shortestDistance = Infinity;

  toilets.forEach((toilet) => {
    const position = Array.isArray(toilet.position)
      ? (toilet.position as [number, number])
      : [toilet.position.lat, toilet.position.lng];

    const distance = calculateDistance(
      userLocation[0],
      userLocation[1],
      position[0],
      position[1]
    );

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestToilet = toilet;
    }
  });

  return nearestToilet;
};

// Function to calculate distance between two points
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
