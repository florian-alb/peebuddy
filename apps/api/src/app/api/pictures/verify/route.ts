import { prisma } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";

// POST to verify a picture
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    
    const existingPicture = await prisma.picture.findUnique({
      where: { 
        id,
        deleted_at: null
      },
    });
    
    if (!existingPicture) {
      return NextResponse.json(
        { error: "Picture not found" },
        { status: 404 }
      );
    }
    
    // If picture is already verified, return success
    if (existingPicture.is_verified) {
      return NextResponse.json({
        message: "Picture is already verified",
        picture: existingPicture
      });
    }
    
    // Update picture to mark as verified
    const verifiedPicture = await prisma.picture.update({
      where: { id },
      data: {
        is_verified: true,
        updated_at: new Date(),
      },
    });
    
    return NextResponse.json({
      message: "Picture verified successfully",
      picture: verifiedPicture
    });
  } catch (error) {
    console.error("Error verifying picture:", error);
    return NextResponse.json(
      { error: "Failed to verify picture" },
      { status: 500 }
    );
  }
}