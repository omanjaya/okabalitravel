import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  try {
    await requireAdmin();

    const packages = await prisma.package.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        packageTours: {
          include: {
            tour: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
            wishlists: true,
          },
        },
      },
    });

    return NextResponse.json({ packages });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

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
      images,
      tourIds,
    } = body;

    // Validate required fields
    if (!name || !slug || !description || !shortDescription || !type || !price || !duration || !nights) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create package with images and tours
    const packageData: any = {
      name,
      slug,
      description,
      shortDescription,
      type,
      price: parseFloat(price),
      currency: currency || "USD",
      discountPercent: discountPercent ? parseInt(discountPercent) : null,
      duration: parseInt(duration),
      nights: parseInt(nights),
      regency: regency || null,
      featured: featured || false,
      includes: Array.isArray(includes) ? JSON.stringify(includes) : includes || "[]",
      excludes: Array.isArray(excludes) ? JSON.stringify(excludes) : excludes || "[]",
      highlights: Array.isArray(highlights) ? JSON.stringify(highlights) : highlights || "[]",
      minGroupSize: minGroupSize ? parseInt(minGroupSize) : 1,
      maxGroupSize: maxGroupSize ? parseInt(maxGroupSize) : 20,
    };

    // Add images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      packageData.images = {
        create: images.map((img: any, index: number) => ({
          url: img.url,
          alt: img.alt || name,
          caption: img.caption || null,
          isPrimary: index === 0,
          order: index + 1,
        })),
      };
    }

    // Add tours if provided
    if (tourIds && Array.isArray(tourIds) && tourIds.length > 0) {
      packageData.packageTours = {
        create: tourIds.map((tourId: string, index: number) => ({
          tourId,
          day: 1,
          optional: false,
          order: index + 1,
        })),
      };
    }

    const newPackage = await prisma.package.create({
      data: packageData,
      include: {
        images: true,
        packageTours: {
          include: {
            tour: true,
          },
        },
      },
    });

    return NextResponse.json({ package: newPackage }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error creating package:", error);
    return NextResponse.json(
      { error: "Failed to create package" },
      { status: 500 }
    );
  }
}
