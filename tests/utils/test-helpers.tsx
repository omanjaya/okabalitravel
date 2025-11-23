import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider } from 'next-intl'

// Mock messages for testing
const messages = {
  common: {
    search: 'Search',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
  },
  nav: {
    home: 'Home',
    destinations: 'Destinations',
    tours: 'Tours',
    packages: 'Packages',
  },
}

/**
 * Custom render function that wraps components with necessary providers
 */
export function renderWithProviders(
  ui: React.ReactElement,
  {
    session = null,
    locale = 'en',
    ...renderOptions
  }: RenderOptions & {
    session?: any
    locale?: string
  } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider session={session}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </SessionProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

/**
 * Mock user session for authenticated tests
 */
export const mockUserSession = {
  user: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@okabalitravel.com',
    role: 'USER',
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

/**
 * Mock admin session for admin tests
 */
export const mockAdminSession = {
  user: {
    id: 'test-admin-id',
    name: 'Admin User',
    email: 'admin@okabalitravel.com',
    role: 'ADMIN',
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

/**
 * Wait for async operations with timeout
 */
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Create mock booking data
 */
export const createMockBooking = (overrides = {}) => ({
  id: 'booking-123',
  userId: 'user-123',
  tourId: 'tour-123',
  startDate: new Date('2025-12-01'),
  endDate: new Date('2025-12-05'),
  numberOfTravelers: 2,
  totalPrice: 1500,
  currency: 'USD',
  status: 'PENDING',
  paymentStatus: 'PENDING',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

/**
 * Create mock tour data
 */
export const createMockTour = (overrides = {}) => ({
  id: 'tour-123',
  title: 'Amazing Bali Adventure',
  slug: 'amazing-bali-adventure',
  description: 'Explore the best of Bali',
  shortDescription: 'Best Bali tour',
  destinationId: 'dest-123',
  price: 750,
  currency: 'USD',
  duration: 5,
  nights: 4,
  featured: true,
  rating: 4.8,
  reviewCount: 120,
  ...overrides,
})

/**
 * Create mock destination data
 */
export const createMockDestination = (overrides = {}) => ({
  id: 'dest-123',
  name: 'Ubud',
  slug: 'ubud-bali',
  description: 'Cultural heart of Bali',
  shortDescription: 'Bali culture center',
  country: 'Indonesia',
  continent: 'Asia',
  latitude: -8.5069,
  longitude: 115.2625,
  featured: true,
  rating: 4.7,
  reviewCount: 85,
  ...overrides,
})

/**
 * Create mock review data
 */
export const createMockReview = (overrides = {}) => ({
  id: 'review-123',
  userId: 'user-123',
  tourId: 'tour-123',
  rating: 5,
  title: 'Amazing experience!',
  content: 'This tour exceeded all my expectations.',
  helpful: 10,
  verified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: {
    name: 'John Doe',
    avatar: null,
  },
  ...overrides,
})

/**
 * Mock fetch responses
 */
export const mockFetch = (data: any, ok = true) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      status: ok ? 200 : 400,
      json: async () => data,
    } as Response)
  )
}

/**
 * Reset all mocks
 */
export const resetMocks = () => {
  jest.clearAllMocks()
  jest.resetAllMocks()
}

// Re-export everything from testing library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
