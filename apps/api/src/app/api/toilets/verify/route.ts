import { prisma } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";

// POST to verify a toilet
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    
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