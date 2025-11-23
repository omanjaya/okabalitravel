import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  try {
    await requireAdmin();

    const books = await prisma.travelBook.findMany({
      orderBy: { order: "asc" },
      include: {
        chapters: {
          include: {
            entries: {
              include: {
                images: {
                  take: 1,
                  orderBy: { order: "asc" },
                },
              },
            },
          },
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            chapters: true,
          },
        },
      },
    });

    return NextResponse.json({ books });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error fetching travel books:", error);
    return NextResponse.json(
      { error: "Failed to fetch travel books" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const {
      title,
      slug,
      description,
      regency,
      coverImage,
      order,
      published,
    } = body;

    // Validate required fields
    if (!title || !slug || !description || !regency || !coverImage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newBook = await prisma.travelBook.create({
      data: {
        title,
        slug,
        description,
        regency,
        coverImage,
        order: order ? parseInt(order) : 0,
        published: published || false,
      },
      include: {
        chapters: true,
      },
    });

    return NextResponse.json({ book: newBook }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error creating travel book:", error);
    return NextResponse.json(
      { error: "Failed to create travel book" },
      { status: 500 }
    );
  }
}
