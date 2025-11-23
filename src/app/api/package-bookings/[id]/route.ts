import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/server/db/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const booking = await prisma.packageBooking.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        package: {
          include: {
            images: true,
            packageTours: {
              include: {
                tour: {
                  include: {
                    destination: true,
                  },
                },
              },
            },
          },
        },
        travelers: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error) {
    console.error("Error fetching package booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const booking = await prisma.packageBooking.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Only allow cancellation by user
    if (body.status && body.status !== "CANCELLED") {
      return NextResponse.json(
        { error: "You can only cancel bookings" },
        { status: 403 }
      );
    }

    const updatedBooking = await prisma.packageBooking.update({
      where: { id },
      data: {
        status: body.status || booking.status,
      },
      include: {
        package: true,
        travelers: true,
      },
    });

    return NextResponse.json({ booking: updatedBooking }, { status: 200 });
  } catch (error) {
    console.error("Error updating package booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
