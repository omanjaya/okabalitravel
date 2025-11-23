import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { requireAdmin } from "@/lib/admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const packageData = await prisma.package.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        packageTours: {
          include: {
            tour: {
              include: {
                destination: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
        bookings: {
          select: {
            id: true,
            status: true,
            totalPrice: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            content: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!packageData) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ package: packageData });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error fetching package:", error);
    return NextResponse.json(
      { error: "Failed to fetch package" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      slug,
      description,
      shortDescription,
      type,
      price,
      currency,
      discountPercent,
      duration,
      nights,
      regency,
      featured,
      includes,
      excludes,
      highlights,
      minGroupSize,
      maxGroupSize,
    } = body;

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
    if (type !== undefined) updateData.type = type;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (currency !== undefined) updateData.currency = currency;
    if (discountPercent !== undefined) updateData.discountPercent = discountPercent ? parseInt(discountPercent) : null;
    if (duration !== undefined) updateData.duration = parseInt(duration);
    if (nights !== undefined) updateData.nights = parseInt(nights);
    if (regency !== undefined) updateData.regency = regency || null;
    if (featured !== undefined) updateData.featured = featured;
    if (includes !== undefined) updateData.includes = Array.isArray(includes) ? JSON.stringify(includes) : includes;
    if (excludes !== undefined) updateData.excludes = Array.isArray(excludes) ? JSON.stringify(excludes) : excludes;
    if (highlights !== undefined) updateData.highlights = Array.isArray(highlights) ? JSON.stringify(highlights) : highlights;
    if (minGroupSize !== undefined) updateData.minGroupSize = parseInt(minGroupSize);
    if (maxGroupSize !== undefined) updateData.maxGroupSize = parseInt(maxGroupSize);

    const updatedPackage = await prisma.package.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
        packageTours: {
          include: {
            tour: true,
          },
        },
      },
    });

    return NextResponse.json({ package: updatedPackage });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error updating package:", error);
    return NextResponse.json(
      { error: "Failed to update package" },
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

    await prisma.package.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Package deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error deleting package:", error);
    return NextResponse.json(
      { error: "Failed to delete package" },
      { status: 500 }
    );
  }
}
