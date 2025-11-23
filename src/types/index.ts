/**
 * Common TypeScript types and interfaces
 */

// Base entity with common fields
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User types
export interface User extends BaseEntity {
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
  bio?: string;
}

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  PARTNER = "partner",
}

// Destination types
export interface Destination extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  country: string;
  continent: string;
  images: DestinationImage[];
  coordinates: Coordinates;
  featured: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  bestTimeToVisit: string[];
  currency: string;
  language: string[];
  timezone: string;
}

export interface DestinationImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  isPrimary: boolean;
  order: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Tour/Package types
export interface Tour extends BaseEntity {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  destinationId: string;
  destination: Destination;
  images: TourImage[];
  price: Price;
  duration: Duration;
  groupSize: GroupSize;
  difficulty: Difficulty;
  includes: string[];
  excludes: string[];
  itinerary: ItineraryDay[];
  amenities: string[];
  travelStyle: string[];
  featured: boolean;
  rating: number;
  reviewCount: number;
  availability: Availability[];
}

export interface TourImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface Price {
  amount: number;
  currency: string;
  discountPercentage?: number;
  discountedAmount?: number;
}

export interface Duration {
  days: number;
  nights: number;
}

export interface GroupSize {
  min: number;
  max: number;
}

export enum Difficulty {
  EASY = "easy",
  MODERATE = "moderate",
  CHALLENGING = "challenging",
  DIFFICULT = "difficult",
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string[];
  accommodation?: string;
  activities: string[];
}

export interface Availability {
  startDate: Date;
  endDate: Date;
  availableSpots: number;
  price?: Price; // Can override base price
}

// Booking types
export interface Booking extends BaseEntity {
  userId: string;
  user: User;
  tourId: string;
  tour: Tour;
  startDate: Date;
  endDate: Date;
  numberOfTravelers: number;
  travelers: Traveler[];
  totalPrice: number;
  currency: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  specialRequests?: string;
  cancellationReason?: string;
  cancelledAt?: Date;
}

export interface Traveler {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  nationality: string;
  passportNumber?: string;
  isMainContact: boolean;
}

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

// Review types
export interface Review extends BaseEntity {
  userId: string;
  user: User;
  tourId: string;
  tour: Tour;
  bookingId: string;
  rating: number;
  title: string;
  content: string;
  images?: ReviewImage[];
  helpful: number;
  verified: boolean;
  response?: ReviewResponse;
}

export interface ReviewImage {
  id: string;
  url: string;
  alt: string;
}

export interface ReviewResponse {
  content: string;
  respondedAt: Date;
  respondedBy: string;
}

// Search and Filter types
export interface SearchFilters {
  query?: string;
  destination?: string;
  priceMin?: number;
  priceMax?: number;
  durationMin?: number;
  durationMax?: number;
  startDate?: Date;
  endDate?: Date;
  travelStyle?: string[];
  difficulty?: Difficulty[];
  amenities?: string[];
  rating?: number;
  sortBy?: SortOption;
}

export enum SortOption {
  POPULAR = "popular",
  PRICE_LOW = "price_low",
  PRICE_HIGH = "price_high",
  RATING = "rating",
  DURATION = "duration",
  NEWEST = "newest",
}

// Pagination types
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Form types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface BookingFormData {
  tourId: string;
  startDate: Date;
  numberOfTravelers: number;
  travelers: Traveler[];
  specialRequests?: string;
}

export interface ReviewFormData {
  rating: number;
  title: string;
  content: string;
  images?: File[];
}

// Utility types
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
