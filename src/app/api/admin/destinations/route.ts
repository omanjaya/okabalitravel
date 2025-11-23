import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const destinations = await prisma.destination.findMany({
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            tours: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ destinations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch destinations" },
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
      name,
      slug,
      description,
      shortDescription,
      country,
      continent,
      latitude,
      longitude,
      featured,
      rating,
      reviewCount,
      currency,
      timezone,
      bestTimeToVisit,
      languages,
      tags,
      images,
    } = body;

    const destination = await prisma.destination.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        country,
        continent,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        featured: featured || false,
        rating: parseFloat(rating) || 0,
        reviewCount: parseInt(reviewCount) || 0,
        currency,
        timezone,
        bestTimeToVisit: JSON.stringify(bestTimeToVisit || []),
        languages: JSON.stringify(languages || []),
        tags: JSON.stringify(tags || []),
        images: images
          ? {
              create: images.map((img: any, index: number) => ({
                url: img.url,
                alt: img.alt,
                caption: img.caption || "",
                isPrimary: index === 0,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ destination }, { status: 201 });
  } catch (error) {
    console.error("Error creating destination:", error);
    return NextResponse.json(
      { error: "Failed to create destination" },
      { status: 500 }
    );
  }
}
