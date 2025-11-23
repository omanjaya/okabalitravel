import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/server/db/client";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.packageBooking.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        package: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
        travelers: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching package bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      packageId,
      startDate,
      endDate,
      numberOfTravelers,
      totalPrice,
      currency,
      travelers,
    } = body;

    // Validate required fields
    if (
      !packageId ||
      !startDate ||
      !endDate ||
      !numberOfTravelers ||
      !totalPrice ||
      !currency ||
      !travelers ||
      !Array.isArray(travelers)
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify package exists
    const packageData = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!packageData) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    // Validate group size
    if (
      numberOfTravelers < packageData.minGroupSize ||
      numberOfTravelers > packageData.maxGroupSize
    ) {
      return NextResponse.json(
        { error: "Invalid number of travelers" },
        { status: 400 }
      );
    }

    // Create booking with travelers
    const booking = await prisma.packageBooking.create({
      data: {
        userId: session.user.id,
        packageId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        numberOfTravelers,
        totalPrice,
        currency,
        status: "PENDING",
        paymentStatus: "PENDING",
        travelers: {
          create: travelers.map((traveler: any) => ({
            firstName: traveler.firstName,
            lastName: traveler.lastName,
            email: traveler.email,
            phone: traveler.phone,
            dateOfBirth: traveler.dateOfBirth ? new Date(traveler.dateOfBirth) : new Date(),
            nationality: traveler.nationality || "Unknown",
            passportNumber: traveler.passportNumber || null,
          })),
        },
      },
      include: {
        package: true,
        travelers: true,
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("Error creating package booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
