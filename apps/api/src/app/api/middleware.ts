import { NextRequest, NextResponse } from "next/server";
import { auth } from "@workspace/auth";
import { headers } from "next/headers";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const publicPaths = [
  "/api",
  "/api/docs",
  "/api/stats",
  "/api/feed",
  "/api/search",
  "/api/toilets",
  "/api/toilets/nearby",
  "/api/pictures",
  "/api/reviews",
];

const adminPaths = [
  "/api/users",
  "/api/toilets/verify",
  "/api/toilets/unverify",
  "/api/pictures/verify",
  "/api/pictures/unverify",
  "/api/reviews/verify",
  "/api/reviews/unverify",
];

const addCorsHeaders = (response: NextResponse) => {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
};

const createErrorResponse = (message: string, status: number) => {
  return new NextResponse(JSON.stringify({ error: message }), {
    status,
    headers: {
      "content-type": "application/json",
      ...corsHeaders,
    },
  });
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const method = request.method;
  
  if (method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
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
      headers: await headers(),
    });
  
    console.log('sessionData', sessionData);
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
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
