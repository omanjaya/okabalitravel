import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface BookingConfirmationEmailProps {
  customerName: string;
  bookingId: string;
  tourTitle: string;
  destination: string;
  startDate: string;
  endDate: string;
  numberOfTravelers: number;
  totalPrice: number;
  currency: string;
  bookingUrl: string;
}

export const BookingConfirmationEmail = ({
  customerName = "Valued Customer",
  bookingId = "ABC123",
  tourTitle = "Ultimate Bali Adventure",
  destination = "Bali, Indonesia",
  startDate = "June 15, 2025",
  endDate = "June 22, 2025",
  numberOfTravelers = 2,
  totalPrice = 1299,
  currency = "USD",
  bookingUrl = "https://okabalitravel.com/bookings/abc123",
}: BookingConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your booking for {tourTitle} has been confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🎉 Booking Confirmed!</Heading>

          <Text style={text}>Hi {customerName},</Text>

          <Text style={text}>
            Great news! Your booking has been confirmed. We're excited to have you
            join us on this amazing adventure!
          </Text>

          <Section style={detailsBox}>
            <Heading as="h2" style={h2}>
              Booking Details
            </Heading>

            <table style={detailsTable}>
              <tr>
                <td style={labelCell}>Booking ID:</td>
                <td style={valueCell}>{bookingId}</td>
              </tr>
              <tr>
                <td style={labelCell}>Tour:</td>
                <td style={valueCell}>{tourTitle}</td>
              </tr>
              <tr>
                <td style={labelCell}>Destination:</td>
                <td style={valueCell}>{destination}</td>
              </tr>
              <tr>
                <td style={labelCell}>Travel Dates:</td>
                <td style={valueCell}>
                  {startDate} - {endDate}
                </td>
              </tr>
              <tr>
                <td style={labelCell}>Travelers:</td>
                <td style={valueCell}>{numberOfTravelers}</td>
              </tr>
              <tr>
                <td style={labelCell}>Total Amount:</td>
                <td style={valueCell}>
                  {currency} ${totalPrice.toLocaleString()}
                </td>
              </tr>
            </table>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={bookingUrl}>
              View Booking Details
            </Button>
          </Section>

          <Hr style={hr} />

          <Heading as="h3" style={h3}>
            What's Next?
          </Heading>

          <Text style={text}>
            📧 <strong>Check Your Email:</strong> You'll receive additional information
            about your trip as your departure date approaches.
          </Text>

          <Text style={text}>
            📋 <strong>Prepare Documents:</strong> Make sure your passport is valid
            for at least 6 months beyond your travel date.
          </Text>

          <Text style={text}>
            💬 <strong>Contact Us:</strong> If you have any questions, our support
            team is here to help at support@okabalitravel.com
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            OkabaliTravel - Your Gateway to Amazing Adventures
            <br />
            This email was sent to confirm your booking. Please do not reply to this
            email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default BookingConfirmationEmail;

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const h1 = {
  color: "#0ea5e9",
  fontSize: "32px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "40px 0",
};

const h2 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 20px",
};

const h3 = {
  color: "#1f2937",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "32px 40px 16px",
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 40px",
};

const detailsBox = {
  backgroundColor: "#f0f9ff",
  border: "1px solid #e0f2fe",
  borderRadius: "8px",
  margin: "32px 40px",
  padding: "24px",
};

const detailsTable = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const labelCell = {
  color: "#6b7280",
  fontSize: "14px",
  padding: "8px 0",
  verticalAlign: "top" as const,
  width: "40%",
};

const valueCell = {
  color: "#1f2937",
  fontSize: "14px",
  fontWeight: "600",
  padding: "8px 0",
  verticalAlign: "top" as const,
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#0ea5e9",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 40px",
};

const footer = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  margin: "32px 40px",
};
