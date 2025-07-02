import { prisma } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// GET all reviews with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters for filtering
    const toiletId = searchParams.get("toilet_id");
    const userId = searchParams.get("user_id");
    const minRating = searchParams.get("min_rating")
      ? parseInt(searchParams.get("min_rating")!)
      : undefined;

    // Parse pagination parameters
    const take = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 10;
    const skip = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : 0;

    // Build filter object
    const filter: any = {
      deleted_at: null, // Only return non-deleted reviews
    };

    if (toiletId) filter.toilet_id = toiletId;
    if (userId) filter.user_id = userId;
    if (minRating !== undefined) filter.rating = { gte: minRating };

    // Get reviews
    const reviews = await prisma.review.findMany({
      where: filter,
      include: {
        Toilet: {
          select: {
            id: true,
            longitude: true,
            latitude: true,
          },
        },
        User: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      take,
      skip,
    });

    // Get total count for pagination
    const totalCount = await prisma.review.count({ where: filter });

    return NextResponse.json({
      data: reviews,
      meta: {
        total: totalCount,
        offset: skip,
        limit: take,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST create a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.rating || !body.toilet_id || !body.user_id) {
      return NextResponse.json(
        { error: "Rating, toilet_id, and user_id are required" },
        { status: 400 }
      );
    }

    // Validate rating (1-5)
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if toilet exists
    const toilet = await prisma.toilet.findUnique({
      where: {
        id: body.toilet_id,
        deleted_at: null,
      },
    });

    if (!toilet) {
      return NextResponse.json({ error: "Toilet not found" }, { status: 404 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        id: body.user_id,
        deleted_at: null,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already reviewed this toilet
    const existingReview = await prisma.review.findFirst({
      where: {
        toilet_id: body.toilet_id,
        user_id: body.user_id,
        deleted_at: null,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "User has already reviewed this toilet" },
        { status: 400 }
      );
    }

    // Create new review
    const newReview = await prisma.review.create({
      data: {
        rating: body.rating,
        comment: body.comment || null,
        toilet_id: body.toilet_id,
        user_id: body.user_id,
      },
      include: {
        User: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        data: newReview,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
