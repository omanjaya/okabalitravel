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

    const book = await prisma.travelBook.findUnique({
      where: { id },
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

    return NextResponse.json({ book });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error fetching travel book:", error);
    return NextResponse.json(
      { error: "Failed to fetch travel book" },
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
      title,
      slug,
      description,
      regency,
      coverImage,
      order,
      published,
    } = body;

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (regency !== undefined) updateData.regency = regency;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (order !== undefined) updateData.order = parseInt(order);
    if (published !== undefined) updateData.published = published;

    const updatedBook = await prisma.travelBook.update({
      where: { id },
      data: updateData,
      include: {
        chapters: {
          include: {
            entries: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ book: updatedBook });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error updating travel book:", error);
    return NextResponse.json(
      { error: "Failed to update travel book" },
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

    await prisma.travelBook.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Travel book deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error deleting travel book:", error);
    return NextResponse.json(
      { error: "Failed to delete travel book" },
      { status: 500 }
    );
  }
}
