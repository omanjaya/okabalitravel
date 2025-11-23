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

interface PaymentConfirmationEmailProps {
  customerName: string;
  bookingId: string;
  tourTitle: string;
  totalPrice: number;
  currency: string;
  paymentDate: string;
  paymentId: string;
  bookingUrl: string;
}

export const PaymentConfirmationEmail = ({
  customerName = "Valued Customer",
  bookingId = "ABC123",
  tourTitle = "Ultimate Bali Adventure",
  totalPrice = 1299,
  currency = "USD",
  paymentDate = "November 21, 2025",
  paymentId = "pi_abc123",
  bookingUrl = "https://okabalitravel.com/bookings/abc123",
}: PaymentConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Payment received for {tourTitle} - Receipt enclosed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>✅ Payment Received</Heading>

          <Text style={text}>Hi {customerName},</Text>

          <Text style={text}>
            Thank you for your payment! Your transaction has been processed
            successfully and your booking is now fully confirmed.
          </Text>

          <Section style={receiptBox}>
            <Heading as="h2" style={h2}>
              Payment Receipt
            </Heading>

            <table style={detailsTable}>
              <tr>
                <td style={labelCell}>Payment Date:</td>
                <td style={valueCell}>{paymentDate}</td>
              </tr>
              <tr>
                <td style={labelCell}>Booking ID:</td>
                <td style={valueCell}>{bookingId}</td>
              </tr>
              <tr>
                <td style={labelCell}>Transaction ID:</td>
                <td style={valueCell}>{paymentId}</td>
              </tr>
              <tr>
                <td style={labelCell}>Tour:</td>
                <td style={valueCell}>{tourTitle}</td>
              </tr>
            </table>

            <Hr style={innerHr} />

            <table style={detailsTable}>
              <tr>
                <td style={totalLabel}>Total Paid:</td>
                <td style={totalValue}>
                  {currency} ${totalPrice.toLocaleString()}
                </td>
              </tr>
            </table>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={bookingUrl}>
              View Full Receipt
            </Button>
          </Section>

          <Hr style={hr} />

          <Section style={infoBox}>
            <Text style={infoText}>
              <strong>📄 Important Information:</strong>
            </Text>
            <Text style={infoText}>
              • Keep this email as your payment receipt
              <br />
              • A copy of your booking details has been sent separately
              <br />
              • For refunds or changes, please contact our support team
              <br />• Your receipt is also available in your account dashboard
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            OkabaliTravel - Your Gateway to Amazing Adventures
            <br />
            If you have any questions about this payment, contact us at
            support@okabalitravel.com
            <br />
            Transaction ID: {paymentId}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PaymentConfirmationEmail;

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
  color: "#10b981",
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

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 40px",
};

const receiptBox = {
  backgroundColor: "#f0fdf4",
  border: "2px solid #10b981",
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
  fontWeight: "500",
  padding: "8px 0",
  verticalAlign: "top" as const,
};

const totalLabel = {
  color: "#1f2937",
  fontSize: "18px",
  fontWeight: "bold",
  padding: "16px 0 0",
};

const totalValue = {
  color: "#10b981",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "16px 0 0",
  textAlign: "right" as const,
};

const innerHr = {
  borderColor: "#d1fae5",
  margin: "16px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#10b981",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
};

const infoBox = {
  backgroundColor: "#fffbeb",
  border: "1px solid #fef3c7",
  borderRadius: "8px",
  margin: "32px 40px",
  padding: "20px",
};

const infoText = {
  color: "#78350f",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "8px 0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 40px",
};

const footer = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "18px",
  textAlign: "center" as const,
  margin: "32px 40px",
};
