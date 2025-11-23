import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/server/db/client";

// GET /api/reviews/packages?packageId=xxx&page=1&limit=10&sortBy=recent
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get("packageId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "recent"; // recent, helpful, rating

    if (!packageId) {
      return NextResponse.json(
        { error: "Package ID is required" },
        { status: 400 }
      );
    }

    // Build orderBy based on sortBy parameter
    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "helpful") {
      orderBy = { helpful: "desc" };
    } else if (sortBy === "rating") {
      orderBy = { rating: "desc" };
    }

    const skip = (page - 1) * limit;

    const [reviews, totalCount] = await Promise.all([
      prisma.packageReview.findMany({
        where: { packageId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          images: {
            orderBy: { order: "asc" },
          },
          response: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.packageReview.count({
        where: { packageId },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching package reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST /api/reviews/packages
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { packageId, rating, title, content, images } = body;

    // Validation
    if (!packageId || !rating || !title || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if package exists
    const packageExists = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!packageExists) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    // Check if user has already reviewed this package
    const existingReview = await prisma.packageReview.findFirst({
      where: {
        userId: session.user.id,
        packageId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this package" },
        { status: 400 }
      );
    }

    // Check if user has booked this package (optional - for verified badge)
    const hasBooking = await prisma.packageBooking.findFirst({
      where: {
        userId: session.user.id,
        packageId,
        status: "confirmed",
      },
    });

    // Create review with images
    const review = await prisma.packageReview.create({
      data: {
        userId: session.user.id,
        packageId,
        rating,
        title,
        content,
        verified: !!hasBooking,
        images: images
          ? {
              create: images.map((img: any, index: number) => ({
                url: img.url,
                alt: img.alt || `Review image ${index + 1}`,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        images: true,
      },
    });

    // Update package rating and review count
    const allReviews = await prisma.packageReview.findMany({
      where: { packageId },
      select: { rating: true },
    });

    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allReviews.length;

    await prisma.package.update({
      where: { id: packageId },
      data: {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json(
      { review, message: "Review created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating package review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
