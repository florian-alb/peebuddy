import { prisma } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";

// GET search results across multiple resources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get search query
    const query = searchParams.get("q");
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }
    
    // Get search type (optional)
    const type = searchParams.get("type")?.toLowerCase();
    
    // Parse pagination parameters
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0;
    
    // Initialize results object
    const results: any = {};
    let totalResults = 0;
    
    // Search for toilets if type is not specified or type is 'toilets'
    if (!type || type === 'toilets') {
      // Search for toilets by coordinates (if query looks like coordinates)
      const coordsMatch = query.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
      
      let toilets = [];
      if (coordsMatch) {
        // If query is in format "latitude,longitude"
        const lat = parseFloat(coordsMatch[1]);
        const lon = parseFloat(coordsMatch[3]);
        
        // Search for toilets near these coordinates
        toilets = await prisma.toilet.findMany({
          where: {
            deleted_at: null,
            // Using approximate coordinate matching
            // This is a simple approach - for production, use a geospatial database or PostGIS
            AND: [
              { latitude: { gte: lat - 0.01, lte: lat + 0.01 } },
              { longitude: { gte: lon - 0.01, lte: lon + 0.01 } }
            ]
          },
          include: {
            Review: {
              where: { deleted_at: null },
              select: { rating: true },
            },
            Picture: {
              where: { deleted_at: null },
              take: 1,
            },
          },
          take: limit,
          skip: offset,
        });
      } else {
        // Otherwise, search for toilets with reviews containing the query
        toilets = await prisma.toilet.findMany({
          where: {
            deleted_at: null,
            Review: {
              some: {
                deleted_at: null,
                comment: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            },
          },
          include: {
            Review: {
              where: { 
                deleted_at: null,
                comment: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              select: { 
                id: true,
                rating: true,
                comment: true,
                user_id: true,
                User: {
                  select: {
                    name: true,
                    image: true,
                  }
                }
              },
              take: 3, // Limit the number of matching reviews returned
            },
            Picture: {
              where: { deleted_at: null },
              take: 1,
            },
          },
          take: limit,
          skip: offset,
        });
      }
      
      // Calculate average rating for each toilet
      const toiletsWithRating = toilets.map(toilet => {
        const avgRating = toilet.Review.length 
          ? toilet.Review.reduce((sum, review) => sum + review.rating, 0) / toilet.Review.length
          : null;
          
        return {
          ...toilet,
          avgRating,
          reviewCount: toilet.Review.length,
        };
      });
      
      results.toilets = toiletsWithRating;
      totalResults += toiletsWithRating.length;
    }
    
    // Search for reviews if type is not specified or type is 'reviews'
    if (!type || type === 'reviews') {
      const reviews = await prisma.review.findMany({
        where: {
          deleted_at: null,
          comment: {
            contains: query,
            mode: 'insensitive',
          },
        },
        include: {
          Toilet: {
            select: {
              id: true,
              longitude: true,
              latitude: true,
              is_free: true,
              is_public: true,
              is_handicap: true,
              is_commerce: true,
            }
          },
          User: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        take: limit,
        skip: offset,
      });
      
      results.reviews = reviews;
      totalResults += reviews.length;
    }
    
    // Search for users if type is not specified or type is 'users'
    if ((!type || type === 'users') && query.length >= 3) {
      const users = await prisma.user.findMany({
        where: {
          deleted_at: null,
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              }
            },
            {
              email: {
                contains: query,
                mode: 'insensitive',
              }
            }
          ]
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          roles: true,
          createdAt: true,
          // Include review count
          Review: {
            where: { deleted_at: null },
            select: { id: true },
          },
        },
        take: limit,
        skip: offset,
      });
      
      // Transform users to include review count
      const usersWithReviewCount = users.map(user => ({
        ...user,
        reviewCount: user.Review.length,
        Review: undefined, // Remove raw reviews from response
      }));
      
      results.users = usersWithReviewCount;
      totalResults += usersWithReviewCount.length;
    }
    
    return NextResponse.json({
      query,
      type: type || 'all',
      totalResults,
      results
    });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
