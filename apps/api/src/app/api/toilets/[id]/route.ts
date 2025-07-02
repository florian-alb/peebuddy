import { prisma } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";
import { ToiletWithRating, UpdateToiletDto } from "@/lib/types";

// GET a specific toilet by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    
    const toilet = await prisma.toilet.findUnique({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        Picture: {
          where: { deleted_at: null },
        },
        Review: {
          where: { deleted_at: null },
          include: {
            User: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!toilet) {
      return NextResponse.json({ error: "Toilet not found" }, { status: 404 });
    }

    // Calculate average rating
    const avgRating = toilet.Review.length
      ? toilet.Review.reduce(
          (sum: number, review: { rating: number }) => sum + review.rating,
          0
        ) / toilet.Review.length
      : null;

    const toiletWithRating: ToiletWithRating = {
      ...toilet,
      avgRating,
      reviewCount: toilet.Review.length,
    };

    return NextResponse.json(toiletWithRating);
  } catch (error) {
    console.error("Error fetching toilet:", error);
    return NextResponse.json(
      { error: "Failed to fetch toilet" },
      { status: 500 }
    );
  }
}

// PUT update a toilet
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await request.json() as UpdateToiletDto;
    
    // Check if toilet exists
    const existingToilet = await prisma.toilet.findUnique({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!existingToilet) {
      return NextResponse.json({ error: "Toilet not found" }, { status: 404 });
    }

    // Update toilet
    const updatedToilet = await prisma.toilet.update({
      where: { id },
      data: {
        longitude:
          body.longitude !== undefined ? body.longitude.toString() : undefined,
        latitude:
          body.latitude !== undefined ? body.latitude.toString() : undefined,
        is_free: body.is_free !== undefined ? body.is_free : undefined,
        is_public: body.is_public !== undefined ? body.is_public : undefined,
        is_handicap:
          body.is_handicap !== undefined ? body.is_handicap : undefined,
        is_commerce:
          body.is_commerce !== undefined ? body.is_commerce : undefined,
        is_verified:
          body.is_verified !== undefined ? body.is_verified : undefined,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(updatedToilet);
  } catch (error) {
    console.error("Error updating toilet:", error);
    return NextResponse.json(
      { error: "Failed to update toilet" },
      { status: 500 }
    );
  }
}

// DELETE a toilet (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    
    // Check if toilet exists
    const existingToilet = await prisma.toilet.findUnique({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!existingToilet) {
      return NextResponse.json({ error: "Toilet not found" }, { status: 404 });
    }

    // Soft delete the toilet
    const deletedToilet = await prisma.toilet.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });

    return NextResponse.json({ message: "Toilet deleted successfully" });
  } catch (error) {
    console.error("Error deleting toilet:", error);
    return NextResponse.json(
      { error: "Failed to delete toilet" },
      { status: 500 }
    );
  }
}
