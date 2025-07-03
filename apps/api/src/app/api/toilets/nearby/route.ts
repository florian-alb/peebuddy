import { prisma } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Function to calculate distance between two points using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}

// GET toilets near a specific location
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse location parameters
    const latitude = searchParams.get("latitude");
    const longitude = searchParams.get("longitude");

    // Validate required parameters
    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // Validate coordinates
    if (
      isNaN(lat) ||
      isNaN(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Parse optional parameters
    const radiusKm = searchParams.get("radius")
      ? parseFloat(searchParams.get("radius")!)
      : 5; // Default 5km
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 10;

    // Parse filter parameters
    const isFree =
      searchParams.get("is_free") === "true"
        ? true
        : searchParams.get("is_free") === "false"
          ? false
          : undefined;
    const isPublic =
      searchParams.get("is_public") === "true"
        ? true
        : searchParams.get("is_public") === "false"
          ? false
          : undefined;
    const isHandicap =
      searchParams.get("is_handicap") === "true"
        ? true
        : searchParams.get("is_handicap") === "false"
          ? false
          : undefined;
    const isCommerce =
      searchParams.get("is_commerce") === "true"
        ? true
        : searchParams.get("is_commerce") === "false"
          ? false
          : undefined;

    // Build filter object
    const filter: any = {
      deleted_at: null, // Only return non-deleted toilets
    };

    if (isFree !== undefined) filter.is_free = isFree;
    if (isPublic !== undefined) filter.is_public = isPublic;
    if (isHandicap !== undefined) filter.is_handicap = isHandicap;
    if (isCommerce !== undefined) filter.is_commerce = isCommerce;

    // Get all toilets that match the filters
    const toilets = await prisma.toilet.findMany({
      where: filter,
      include: {
        pictures: {
          where: { deleted_at: null },
          take: 1, // Get just one picture for preview
        },
        reviews: {
          where: { deleted_at: null },
          select: { rating: true },
        },
      },
    });

    // Calculate distance for each toilet and filter by radius
    const nearbyToilets = toilets
      .map((toilet) => {
        const distance = calculateDistance(
          lat,
          lon,
          Number(toilet.latitude),
          Number(toilet.longitude)
        );

        // Calculate average rating
        const avgRating = toilet.reviews.length
          ? toilet.reviews.reduce((sum, review) => sum + review.rating, 0) /
            toilet.reviews.length
          : null;

        return {
          ...toilet,
          distance, // Add distance to the toilet object
          avgRating,
          reviewCount: toilet.reviews.length,
          reviews: undefined, // Remove raw reviews from response
        };
      })
      .filter((toilet) => toilet.distance <= radiusKm) // Filter by radius
      .sort((a, b) => a.distance - b.distance) // Sort by distance (closest first)
      .slice(0, limit); // Limit results

    return NextResponse.json(
      {
        data: nearbyToilets,
        meta: {
          total: nearbyToilets.length,
          latitude: lat,
          longitude: lon,
          radiusKm,
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error finding nearby toilets:", error);
    return NextResponse.json(
      { error: "Failed to find nearby toilets" },
      { status: 500, headers: corsHeaders }
    );
  }
}
