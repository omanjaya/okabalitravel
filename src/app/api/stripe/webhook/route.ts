import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/server/db/client";
import { sendPaymentConfirmationEmail } from "@/lib/email-service";
import Stripe from "stripe";

// Disable body parsing for Stripe webhooks
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionExpired(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("PaymentIntent succeeded:", paymentIntent.id);
        // Additional handling if needed
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const bookingId = session.metadata?.bookingId;

  if (!bookingId) {
    console.error("No bookingId in session metadata");
    return;
  }

  // Update booking status and fetch booking details
  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      paymentStatus: "PAID",
      status: "CONFIRMED",
      paymentId: session.payment_intent as string,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      tour: {
        select: {
          title: true,
        },
      },
    },
  });

  console.log(`Booking ${bookingId} marked as PAID and CONFIRMED`);

  // Send payment confirmation email
  try {
    await sendPaymentConfirmationEmail({
      bookingId: booking.id,
      tourTitle: booking.tour.title,
      customerName: booking.user.name || "Valued Customer",
      customerEmail: booking.user.email,
      totalPrice: booking.totalPrice,
      currency: booking.currency,
      paymentId: session.payment_intent as string,
      paymentDate: new Date(),
    });
    console.log(`Payment confirmation email sent to ${booking.user.email}`);
  } catch (error) {
    console.error("Failed to send payment confirmation email:", error);
    // Don't throw - email failure shouldn't fail the webhook
  }
}

async function handleCheckoutSessionExpired(
  session: Stripe.Checkout.Session
) {
  const bookingId = session.metadata?.bookingId;

  if (!bookingId) {
    console.error("No bookingId in session metadata");
    return;
  }

  // Optionally update booking to show checkout expired
  // You might want to keep it as PENDING or create a new status
  console.log(`Checkout session expired for booking ${bookingId}`);
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  // Find booking by payment intent ID
  const booking = await prisma.booking.findFirst({
    where: { paymentId: paymentIntent.id },
  });

  if (booking) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: "FAILED",
      },
    });

    console.log(`Payment failed for booking ${booking.id}`);
    // TODO: Send payment failed email
  }
}
