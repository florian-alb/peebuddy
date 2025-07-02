import { prisma } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";

// Pagination interface
interface PaginationParams {
  page: number;
  pageSize: number;
}

// GET statistics about the peeBuddy application
export async function GET(request: NextRequest) {
  // Extract pagination parameters from URL
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  // Validate pagination parameters
  const pagination: PaginationParams = {
    page: isNaN(page) || page < 1 ? 1 : page,
    pageSize: isNaN(pageSize) || pageSize < 1 || pageSize > 100 ? 10 : pageSize,
  };

  // Calculate skip value for pagination
  const skip = (pagination.page - 1) * pagination.pageSize;
  try {
    // Count total active toilets (count only)
    const totalToiletsCount = await prisma.toilet.count({
      where: { deleted_at: null },
    });

    // Get paginated toilets
    const totalToilets = await prisma.toilet.findMany({
      where: { deleted_at: null },
      skip,
      take: pagination.pageSize,
    });

    // Count verified toilets (count only)
    const verifiedToiletsCount = await prisma.toilet.count({
      where: {
        deleted_at: null,
        is_verified: true,
      },
    });

    // Get paginated verified toilets
    const verifiedToilets = await prisma.toilet.findMany({
      where: {
        deleted_at: null,
        is_verified: true,
      },
      skip,
      take: pagination.pageSize,
    });

    // Count toilets by type (counts only)
    const freeToiletsCount = await prisma.toilet.count({
      where: {
        deleted_at: null,
        is_free: true,
      },
    });

    const publicToiletsCount = await prisma.toilet.count({
      where: {
        deleted_at: null,
        is_public: true,
      },
    });

    const handicapToiletsCount = await prisma.toilet.count({
      where: {
        deleted_at: null,
        is_handicap: true,
      },
    });

    const commerceToiletsCount = await prisma.toilet.count({
      where: {
        deleted_at: null,
        is_commerce: true,
      },
    });

    // Get paginated toilets by type
    const freeToilets = await prisma.toilet.findMany({
      where: {
        deleted_at: null,
        is_free: true,
      },
      skip,
      take: pagination.pageSize,
    });

    const publicToilets = await prisma.toilet.findMany({
      where: {
        deleted_at: null,
        is_public: true,
      },
      skip,
      take: pagination.pageSize,
    });

    const handicapToilets = await prisma.toilet.findMany({
      where: {
        deleted_at: null,
        is_handicap: true,
      },
      skip,
      take: pagination.pageSize,
    });

    const commerceToilets = await prisma.toilet.findMany({
      where: {
        deleted_at: null,
        is_commerce: true,
      },
      skip,
      take: pagination.pageSize,
    });

    // Count total active reviews
    const totalReviews = await prisma.review.findMany({
      where: { deleted_at: null },
    });

    // Get average rating across all toilets
    const reviewsWithRating = await prisma.review.findMany({
      where: { deleted_at: null },
      select: { rating: true },
    });

    const avgRating =
      reviewsWithRating.length > 0
        ? reviewsWithRating.reduce((sum, review) => sum + review.rating, 0) /
          reviewsWithRating.length
        : 0;

    // Count total active users
    const totalUsersCount = await prisma.user.count({
      where: { deleted_at: null },
    });

    // Get paginated users
    const totalUsers = await prisma.user.findMany({
      where: { deleted_at: null },
      skip,
      take: pagination.pageSize,
    });

    // Count total active pictures
    const totalPicturesCount = await prisma.picture.count({
      where: { deleted_at: null },
    });

    // Get paginated pictures
    const totalPictures = await prisma.picture.findMany({
      where: { deleted_at: null },
      skip,
      take: pagination.pageSize,
    });

    // Get top rated toilets
    const topRatedToilets = await prisma.toilet.findMany({
      where: {
        deleted_at: null,
        reviews: {
          some: {
            deleted_at: null,
          },
        },
      },
      include: {
        reviews: {
          where: { deleted_at: null },
          select: { rating: true },
        },
      },
      take: 5,
    });

    // Calculate average rating for each toilet
    const topToilets = topRatedToilets
      .map((toilet) => {
        const avgToiletRating = toilet.reviews.length
          ? toilet.reviews.reduce((sum, review) => sum + review.rating, 0) /
            toilet.reviews.length
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
          reviewCount: toilet.reviews.length,
        };
      })
      .sort((a, b) => b.avgRating - a.avgRating);

    // Get most reviewed toilets
    const mostReviewedToilets = await prisma.toilet.findMany({
      where: {
        deleted_at: null,
        reviews: {
          some: {
            deleted_at: null,
          },
        },
      },
      include: {
        reviews: {
          where: { deleted_at: null },
        },
      },
      take: 5,
    });

    const popularToilets = mostReviewedToilets
      .map((toilet) => {
        const avgToiletRating = toilet.reviews.length
          ? toilet.reviews.reduce((sum, review) => sum + review.rating, 0) /
            toilet.reviews.length
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
          reviewCount: toilet.reviews.length,
        };
      })
      .sort((a, b) => b.reviewCount - a.reviewCount);

    // Compile statistics
    const statistics = {
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        hasMore: {
          toilets: totalToiletsCount > skip + pagination.pageSize,
          verifiedToilets: verifiedToiletsCount > skip + pagination.pageSize,
          freeToilets: freeToiletsCount > skip + pagination.pageSize,
          publicToilets: publicToiletsCount > skip + pagination.pageSize,
          handicapToilets: handicapToiletsCount > skip + pagination.pageSize,
          commerceToilets: commerceToiletsCount > skip + pagination.pageSize,
          users: totalUsersCount > skip + pagination.pageSize,
          pictures: totalPicturesCount > skip + pagination.pageSize,
        },
      },
      toilets: {
        total: totalToiletsCount,
        toilets: totalToilets,
        verified: {
          total: verifiedToiletsCount,
          toilets: verifiedToilets,
        },
        verificationRate:
          totalToiletsCount > 0
            ? (verifiedToiletsCount / totalToiletsCount) * 100
            : 0,
        byType: {
          free: {
            total: freeToiletsCount,
            toilets: freeToilets,
          },
          public: {
            total: publicToiletsCount,
            toilets: publicToilets,
          },
          handicap: {
            total: handicapToiletsCount,
            toilets: handicapToilets,
          },
          commerce: {
            total: commerceToiletsCount,
            toilets: commerceToilets,
          },
        },
      },
      reviews: {
        total: totalReviews.length,
        averageRating: parseFloat(avgRating.toFixed(2)),
      },
      users: {
        total: totalUsersCount,
        users: totalUsers,
      },
      pictures: {
        total: totalPicturesCount,
        pictures: totalPictures,
      },
      topRated: topToilets,
      mostReviewed: popularToilets,
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
