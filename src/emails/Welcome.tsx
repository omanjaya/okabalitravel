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

interface WelcomeEmailProps {
  userName: string;
  dashboardUrl?: string;
}

export const WelcomeEmail = ({
  userName = "Traveler",
  dashboardUrl = "https://okabalitravel.com/dashboard",
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to OkabaliTravel - Start Your Adventure!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🌏 Welcome to OkabaliTravel!</Heading>

          <Text style={text}>Hi {userName},</Text>

          <Text style={text}>
            We're thrilled to have you join our community of adventurers! Your
            account has been successfully created, and you're now ready to explore
            amazing destinations around the world.
          </Text>

          <Section style={highlightBox}>
            <Heading as="h2" style={h2}>
              What You Can Do Now
            </Heading>

            <Text style={featureText}>
              🌍 <strong>Explore Destinations</strong>
              <br />
              Browse our curated collection of breathtaking destinations from Bali
              to Paris and beyond.
            </Text>

            <Text style={featureText}>
              ✈️ <strong>Book Amazing Tours</strong>
              <br />
              Choose from expertly crafted tour packages with local guides and
              unique experiences.
            </Text>

            <Text style={featureText}>
              💝 <strong>Save Your Favorites</strong>
              <br />
              Create your wishlist and save tours and destinations for later.
            </Text>

            <Text style={featureText}>
              ⭐ <strong>Read Real Reviews</strong>
              <br />
              Get insights from fellow travelers who've experienced these
              adventures.
            </Text>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              Go to My Dashboard
            </Button>
          </Section>

          <Hr style={hr} />

          <Heading as="h3" style={h3}>
            Need Help Getting Started?
          </Heading>

          <Text style={text}>
            📧 <strong>Contact Support:</strong> support@okabalitravel.com
            <br />
            💬 <strong>Live Chat:</strong> Available on our website
            <br />
            📱 <strong>Follow Us:</strong> Stay updated on Instagram, Facebook, and
            Twitter
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            OkabaliTravel - Your Gateway to Amazing Adventures
            <br />
            Making travel simple, beautiful, and unforgettable.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

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
  background: "linear-gradient(to right, #0ea5e9, #10b981)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontSize: "36px",
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

const highlightBox = {
  backgroundColor: "#f0fdfa",
  border: "1px solid #ccfbf1",
  borderRadius: "8px",
  margin: "32px 40px",
  padding: "24px",
};

const featureText = {
  color: "#374151",
  fontSize: "15px",
  lineHeight: "22px",
  margin: "16px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  background: "linear-gradient(to right, #0ea5e9, #10b981)",
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
  lineHeight: "18px",
  textAlign: "center" as const,
  margin: "32px 40px",
};
