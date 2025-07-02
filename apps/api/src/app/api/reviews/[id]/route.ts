import { prisma } from "database";
import { NextRequest, NextResponse } from "next/server";

// GET a specific review by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    
    const review = await prisma.review.findUnique({
      where: { 
        id,
        deleted_at: null
      },
      include: {
        Toilet: {
          select: {
            id: true,
            longitude: true,
            latitude: true,
            is_free: true,
            is_public: true,
            is_handicap: true,
            is_commerce: true,
          }
        },
        User: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
      },
    });
    
    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}

// PUT update a review
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await request.json();
    
    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { 
        id,
        deleted_at: null
      },
    });
    
    if (!existingReview) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }
    
    // Validate rating if provided
    if (body.rating !== undefined && (body.rating < 1 || body.rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }
    
    // Update review
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating: body.rating !== undefined ? body.rating : undefined,
        comment: body.comment !== undefined ? body.comment : undefined,
        updated_at: new Date(),
      },
      include: {
        User: {
          select: {
            name: true,
            image: true,
          }
        }
      }
    });
    
    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE a review (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    
    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { 
        id,
        deleted_at: null
      },
    });
    
    if (!existingReview) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }
    
    // Soft delete the review
    const deletedReview = await prisma.review.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
    
    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
