import { authClient } from "@workspace/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    // Get the session data
    const { data } = await authClient.getSession();
    
    // If no session or user data exists, redirect to login
    if (!data || !data.user) {
        const loginUrl = new URL("/", req.url);
        // Store the original URL to redirect back after login
        loginUrl.searchParams.set("callbackUrl", req.url);
        return NextResponse.redirect(loginUrl);
    }
    
    // Check if user has admin role
    if (data.user.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    
    // Add user data to headers for access in the route handlers
    const response = NextResponse.next();
    response.headers.set("x-user-id", data.user.id);
    response.headers.set("x-user-role", data.user.role);
    
    return response;
}

export const config = {
    matcher: [
        "/dashboard",
        "/dashboard/:path*",
        "/api/admin/:path*"
    ],
};
