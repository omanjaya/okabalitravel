import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const packageData = await prisma.package.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        packageTours: {
          include: {
            tour: {
              include: {
                destination: true,
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
                itinerary: {
                  orderBy: { day: "asc" },
                },
              },
            },
          },
          orderBy: { order: "asc" },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
            images: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!packageData) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    return NextResponse.json({ package: packageData }, { status: 200 });
  } catch (error) {
    console.error("Package detail fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
