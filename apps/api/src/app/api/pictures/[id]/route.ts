import { prisma } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";

// GET a specific picture by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    
    const picture = await prisma.picture.findUnique({
      where: {
        id,
        deleted_at: null,
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
          },
        },
      },
    });

    if (!picture) {
      return NextResponse.json({ error: "Picture not found" }, { status: 404 });
    }

    return NextResponse.json(picture);
  } catch (error) {
    console.error("Error fetching picture:", error);
    return NextResponse.json(
      { error: "Failed to fetch picture" },
      { status: 500 }
    );
  }
}

// PUT update a picture
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const body = await request.json();

    // Check if picture exists
    const existingPicture = await prisma.picture.findUnique({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!existingPicture) {
      return NextResponse.json({ error: "Picture not found" }, { status: 404 });
    }

    // If toilet_id is provided, check if toilet exists
    if (body.toilet_id) {
      const toilet = await prisma.toilet.findUnique({
        where: {
          id: body.toilet_id,
          deleted_at: null,
        },
      });

      if (!toilet) {
        return NextResponse.json(
          { error: "Toilet not found" },
          { status: 404 }
        );
      }
    }

    // Update picture
    const updatedPicture = await prisma.picture.update({
      where: { id },
      data: {
        toilet_id: body.toilet_id !== undefined ? body.toilet_id : undefined,
        name: body.name !== undefined ? body.name : undefined,
        url: body.url !== undefined ? body.url : undefined,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(updatedPicture);
  } catch (error) {
    console.error("Error updating picture:", error);
    return NextResponse.json(
      { error: "Failed to update picture" },
      { status: 500 }
    );
  }
}

// DELETE a picture (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    
    // Check if picture exists
    const existingPicture = await prisma.picture.findUnique({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!existingPicture) {
      return NextResponse.json({ error: "Picture not found" }, { status: 404 });
    }

    // Soft delete the picture
    const deletedPicture = await prisma.picture.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });

    return NextResponse.json({ message: "Picture deleted successfully" });
  } catch (error) {
    console.error("Error deleting picture:", error);
    return NextResponse.json(
      { error: "Failed to delete picture" },
      { status: 500 }
    );
  }
}
