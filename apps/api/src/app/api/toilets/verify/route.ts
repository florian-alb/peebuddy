import { prisma } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Allow-Credentials": "true",
};

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}

// POST to verify a toilet
export async function POST(
  request: NextRequest
) {
  try {
    // Get ID from request body instead of params
    const body = await request.json();
    const id = body.id;
    console.log("id", id);
    
    if (!id) {
      return NextResponse.json(
        { error: "Toilet ID is required" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    const existingToilet = await prisma.toilet.findUnique({
      where: { 
        id,
        deleted_at: null
      },
    });
    
    if (!existingToilet) {
      return NextResponse.json(
        { error: "Toilet not found" },
        { status: 404, headers: corsHeaders }
      );
    }
    
    if (existingToilet.is_verified) {
      return NextResponse.json({
        message: "Toilet is already verified",
        toilet: existingToilet
      }, { headers: corsHeaders });
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
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error verifying toilet:", error);
    return NextResponse.json(
      { error: "Failed to verify toilet" },
      { status: 500, headers: corsHeaders }
    );
  }
}