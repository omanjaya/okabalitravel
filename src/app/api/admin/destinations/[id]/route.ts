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

    const destination = await prisma.destination.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        tours: true,
        _count: {
          select: {
            tours: true,
            reviews: true,
          },
        },
      },
    });

    if (!destination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ destination }, { status: 200 });
  } catch (error) {
    console.error("Error fetching destination:", error);
    return NextResponse.json(
      { error: "Failed to fetch destination" },
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

    const destination = await prisma.destination.update({
      where: { id },
      data: {
        ...body,
        latitude: body.latitude ? parseFloat(body.latitude) : undefined,
        longitude: body.longitude ? parseFloat(body.longitude) : undefined,
        rating: body.rating ? parseFloat(body.rating) : undefined,
        reviewCount: body.reviewCount ? parseInt(body.reviewCount) : undefined,
        bestTimeToVisit: body.bestTimeToVisit
          ? JSON.stringify(body.bestTimeToVisit)
          : undefined,
        languages: body.languages ? JSON.stringify(body.languages) : undefined,
        tags: body.tags ? JSON.stringify(body.tags) : undefined,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ destination }, { status: 200 });
  } catch (error) {
    console.error("Error updating destination:", error);
    return NextResponse.json(
      { error: "Failed to update destination" },
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

    // Check if destination has tours
    const destination = await prisma.destination.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tours: true },
        },
      },
    });

    if (!destination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }

    if (destination._count.tours > 0) {
      return NextResponse.json(
        { error: "Cannot delete destination with existing tours" },
        { status: 400 }
      );
    }

    await prisma.destination.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Destination deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting destination:", error);
    return NextResponse.json(
      { error: "Failed to delete destination" },
      { status: 500 }
    );
  }
}
