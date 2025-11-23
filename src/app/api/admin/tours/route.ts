import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tours = await prisma.tour.findMany({
      include: {
        destination: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tours }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tours:", error);
    return NextResponse.json(
      { error: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      description,
      shortDescription,
      destinationId,
      price,
      currency,
      discountPercent,
      duration,
      nights,
      minGroupSize,
      maxGroupSize,
      difficulty,
      includes,
      excludes,
      amenities,
      travelStyle,
      featured,
      rating,
      reviewCount,
      images,
    } = body;

    const tour = await prisma.tour.create({
      data: {
        title,
        slug,
        description,
        shortDescription,
        destinationId,
        price: parseFloat(price),
        currency: currency || "USD",
        discountPercent: discountPercent ? parseInt(discountPercent) : null,
        duration: parseInt(duration),
        nights: parseInt(nights),
        minGroupSize: parseInt(minGroupSize) || 1,
        maxGroupSize: parseInt(maxGroupSize) || 20,
        difficulty: difficulty || "MODERATE",
        includes: JSON.stringify(includes || []),
        excludes: JSON.stringify(excludes || []),
        amenities: JSON.stringify(amenities || []),
        travelStyle: JSON.stringify(travelStyle || []),
        featured: featured || false,
        rating: parseFloat(rating) || 0,
        reviewCount: parseInt(reviewCount) || 0,
        images: images
          ? {
              create: images.map((img: any, index: number) => ({
                url: img.url,
                alt: img.alt,
                isPrimary: index === 0,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        destination: true,
        images: true,
      },
    });

    return NextResponse.json({ tour }, { status: 201 });
  } catch (error) {
    console.error("Error creating tour:", error);
    return NextResponse.json(
      { error: "Failed to create tour" },
      { status: 500 }
    );
  }
}
