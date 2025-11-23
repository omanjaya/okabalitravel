import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const regency = searchParams.get("regency");
    const published = searchParams.get("published");

    const where: any = {};

    if (regency) {
      where.regency = regency;
    }

    if (published !== null) {
      where.published = published === "true";
    } else {
      // Default to published only
      where.published = true;
    }

    const books = await prisma.travelBook.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    console.error("Travel book fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
