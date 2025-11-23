import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body = await request.json();
    const { response, helpful } = body;

    // If response is provided, create or update the review response
    if (response !== undefined) {
      // Check if response already exists
      const existingResponse = await prisma.reviewResponse.findUnique({
        where: { reviewId: id },
      });

      if (existingResponse) {
        // Update existing response
        await prisma.reviewResponse.update({
          where: { reviewId: id },
          data: { content: response },
        });
      } else {
        // Create new response
        await prisma.reviewResponse.create({
          data: {
            reviewId: id,
            content: response,
            respondedBy: "admin", // TODO: Use actual admin user ID
          },
        });
      }
    }

    // Update helpful count if provided
    const updateData: { helpful?: number } = {};
    if (helpful !== undefined) {
      updateData.helpful = helpful;
    }

    const review = await prisma.review.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        tour: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        images: {
          orderBy: { order: "asc" },
        },
        response: true,
      },
    });

    return NextResponse.json({ review });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;

    // Get the review to find the tour ID
    const review = await prisma.review.findUnique({
      where: { id },
      select: { tourId: true },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Delete the review
    await prisma.review.delete({
      where: { id },
    });

    // Recalculate tour rating
    const allReviews = await prisma.review.findMany({
      where: { tourId: review.tourId },
      select: { rating: true },
    });

    if (allReviews.length > 0) {
      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      await prisma.tour.update({
        where: { id: review.tourId },
        data: {
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: allReviews.length,
        },
      });
    } else {
      // No reviews left, reset to 0
      await prisma.tour.update({
        where: { id: review.tourId },
        data: {
          rating: 0,
          reviewCount: 0,
        },
      });
    }

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
