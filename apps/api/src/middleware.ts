import { authClient } from "@workspace/auth";
import { NextRequest, NextResponse } from "next/server";

// CORS headers to allow cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Define paths that don't require authentication
const publicPaths = [
  "/api",
  "/api/toilets",
  "/api/toilets/[id]",
  "/api/pictures",
  "/api/pictures/[id]",
  "/api/stats",
];

// Define paths that require admin role
const adminPaths = ["/api/users", "/api/users/[id]"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const method = request.method;
  const token = request.headers.get("Authorization");
  // Handle OPTIONS request for CORS preflight
  if (method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // Allow all GET requests to public paths
  if (
    method === "GET" &&
    publicPaths.some((p) => path.startsWith(p.replace("[id]", "")))
  ) {
    const response = NextResponse.next();
    // Add CORS headers to the response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  if (!token && !request.nextUrl.pathname.startsWith("/api/auth")) {
    return new NextResponse(
      JSON.stringify({ error: "Authentication required" }),
      {
        status: 401,
        headers: {
          "content-type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }

  // Check for admin role on admin paths
  if (adminPaths.some((p) => path.startsWith(p.replace("[id]", "")))) {
    return new NextResponse(
      JSON.stringify({ error: "Admin access required" }),
      {
        status: 403,
        headers: {
          "content-type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }

  // For non-GET methods on public paths, require authentication
  if (
    publicPaths.some((p) => path.startsWith(p.replace("[id]", ""))) &&
    method !== "GET"
  ) {
    // Allow authenticated users to proceed
    const response = NextResponse.next();
    // Add CORS headers to the response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // Default: allow authenticated users to proceed
  const response = NextResponse.next();
  // Add CORS headers to the response
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/api/:path*"],
};
