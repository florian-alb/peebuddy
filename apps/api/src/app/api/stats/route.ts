import { prisma } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";

// GET statistics about the peeBuddy application
export async function GET(request: NextRequest) {
  try {
    // Count total active toilets
    const totalToilets = await prisma.toilet.count({
      where: { deleted_at: null }
    });
    
    // Count verified toilets
    const verifiedToilets = await prisma.toilet.count({
      where: { 
        deleted_at: null,
        is_verified: true
      }
    });
    
    // Count toilets by type
    const freeToilets = await prisma.toilet.count({
      where: { 
        deleted_at: null,
        is_free: true
      }
    });
    
    const publicToilets = await prisma.toilet.count({
      where: { 
        deleted_at: null,
        is_public: true
      }
    });
    
    const handicapToilets = await prisma.toilet.count({
      where: { 
        deleted_at: null,
        is_handicap: true
      }
    });
    
    const commerceToilets = await prisma.toilet.count({
      where: { 
        deleted_at: null,
        is_commerce: true
      }
    });
    
    // Count total active reviews
    const totalReviews = await prisma.review.count({
      where: { deleted_at: null }
    });
    
    // Get average rating across all toilets
    const reviewsWithRating = await prisma.review.findMany({
      where: { deleted_at: null },
      select: { rating: true }
    });
    
    const avgRating = reviewsWithRating.length > 0
      ? reviewsWithRating.reduce((sum, review) => sum + review.rating, 0) / reviewsWithRating.length
      : 0;
    
    // Count total active users
    const totalUsers = await prisma.user.count({
      where: { deleted_at: null }
    });
    
    // Count total active pictures
    const totalPictures = await prisma.picture.count({
      where: { deleted_at: null }
    });
    
    // Get top rated toilets
    const topRatedToilets = await prisma.toilet.findMany({
      where: { 
        deleted_at: null,
        Review: {
          some: {
            deleted_at: null
          }
        }
      },
      include: {
        Review: {
          where: { deleted_at: null },
          select: { rating: true }
        }
      },
      take: 5
    });
    
    // Calculate average rating for each toilet
    const topToilets = topRatedToilets
      .map(toilet => {
        const avgToiletRating = toilet.Review.length 
          ? toilet.Review.reduce((sum, review) => sum + review.rating, 0) / toilet.Review.length
          : 0;
          
        return {
          id: toilet.id,
          longitude: toilet.longitude,
          latitude: toilet.latitude,
          is_free: toilet.is_free,
          is_public: toilet.is_public,
          is_handicap: toilet.is_handicap,
          is_commerce: toilet.is_commerce,
          is_verified: toilet.is_verified,
          avgRating: avgToiletRating,
          reviewCount: toilet.Review.length
        };
      })
      .sort((a, b) => b.avgRating - a.avgRating);
    
    // Get most reviewed toilets
    const mostReviewedToilets = await prisma.toilet.findMany({
      where: { 
        deleted_at: null,
        Review: {
          some: {
            deleted_at: null
          }
        }
      },
      include: {
        Review: {
          where: { deleted_at: null }
        }
      },
      take: 5
    });
    
    const popularToilets = mostReviewedToilets
      .map(toilet => {
        const avgToiletRating = toilet.Review.length 
          ? toilet.Review.reduce((sum, review) => sum + review.rating, 0) / toilet.Review.length
          : 0;
          
        return {
          id: toilet.id,
          longitude: toilet.longitude,
          latitude: toilet.latitude,
          is_free: toilet.is_free,
          is_public: toilet.is_public,
          is_handicap: toilet.is_handicap,
          is_commerce: toilet.is_commerce,
          is_verified: toilet.is_verified,
          avgRating: avgToiletRating,
          reviewCount: toilet.Review.length
        };
      })
      .sort((a, b) => b.reviewCount - a.reviewCount);
    
    // Compile statistics
    const statistics = {
      toilets: {
        total: totalToilets,
        verified: verifiedToilets,
        verificationRate: totalToilets > 0 ? (verifiedToilets / totalToilets) * 100 : 0,
        byType: {
          free: freeToilets,
          public: publicToilets,
          handicap: handicapToilets,
          commerce: commerceToilets
        }
      },
      reviews: {
        total: totalReviews,
        averageRating: parseFloat(avgRating.toFixed(2))
      },
      users: {
        total: totalUsers
      },
      pictures: {
        total: totalPictures
      },
      topRated: topToilets,
      mostReviewed: popularToilets
    };
    
    return NextResponse.json(statistics);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
