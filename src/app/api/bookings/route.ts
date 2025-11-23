import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/server/db/client";
import {
  sendBookingConfirmationEmail,
  sendAdminBookingNotification,
} from "@/lib/email-service";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      tourId,
      travelDate,
      numberOfTravelers,
      fullName,
      email,
      phone,
      specialRequests,
      totalPrice,
    } = await request.json();

    // Validate input
    if (!tourId || !travelDate || !numberOfTravelers || !fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify tour exists
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    // Validate group size
    if (
      numberOfTravelers < tour.minGroupSize ||
      numberOfTravelers > tour.maxGroupSize
    ) {
      return NextResponse.json(
        { error: `Group size must be between ${tour.minGroupSize} and ${tour.maxGroupSize}` },
        { status: 400 }
      );
    }

    // Validate travel date is in the future
    const selectedDate = new Date(travelDate);
    if (selectedDate < new Date()) {
      return NextResponse.json(
        { error: "Travel date must be in the future" },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Split full name into first and last name
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || fullName;
    const lastName = nameParts.slice(1).join(" ") || "";

    // Calculate end date based on tour duration
    const endDate = new Date(selectedDate);
    endDate.setDate(endDate.getDate() + tour.duration);

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        tourId,
        startDate: selectedDate,
        endDate: endDate,
        numberOfTravelers,
        totalPrice,
        currency: tour.currency,
        status: "PENDING", // PENDING, CONFIRMED, CANCELLED, COMPLETED
        paymentStatus: "PENDING", // PENDING, PAID, FAILED, REFUNDED
        specialRequests: specialRequests || null,
        travelers: {
          create: [
            {
              firstName,
              lastName,
              email,
              phone,
              dateOfBirth: new Date("1990-01-01"), // Placeholder, should collect this in form
              nationality: "Unknown", // Placeholder, should collect this in form
              isMainContact: true,
            },
          ],
        },
      },
      include: {
        tour: {
          include: {
            destination: true,
          },
        },
        travelers: true,
      },
    });

    // Send confirmation email to customer
    try {
      await sendBookingConfirmationEmail({
        id: booking.id,
        user: {
          name: user.name,
          email: user.email,
        },
        tour: {
          title: booking.tour.title,
          destination: {
            name: booking.tour.destination.name,
            country: booking.tour.destination.country,
          },
        },
        startDate: booking.startDate,
        endDate: booking.endDate,
        numberOfTravelers: booking.numberOfTravelers,
        totalPrice: booking.totalPrice,
        currency: booking.currency,
      });
      console.log(`Booking confirmation email sent to ${user.email}`);
    } catch (error) {
      console.error("Failed to send booking confirmation email:", error);
      // Don't fail the booking if email fails
    }

    // Send notification to admin
    try {
      await sendAdminBookingNotification({
        id: booking.id,
        user: {
          name: user.name,
          email: user.email,
        },
        tour: {
          title: booking.tour.title,
          destination: {
            name: booking.tour.destination.name,
            country: booking.tour.destination.country,
          },
        },
        startDate: booking.startDate,
        endDate: booking.endDate,
        numberOfTravelers: booking.numberOfTravelers,
        totalPrice: booking.totalPrice,
        currency: booking.currency,
      });
      console.log("Admin booking notification sent");
    } catch (error) {
      console.error("Failed to send admin notification:", error);
      // Don't fail the booking if email fails
    }

    return NextResponse.json(
      {
        booking: {
          id: booking.id,
          status: booking.status,
          totalPrice: booking.totalPrice,
        },
        message: "Booking created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's bookings
    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        tour: {
          include: {
            destination: true,
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
        travelers: {
          where: { isMainContact: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error("Booking fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
