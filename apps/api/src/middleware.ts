import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Define paths that don't require authentication
const publicPaths = [
  "/api",
  "/api/toilets",
  "/api/toilets/[id]",
  "/api/pictures",
  "/api/pictures/[id]",
];

// Define paths that require admin role
const adminPaths = [
  "/api/users",
  "/api/users/[id]",
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const method = request.method;
  
  // Allow all GET requests to public paths
  if (method === "GET" && publicPaths.some(p => path.startsWith(p.replace("[id]", "")))) {
    return NextResponse.next();
  }
  
  // Check for authentication token
  const token = await getToken({ req: request });
  
  // If no token and not a public GET path, deny access
  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: "Authentication required" }),
      { status: 401, headers: { "content-type": "application/json" } }
    );
  }
  
  // Check for admin role on admin paths
  if (adminPaths.some(p => path.startsWith(p.replace("[id]", ""))) && token.roles !== "admin") {
    return new NextResponse(
      JSON.stringify({ error: "Admin access required" }),
      { status: 403, headers: { "content-type": "application/json" } }
    );
  }
  
  // For non-GET methods on public paths, require authentication
  if (publicPaths.some(p => path.startsWith(p.replace("[id]", ""))) && method !== "GET") {
    // Allow authenticated users to proceed
    return NextResponse.next();
  }
  
  // Default: allow authenticated users to proceed
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/api/:path*',
  ],
};
