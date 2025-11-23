import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const book = await prisma.travelBook.findUnique({
      where: { slug },
      include: {
        chapters: {
          include: {
            entries: {
              include: {
                images: {
                  orderBy: { order: "asc" },
                },
              },
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!book) {
      return NextResponse.json(
        { error: "Travel book not found" },
        { status: 404 }
      );
    }

    if (!book.published) {
      return NextResponse.json(
        { error: "Travel book not published" },
        { status: 403 }
      );
    }

    return NextResponse.json({ book }, { status: 200 });
  } catch (error) {
    console.error("Travel book detail fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
