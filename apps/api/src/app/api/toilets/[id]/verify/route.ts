import { prisma } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@workspace/auth";
import { createErrorResponse } from "@/lib/api-utils";

// POST to verify a toilet
export async function POST(
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
      return createErrorResponse("Admin access required to verify toilets", undefined, 403);
    }
    
    // Check if toilet exists
    const existingToilet = await prisma.toilet.findUnique({
      where: { 
        id,
        deleted_at: null
      },
    });
    
    if (!existingToilet) {
      return NextResponse.json(
        { error: "Toilet not found" },
        { status: 404 }
      );
    }
    
    // If toilet is already verified, return success
    if (existingToilet.is_verified) {
      return NextResponse.json({
        message: "Toilet is already verified",
        toilet: existingToilet
      });
    }
    
    // Update toilet to mark as verified
    const verifiedToilet = await prisma.toilet.update({
      where: { id },
      data: {
        is_verified: true,
        updated_at: new Date(),
      },
    });
    
    return NextResponse.json({
      message: "Toilet verified successfully",
      toilet: verifiedToilet
    });
  } catch (error) {
    console.error("Error verifying toilet:", error);
    return NextResponse.json(
      { error: "Failed to verify toilet" },
      { status: 500 }
    );
  }
}

// DELETE to remove verification from a toilet
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
    
    // Check if toilet exists
    const existingToilet = await prisma.toilet.findUnique({
      where: { 
        id,
        deleted_at: null
      },
    });
    
    if (!existingToilet) {
      return NextResponse.json(
        { error: "Toilet not found" },
        { status: 404 }
      );
    }
    
    // If toilet is not verified, return success
    if (!existingToilet.is_verified) {
      return NextResponse.json({
        message: "Toilet is already unverified",
        toilet: existingToilet
      });
    }
    
    // Update toilet to mark as unverified
    const unverifiedToilet = await prisma.toilet.update({
      where: { id },
      data: {
        is_verified: false,
        updated_at: new Date(),
      },
    });
    
    return NextResponse.json({
      message: "Toilet verification removed successfully",
      toilet: unverifiedToilet
    });
  } catch (error) {
    console.error("Error removing toilet verification:", error);
    return NextResponse.json(
      { error: "Failed to remove toilet verification" },
      { status: 500 }
    );
  }
}
