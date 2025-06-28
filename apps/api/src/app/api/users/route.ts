import { prisma } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";

// GET all users with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters for filtering
    const role = searchParams.get("role");
    const email = searchParams.get("email");
    
    // Parse pagination parameters
    const take = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10;
    const skip = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0;
    
    // Build filter object
    const filter: any = {
      deleted_at: null, // Only return non-deleted users
    };
    
    if (role) filter.roles = role;
    if (email) filter.email = email;
    
    // Get users
    const users = await prisma.user.findMany({
      where: filter,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        roles: true,
        createdAt: true,
        updatedAt: true,
        // Exclude sensitive information
        accounts: false,
        sessions: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take,
      skip,
    });
    
    // Get total count for pagination
    const totalCount = await prisma.user.count({ where: filter });
    
    return NextResponse.json({
      data: users,
      meta: {
        total: totalCount,
        offset: skip,
        limit: take,
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
