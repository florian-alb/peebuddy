import { prisma } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";
import { CreateToiletDto, ToiletFilters, ToiletWithRating } from "@/lib/types";
import { Prisma } from "@workspace/db";

// GET all toilets with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters for filtering
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
    const isVerified =
      searchParams.get("is_verified") === "true"
        ? true
        : searchParams.get("is_verified") === "false"
          ? false
          : undefined;

    // Parse pagination parameters
    const take = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 10;
    const skip = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : 0;

    // Build filter object
    const filter: Prisma.ToiletWhereInput = {
      deleted_at: null, // Only return non-deleted toilets
    };

    if (isFree !== undefined) filter.is_free = isFree;
    if (isPublic !== undefined) filter.is_public = isPublic;
    if (isHandicap !== undefined) filter.is_handicap = isHandicap;
    if (isCommerce !== undefined) filter.is_commerce = isCommerce;
    if (isVerified !== undefined) filter.is_verified = isVerified;

    // Get toilets with pictures and reviews count
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
      take,
      skip,
    });

    // Calculate average rating for each toilet
    const toiletsWithRating = toilets.map((toilet) => {
      const avgRating = toilet.reviews.length
        ? toilet.reviews.reduce(
            (sum: number, review: { rating: number }) => sum + review.rating,
            0
          ) / toilet.reviews.length
        : null;

      return {
        ...toilet,
        avgRating,
        reviewCount: toilet.reviews.length,
        reviews: undefined, // Remove raw reviews from response
      } as ToiletWithRating;
    });

    // Get total count for pagination
    const totalCount = await prisma.toilet.count({ where: filter });

    return NextResponse.json({
      data: toiletsWithRating,
      meta: {
        total: totalCount,
        offset: skip,
        limit: take,
      },
    });
  } catch (error) {
    console.error("Error fetching toilets:", error);
    return NextResponse.json(
      { error: "Failed to fetch toilets" },
      { status: 500 }
    );
  }
}

// POST create a new toilet
export async function POST(request: Request) {
  request.headers.set("Access-Control-Allow-Origin", "*");
  request.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  request.headers.set("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    return NextResponse.json({}, { status: 200 });
  }

  try {
    const body = (await request.json()) as CreateToiletDto;

    // Validate required fields
    if (!body.longitude || !body.latitude) {
      return NextResponse.json(
        { error: "Longitude and latitude are required" },
        { status: 400 }
      );
    }

    // Create new toilet
    const newToilet = await prisma.toilet.create({
      data: {
        longitude: body.longitude.toString(),
        latitude: body.latitude.toString(),
        address: body.address,
        is_free: body.is_free ?? false,
        is_public: body.is_public ?? false,
        is_handicap: body.is_handicap ?? false,
        is_commerce: body.is_commerce ?? false,
        is_verified: body.is_verified ?? false,
      },
    });

    console.log("Toilet created successfully:", newToilet);
    return NextResponse.json(newToilet, { status: 201 });
  } catch (error) {
    console.error("Error creating toilet:", error);
    return NextResponse.json(
      { error: "Failed to create toilet" },
      { status: 500 }
    );
  }
}
