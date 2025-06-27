import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    message: "PeeBuddy API",
    version: "1.0.0",
    description: "API for finding and reviewing public toilets",
    endpoints: [
      // Core CRUD endpoints
      "/api/toilets",
      "/api/toilets/[id]",
      "/api/pictures",
      "/api/pictures/[id]",
      "/api/reviews",
      "/api/reviews/[id]",
      "/api/users",
      "/api/users/[id]",
      
      // Special feature endpoints
      "/api/toilets/nearby",
      "/api/toilets/[id]/verify",
      "/api/search",
      "/api/stats",
      
      // Documentation
      "/api/docs"
    ],
    documentation: "/api/docs"
  });
}
