import { auth } from "@workspace/auth";
import { prisma } from "database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const sessionResult = await auth.api.getSession({
      headers: request.headers
    });
    
    if (sessionResult?.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }
    
    // Get user ID from request body
    const body = await request.json();
    const id = body.id;
    
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    
    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Prevent self-demotion
    if (existingUser.id === sessionResult.user.id) {
      return NextResponse.json(
        { error: "Cannot demote yourself" },
        { status: 400 }
      );
    }
    
    // Demote admin to user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: "user" },
    });
    
    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        role: updatedUser.role
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error demoting user:", error);
    return NextResponse.json(
      { error: "Failed to demote user" },
      { status: 500 }
    );
  }
}
