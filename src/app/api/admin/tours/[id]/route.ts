import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { isAdmin } from "@/lib/admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const tour = await prisma.tour.findUnique({
      where: { id },
      include: {
        destination: true,
        images: {
          orderBy: { order: "asc" },
        },
        itinerary: {
          orderBy: { day: "asc" },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    return NextResponse.json({ tour }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tour:", error);
    return NextResponse.json(
      { error: "Failed to fetch tour" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const tour = await prisma.tour.update({
      where: { id },
      data: {
        ...body,
        price: body.price ? parseFloat(body.price) : undefined,
        discountPercent: body.discountPercent
          ? parseInt(body.discountPercent)
          : undefined,
        duration: body.duration ? parseInt(body.duration) : undefined,
        nights: body.nights ? parseInt(body.nights) : undefined,
        minGroupSize: body.minGroupSize
          ? parseInt(body.minGroupSize)
          : undefined,
        maxGroupSize: body.maxGroupSize
          ? parseInt(body.maxGroupSize)
          : undefined,
        rating: body.rating ? parseFloat(body.rating) : undefined,
        reviewCount: body.reviewCount
          ? parseInt(body.reviewCount)
          : undefined,
        includes: body.includes ? JSON.stringify(body.includes) : undefined,
        excludes: body.excludes ? JSON.stringify(body.excludes) : undefined,
        amenities: body.amenities
          ? JSON.stringify(body.amenities)
          : undefined,
        travelStyle: body.travelStyle
          ? JSON.stringify(body.travelStyle)
          : undefined,
      },
      include: {
        destination: true,
        images: true,
      },
    });

    return NextResponse.json({ tour }, { status: 200 });
  } catch (error) {
    console.error("Error updating tour:", error);
    return NextResponse.json(
      { error: "Failed to update tour" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if tour has bookings
    const tour = await prisma.tour.findUnique({
      where: { id },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    if (tour._count.bookings > 0) {
      return NextResponse.json(
        { error: "Cannot delete tour with existing bookings" },
        { status: 400 }
      );
    }

    await prisma.tour.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Tour deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting tour:", error);
    return NextResponse.json(
      { error: "Failed to delete tour" },
      { status: 500 }
    );
  }
}
