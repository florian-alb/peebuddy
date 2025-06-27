import { prisma } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";

// GET all pictures with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters for filtering
    const toiletId = searchParams.get("toilet_id");
    
    // Parse pagination parameters
    const take = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10;
    const skip = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0;
    
    // Build filter object
    const filter: any = {
      deleted_at: null, // Only return non-deleted pictures
    };
    
    if (toiletId) filter.toilet_id = toiletId;
    
    // Get pictures
    const pictures = await prisma.picture.findMany({
      where: filter,
      include: {
        Toilet: {
          select: {
            id: true,
            longitude: true,
            latitude: true,
          }
        },
      },
      take,
      skip,
    });
    
    // Get total count for pagination
    const totalCount = await prisma.picture.count({ where: filter });
    
    return NextResponse.json({
      data: pictures,
      meta: {
        total: totalCount,
        offset: skip,
        limit: take,
      }
    });
  } catch (error) {
    console.error("Error fetching pictures:", error);
    return NextResponse.json(
      { error: "Failed to fetch pictures" },
      { status: 500 }
    );
  }
}

// POST create a new picture
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }
    
    // If toilet_id is provided, check if toilet exists
    if (body.toilet_id) {
      const toilet = await prisma.toilet.findUnique({
        where: { 
          id: body.toilet_id,
          deleted_at: null
        },
      });
      
      if (!toilet) {
        return NextResponse.json(
          { error: "Toilet not found" },
          { status: 404 }
        );
      }
    }
    
    // Create new picture
    const newPicture = await prisma.picture.create({
      data: {
        toilet_id: body.toilet_id || null,
        name: body.name || null,
        url: body.url,
      },
    });
    
    return NextResponse.json(newPicture, { status: 201 });
  } catch (error) {
    console.error("Error creating picture:", error);
    return NextResponse.json(
      { error: "Failed to create picture" },
      { status: 500 }
    );
  }
}
