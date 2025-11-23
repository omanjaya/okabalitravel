import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

export const STRIPE_CONFIG = {
  currency: "usd",
  successUrl: `${process.env.NEXTAUTH_URL}/bookings/{CHECKOUT_SESSION_ID}/success`,
  cancelUrl: `${process.env.NEXTAUTH_URL}/tours`,
} as const;
