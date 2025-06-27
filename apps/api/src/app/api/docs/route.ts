import { NextResponse } from "next/server";

// GET API documentation
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.peebuddy.com";
  
  const apiDocs = {
    name: "PeeBuddy API",
    version: "1.0.0",
    description: "API for the PeeBuddy application to find and review public toilets",
    baseUrl,
    endpoints: [
      {
        path: "/api",
        methods: ["GET"],
        description: "API information",
        auth: false,
      },
      {
        path: "/api/docs",
        methods: ["GET"],
        description: "API documentation",
        auth: false,
      },
      {
        path: "/api/toilets",
        methods: ["GET", "POST"],
        description: "List and create toilets",
        auth: {
          GET: false,
          POST: true,
        },
        params: {
          GET: {
            is_free: "boolean (optional) - Filter by free access",
            is_public: "boolean (optional) - Filter by public access",
            is_handicap: "boolean (optional) - Filter by handicap accessibility",
            is_commerce: "boolean (optional) - Filter by commercial establishment",
            is_verified: "boolean (optional) - Filter by verification status",
            limit: "number (optional) - Number of results to return (default: 10)",
            offset: "number (optional) - Offset for pagination (default: 0)",
          },
          POST: {
            longitude: "number (required) - Longitude coordinate",
            latitude: "number (required) - Latitude coordinate",
            is_free: "boolean (optional) - Whether the toilet is free to use",
            is_public: "boolean (optional) - Whether the toilet is public",
            is_handicap: "boolean (optional) - Whether the toilet is handicap accessible",
            is_commerce: "boolean (optional) - Whether the toilet is in a commercial establishment",
          },
        },
      },
      {
        path: "/api/toilets/{id}",
        methods: ["GET", "PUT", "DELETE"],
        description: "Get, update, or delete a specific toilet",
        auth: {
          GET: false,
          PUT: true,
          DELETE: true,
        },
        params: {
          PUT: {
            longitude: "number (optional) - Longitude coordinate",
            latitude: "number (optional) - Latitude coordinate",
            is_free: "boolean (optional) - Whether the toilet is free to use",
            is_public: "boolean (optional) - Whether the toilet is public",
            is_handicap: "boolean (optional) - Whether the toilet is handicap accessible",
            is_commerce: "boolean (optional) - Whether the toilet is in a commercial establishment",
            is_verified: "boolean (optional) - Whether the toilet is verified",
          },
        },
      },
      {
        path: "/api/toilets/nearby",
        methods: ["GET"],
        description: "Find toilets near a specific location",
        auth: false,
        params: {
          GET: {
            latitude: "number (required) - Latitude coordinate",
            longitude: "number (required) - Longitude coordinate",
            radius: "number (optional) - Search radius in kilometers (default: 5)",
            limit: "number (optional) - Number of results to return (default: 10)",
            is_free: "boolean (optional) - Filter by free access",
            is_public: "boolean (optional) - Filter by public access",
            is_handicap: "boolean (optional) - Filter by handicap accessibility",
            is_commerce: "boolean (optional) - Filter by commercial establishment",
          },
        },
      },
      {
        path: "/api/toilets/{id}/verify",
        methods: ["POST", "DELETE"],
        description: "Verify or unverify a toilet",
        auth: {
          POST: true,
          DELETE: "admin",
        },
      },
      {
        path: "/api/pictures",
        methods: ["GET", "POST"],
        description: "List and create pictures",
        auth: {
          GET: false,
          POST: true,
        },
        params: {
          GET: {
            toilet_id: "string (optional) - Filter by toilet ID",
            limit: "number (optional) - Number of results to return (default: 10)",
            offset: "number (optional) - Offset for pagination (default: 0)",
          },
          POST: {
            toilet_id: "string (optional) - ID of the associated toilet",
            name: "string (optional) - Name of the picture",
            url: "string (required) - URL of the picture",
          },
        },
      },
      {
        path: "/api/pictures/{id}",
        methods: ["GET", "PUT", "DELETE"],
        description: "Get, update, or delete a specific picture",
        auth: {
          GET: false,
          PUT: true,
          DELETE: true,
        },
        params: {
          PUT: {
            toilet_id: "string (optional) - ID of the associated toilet",
            name: "string (optional) - Name of the picture",
            url: "string (optional) - URL of the picture",
          },
        },
      },
      {
        path: "/api/reviews",
        methods: ["GET", "POST"],
        description: "List and create reviews",
        auth: {
          GET: false,
          POST: true,
        },
        params: {
          GET: {
            toilet_id: "string (optional) - Filter by toilet ID",
            user_id: "string (optional) - Filter by user ID",
            min_rating: "number (optional) - Filter by minimum rating",
            limit: "number (optional) - Number of results to return (default: 10)",
            offset: "number (optional) - Offset for pagination (default: 0)",
          },
          POST: {
            toilet_id: "string (required) - ID of the toilet being reviewed",
            user_id: "string (required) - ID of the user creating the review",
            rating: "number (required) - Rating from 1 to 5",
            comment: "string (optional) - Review comment",
          },
        },
      },
      {
        path: "/api/reviews/{id}",
        methods: ["GET", "PUT", "DELETE"],
        description: "Get, update, or delete a specific review",
        auth: {
          GET: false,
          PUT: true,
          DELETE: true,
        },
        params: {
          PUT: {
            rating: "number (optional) - Rating from 1 to 5",
            comment: "string (optional) - Review comment",
          },
        },
      },
      {
        path: "/api/users",
        methods: ["GET"],
        description: "List users (admin only)",
        auth: "admin",
        params: {
          GET: {
            role: "string (optional) - Filter by user role",
            email: "string (optional) - Filter by user email",
            limit: "number (optional) - Number of results to return (default: 10)",
            offset: "number (optional) - Offset for pagination (default: 0)",
          },
        },
      },
      {
        path: "/api/users/{id}",
        methods: ["GET", "PUT", "DELETE"],
        description: "Get, update, or delete a specific user",
        auth: {
          GET: "admin",
          PUT: "admin",
          DELETE: "admin",
        },
        params: {
          PUT: {
            name: "string (optional) - User's name",
            image: "string (optional) - User's profile image URL",
            roles: "string (optional) - User's role",
          },
        },
      },
    ],
    authentication: {
      type: "Bearer Token",
      description: "Authentication is handled through Next-Auth. Include the token in the Authorization header.",
      example: "Authorization: Bearer <token>",
    },
    errors: {
      "400": "Bad Request - The request was malformed or contains invalid parameters",
      "401": "Unauthorized - Authentication is required",
      "403": "Forbidden - The authenticated user does not have permission to access the resource",
      "404": "Not Found - The requested resource was not found",
      "409": "Conflict - The request conflicts with the current state of the resource",
      "500": "Internal Server Error - An unexpected error occurred on the server",
    },
  };
  
  return NextResponse.json(apiDocs);
}
