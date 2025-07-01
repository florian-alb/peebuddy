"use server"

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@workspace/auth";
import { headers } from "next/headers";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

const publicPaths = [
  "/api",
  "/api/toilets",
  "/api/toilets/[id]",
  "/api/pictures",
  "/api/pictures/[id]",
  "/api/stats",
];

const adminPaths = [
  "/api/users",
  "/api/users/[id]",
  "/api/:path/unverify",
  "/api/:path/unverify/[id]"
];

const addCorsHeaders = (response: NextResponse) => {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
};

const createErrorResponse = (message: string, status: number) => {
  return new NextResponse(
    JSON.stringify({ error: message }),
    { 
      status, 
      headers: { 
        "content-type": "application/json",
        ...corsHeaders 
      } 
    }
  );
};

// Edge middleware doesn't support Prisma, so we'll rely on session data only

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const method = request.method;
  
  // Handle CORS preflight requests
  if (method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  // Allow public GET requests without authentication
  if (method === "GET" && publicPaths.some(p => path.startsWith(p.replace("[id]", "")))) {
    return addCorsHeaders(NextResponse.next());
  }
  
  // Skip auth for auth-related endpoints
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return addCorsHeaders(NextResponse.next());
  }
  
  // For all other paths, verify authentication
  try {
    // Get session using betterAuth
    const sessionData = await auth.api.getSession({
      headers: await headers()
    });
    
    // Log session data for debugging
    console.log("Session data:", sessionData);
    
    // Check if session exists and has user data
    if (!sessionData || !sessionData.user) {
      return createErrorResponse("Authentication required", 401);
    }
    
    // Check for admin role on admin paths
    if (adminPaths.some(p => path.startsWith(p.replace("[id]", "")))) {
      const isAdmin = sessionData.user.role === 'admin';
      
      if (!isAdmin) {
        return createErrorResponse("Admin access required", 403);
      }
    }
    
    // Add user data to headers for access in the route handlers
    const response = NextResponse.next();
    response.headers.set("x-user-id", sessionData.user.id);
    response.headers.set("x-user-email", sessionData.user.email);
    response.headers.set("x-user-role", sessionData.user.role || 'user');
    
    // User is authenticated (and is admin if required), proceed
    return addCorsHeaders(response);
  } catch (error) {
    console.error("Authentication error:", error);
    return createErrorResponse("Authentication failed", 401);
  }
}

// Configure which paths the middleware should run on
// should match every route that contains a /verify or /unverify
export const config = {
  matcher: [
    '/api/:path*',
    '/api/:path*/verify',
    '/api/:path*/unverify',
  ],
};
