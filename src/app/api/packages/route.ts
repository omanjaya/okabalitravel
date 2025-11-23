import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const regency = searchParams.get("regency");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const duration = searchParams.get("duration");
    const featured = searchParams.get("featured");

    // Build where clause
    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (regency) {
      where.regency = regency;
    }

    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price.gte = parseFloat(priceMin);
      if (priceMax) where.price.lte = parseFloat(priceMax);
    }

    if (duration) {
      where.duration = parseInt(duration);
    }

    if (featured === "true") {
      where.featured = true;
    }

    const packages = await prisma.package.findMany({
      where,
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
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
      },
      orderBy: [{ featured: "desc" }, { rating: "desc" }],
    });

    return NextResponse.json({ packages }, { status: 200 });
  } catch (error) {
    console.error("Package fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
