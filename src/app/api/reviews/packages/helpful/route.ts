import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/server/db/client";

// POST /api/reviews/packages/helpful
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
    const { reviewId } = body;

    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    // Check if review exists
    const review = await prisma.packageReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Increment helpful count
    const updatedReview = await prisma.packageReview.update({
      where: { id: reviewId },
      data: {
        helpful: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      review: updatedReview,
      message: "Review marked as helpful",
    });
  } catch (error) {
    console.error("Error marking review as helpful:", error);
    return NextResponse.json(
      { error: "Failed to mark review as helpful" },
      { status: 500 }
    );
  }
}
