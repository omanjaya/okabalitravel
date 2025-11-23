/**
 * Application-wide constants
 */

// Site metadata
export const SITE_CONFIG = {
  name: "OkabaliTravel",
  description:
    "Spesialis paket wisata Bali terpercaya - Jelajahi keindahan Pulau Dewata bersama OkabaliTravel",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/okabalitravel",
    facebook: "https://facebook.com/okabalitravel",
    instagram: "https://instagram.com/okabalitravel",
  },
} as const;

// Navigation links
export const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/destinations", label: "Destinasi" },
  { href: "/tours", label: "Paket Wisata" },
  { href: "/packages", label: "Paket Spesial" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/contact", label: "Kontak" },
] as const;

// Footer links
export const FOOTER_LINKS = {
  company: [
    { href: "/about", label: "Tentang Kami" },
    { href: "/careers", label: "Karir" },
    { href: "/press", label: "Media" },
    { href: "/blog", label: "Blog" },
  ],
  support: [
    { href: "/help", label: "Pusat Bantuan" },
    { href: "/contact", label: "Hubungi Kami" },
    { href: "/faq", label: "FAQ" },
    { href: "/terms", label: "Syarat Layanan" },
    { href: "/privacy", label: "Kebijakan Privasi" },
  ],
  destinations: [
    { href: "/destinations/ubud-bali", label: "Ubud" },
    { href: "/destinations/seminyak-bali", label: "Seminyak" },
    { href: "/destinations/nusa-penida-bali", label: "Nusa Penida" },
    { href: "/destinations", label: "Lihat Semua" },
  ],
} as const;

// Popular Bali destinations (for homepage)
export const POPULAR_DESTINATIONS = [
  "Ubud, Bali",
  "Seminyak, Bali",
  "Nusa Penida, Bali",
  "Canggu, Bali",
  "Uluwatu, Bali",
  "Sanur, Bali",
  "Kuta, Bali",
  "Jimbaran, Bali",
] as const;

// Price range filters
export const PRICE_RANGES = [
  { label: "Budget", value: "0-500", min: 0, max: 500 },
  { label: "Mid-range", value: "500-1500", min: 500, max: 1500 },
  { label: "Luxury", value: "1500-3000", min: 1500, max: 3000 },
  { label: "Ultra Luxury", value: "3000+", min: 3000, max: Infinity },
] as const;

// Trip duration filters
export const DURATION_OPTIONS = [
  { label: "1-3 days", value: "1-3", min: 1, max: 3 },
  { label: "4-7 days", value: "4-7", min: 4, max: 7 },
  { label: "1-2 weeks", value: "8-14", min: 8, max: 14 },
  { label: "2+ weeks", value: "15+", min: 15, max: Infinity },
] as const;

// Amenities/Features
export const AMENITIES = [
  "Free WiFi",
  "Swimming Pool",
  "Spa & Wellness",
  "Fitness Center",
  "Restaurant",
  "Bar",
  "Airport Transfer",
  "Room Service",
  "Parking",
  "Pet Friendly",
  "Family Friendly",
  "Business Center",
] as const;

// Travel styles
export const TRAVEL_STYLES = [
  "Adventure",
  "Beach",
  "City Break",
  "Cultural",
  "Eco-Tourism",
  "Family",
  "Food & Wine",
  "Honeymoon",
  "Luxury",
  "Nature",
  "Photography",
  "Safari",
  "Spiritual",
  "Sports",
] as const;

// Booking status
export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
} as const;

// Payment status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

// API endpoints (for future use)
export const API_ROUTES = {
  DESTINATIONS: "/api/destinations",
  TOURS: "/api/tours",
  BOOKINGS: "/api/bookings",
  REVIEWS: "/api/reviews",
  USERS: "/api/users",
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 48],
} as const;

// Image sizes (for Next.js Image optimization)
export const IMAGE_SIZES = {
  thumbnail: { width: 300, height: 200 },
  card: { width: 600, height: 400 },
  hero: { width: 1920, height: 1080 },
  profile: { width: 200, height: 200 },
} as const;

// Date formats
export const DATE_FORMATS = {
  SHORT: "MMM dd, yyyy",
  LONG: "MMMM dd, yyyy",
  FULL: "EEEE, MMMM dd, yyyy",
  TIME: "HH:mm",
  DATETIME: "MMM dd, yyyy HH:mm",
} as const;
