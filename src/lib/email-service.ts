import { sendEmail } from "./email";
import { BookingConfirmationEmail } from "@/emails/BookingConfirmation";
import { PaymentConfirmationEmail } from "@/emails/PaymentConfirmation";
import { WelcomeEmail } from "@/emails/Welcome";
import { format } from "date-fns";

interface BookingData {
  id: string;
  user: {
    name: string | null;
    email: string;
  };
  tour: {
    title: string;
    destination: {
      name: string;
      country: string;
    };
  };
  startDate: Date;
  endDate: Date;
  numberOfTravelers: number;
  totalPrice: number;
  currency: string;
}

interface PaymentData {
  bookingId: string;
  tourTitle: string;
  customerName: string;
  customerEmail: string;
  totalPrice: number;
  currency: string;
  paymentId: string;
  paymentDate: Date;
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`;

  return await sendEmail({
    to: userEmail,
    subject: "Welcome to OkabaliTravel - Start Your Adventure! 🌏",
    react: WelcomeEmail({
      userName,
      dashboardUrl,
    }),
  });
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmationEmail(booking: BookingData) {
  const customerName = booking.user.name || "Valued Customer";
  const bookingUrl = `${process.env.NEXTAUTH_URL}/bookings/${booking.id}`;
  const destination = `${booking.tour.destination.name}, ${booking.tour.destination.country}`;

  return await sendEmail({
    to: booking.user.email,
    subject: `Booking Confirmed: ${booking.tour.title} ✈️`,
    react: BookingConfirmationEmail({
      customerName,
      bookingId: booking.id,
      tourTitle: booking.tour.title,
      destination,
      startDate: format(new Date(booking.startDate), "PPP"),
      endDate: format(new Date(booking.endDate), "PPP"),
      numberOfTravelers: booking.numberOfTravelers,
      totalPrice: booking.totalPrice,
      currency: booking.currency,
      bookingUrl,
    }),
  });
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmationEmail(payment: PaymentData) {
  const bookingUrl = `${process.env.NEXTAUTH_URL}/bookings/${payment.bookingId}`;

  return await sendEmail({
    to: payment.customerEmail,
    subject: `Payment Received - Receipt for ${payment.tourTitle} ✅`,
    react: PaymentConfirmationEmail({
      customerName: payment.customerName,
      bookingId: payment.bookingId,
      tourTitle: payment.tourTitle,
      totalPrice: payment.totalPrice,
      currency: payment.currency,
      paymentDate: format(new Date(payment.paymentDate), "PPP"),
      paymentId: payment.paymentId,
      bookingUrl,
    }),
  });
}

/**
 * Send booking status update email
 */
export async function sendBookingStatusUpdateEmail(
  userEmail: string,
  userName: string,
  bookingId: string,
  tourTitle: string,
  newStatus: string
) {
  const bookingUrl = `${process.env.NEXTAUTH_URL}/bookings/${bookingId}`;
  const statusEmoji = {
    CONFIRMED: "✅",
    CANCELLED: "❌",
    COMPLETED: "🎉",
  }[newStatus] || "📋";

  const statusMessage = {
    CONFIRMED: "Your booking has been confirmed! Get ready for your adventure.",
    CANCELLED: "Your booking has been cancelled. If this was unexpected, please contact support.",
    COMPLETED: "Your trip is complete! We hope you had an amazing experience. Please leave a review!",
  }[newStatus] || "Your booking status has been updated.";

  return await sendEmail({
    to: userEmail,
    subject: `${statusEmoji} Booking Update: ${tourTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px;">
            <h1 style="color: #0ea5e9; font-size: 28px; margin-bottom: 20px;">Booking Status Update ${statusEmoji}</h1>

            <p style="color: #374151; font-size: 16px; line-height: 24px;">Hi ${userName},</p>

            <p style="color: #374151; font-size: 16px; line-height: 24px;">${statusMessage}</p>

            <div style="background-color: #f0f9ff; border: 1px solid #e0f2fe; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;"><strong>Booking ID:</strong> ${bookingId}</p>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;"><strong>Tour:</strong> ${tourTitle}</p>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;"><strong>New Status:</strong> <span style="color: #0ea5e9; font-weight: bold;">${newStatus}</span></p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${bookingUrl}" style="background-color: #0ea5e9; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">View Booking Details</a>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #6b7280; font-size: 12px; text-align: center; line-height: 18px;">
              OkabaliTravel - Your Gateway to Amazing Adventures<br>
              If you have any questions, contact us at support@okabalitravel.com
            </p>
          </div>
        </body>
      </html>
    `,
  });
}

/**
 * Send admin notification for new booking
 */
export async function sendAdminBookingNotification(booking: BookingData) {
  const adminEmail = "admin@okabalitravel.com";
  const bookingUrl = `${process.env.NEXTAUTH_URL}/admin/bookings`;
  const customerName = booking.user.name || booking.user.email;

  return await sendEmail({
    to: adminEmail,
    subject: `🔔 New Booking: ${booking.tour.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px;">
            <h1 style="color: #0ea5e9; font-size: 28px; margin-bottom: 20px;">🔔 New Booking Received</h1>

            <p style="color: #374151; font-size: 16px; line-height: 24px;">A new booking has been created and requires your attention.</p>

            <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">Booking Details</h3>
              <p style="color: #374151; font-size: 14px; margin: 8px 0;"><strong>Booking ID:</strong> ${booking.id}</p>
              <p style="color: #374151; font-size: 14px; margin: 8px 0;"><strong>Tour:</strong> ${booking.tour.title}</p>
              <p style="color: #374151; font-size: 14px; margin: 8px 0;"><strong>Customer:</strong> ${customerName}</p>
              <p style="color: #374151; font-size: 14px; margin: 8px 0;"><strong>Email:</strong> ${booking.user.email}</p>
              <p style="color: #374151; font-size: 14px; margin: 8px 0;"><strong>Travel Date:</strong> ${format(new Date(booking.startDate), "PPP")}</p>
              <p style="color: #374151; font-size: 14px; margin: 8px 0;"><strong>Travelers:</strong> ${booking.numberOfTravelers}</p>
              <p style="color: #374151; font-size: 14px; margin: 8px 0;"><strong>Total:</strong> ${booking.currency} $${booking.totalPrice.toLocaleString()}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${bookingUrl}" style="background-color: #0ea5e9; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">Manage Bookings</a>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #6b7280; font-size: 12px; text-align: center; line-height: 18px;">
              OkabaliTravel Admin Notification<br>
              This is an automated message for administrators only.
            </p>
          </div>
        </body>
      </html>
    `,
  });
}
