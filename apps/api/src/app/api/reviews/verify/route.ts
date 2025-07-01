

import { prisma } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@workspace/auth";
import { createErrorResponse } from "@/lib/api-utils";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
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
    
    // If review is already verified, return success
    if (existingReview.is_verified) {
      return NextResponse.json({
        message: "Review is already verified",
        review: existingReview
      });
    }
    
    // Update review to mark as verified
    const verifiedReview = await prisma.review.update({
      where: { id },
      data: {
        is_verified: true,
        updated_at: new Date(),
      },
    });
    
    return NextResponse.json({
      message: "Review verified successfully",
      review: verifiedReview
    });
  } catch (error) {
    console.error("Error verifying review:", error);
    return NextResponse.json(
      { error: "Failed to verify review" },
      { status: 500 }
    );
  }
}

// DELETE to remove verification from a review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check authentication and admin role
    const sessionResult = await auth.api.getSession({
      headers: request.headers
    });
    
    if (!sessionResult?.user) {
      return createErrorResponse("Authentication required", undefined, 401);
    }
    
    // Verify admin role
    const userRoles = (sessionResult.user as any).roles;
    if (userRoles !== 'admin' && !userRoles?.includes?.('admin')) {
      return createErrorResponse("Admin access required to remove verification", undefined, 403);
    }
    
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
    
    // If review is not verified, return success
    if (!existingReview.is_verified) {
      return NextResponse.json({
        message: "Review is already unverified",
        review: existingReview
      });
    }
    
    // Update review to mark as unverified
    const unverifiedReview = await prisma.review.update({
      where: { id },
      data: {
        is_verified: false,
        updated_at: new Date(),
      },
    });
    
    return NextResponse.json({
      message: "Review verified successfully",
      review: unverifiedReview
    });
  } catch (error) {
    console.error("Error verifying review:", error);
    return NextResponse.json(
      { error: "Failed to verify review" },
      { status: 500 }
    );
  }
}
