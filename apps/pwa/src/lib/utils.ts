import { Toilet } from "@workspace/db";

// Function to find nearest toilet
export const findNearestToilet = (
  userLocation: [number, number],
  toilets: Toilet[]
): Toilet | null => {
  if (!userLocation || toilets.length === 0) return null;

  let nearestToilet = toilets[0];
  let shortestDistance = Infinity;

  toilets.forEach((toilet) => {
    const distance = calculateDistance(
      userLocation[0],
      userLocation[1],
      Number(toilet.latitude),
      Number(toilet.longitude)
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
