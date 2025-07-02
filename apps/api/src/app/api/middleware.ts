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
  
  if (method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  if (method === "GET" && publicPaths.some(p => path.startsWith(p.replace("[id]", "")))) {
    return addCorsHeaders(NextResponse.next());
  }
  
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return addCorsHeaders(NextResponse.next());
  }
  
  try {
    const sessionData = await auth.api.getSession({
      headers: await headers()
    });
    if (!sessionData || !sessionData.user) {
      return createErrorResponse("Authentication required", 401);
    }
    
    if (adminPaths.some(p => path.startsWith(p.replace("[id]", "")))) {
      const isAdmin = sessionData.user.role === 'admin';
      
      if (!isAdmin) {
        return createErrorResponse("Admin access required", 403);
      }
    }
    
    const response = NextResponse.next();
    response.headers.set("x-user-id", sessionData.user.id);
    response.headers.set("x-user-email", sessionData.user.email);
    response.headers.set("x-user-role", sessionData.user.role || 'user');
    
    return addCorsHeaders(response);
  } catch (error) {
    console.error("Authentication error:", error);
    return createErrorResponse("Authentication failed", 401);
  }
}

export const config = {
  matcher: [
    '/api/:path*',
    '/api/:path*/verify',
    '/api/:path*/unverify',
  ],
};
