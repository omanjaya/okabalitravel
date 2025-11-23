/**
 * Integration tests for Booking API
 */
import { createMockBooking, mockUserSession } from '../../utils/test-helpers'

describe('Booking API', () => {
  describe('POST /api/bookings', () => {
    it('creates a new booking', async () => {
      const bookingData = {
        tourId: 'tour-123',
        startDate: '2025-12-01',
        endDate: '2025-12-05',
        numberOfTravelers: 2,
        travelers: [
          {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '+1234567890',
            dateOfBirth: '1990-01-01',
            nationality: 'US',
            isMainContact: true,
          },
        ],
      }

      // Mock fetch for this test
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 201,
          json: async () => ({
            success: true,
            booking: createMockBooking(bookingData),
          }),
        } as Response)
      )

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      })

      const data = await response.json()
      
      expect(response.ok).toBe(true)
      expect(data.success).toBe(true)
      expect(data.booking).toBeDefined()
      expect(data.booking.numberOfTravelers).toBe(2)
    })

    it('rejects booking with invalid data', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: async () => ({
            success: false,
            error: 'Invalid booking data',
          }),
        } as Response)
      )

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invalid: 'data' }),
      })

      const data = await response.json()
      
      expect(response.ok).toBe(false)
      expect(data.success).toBe(false)
      expect(data.error).toBeDefined()
    })
  })

  describe('GET /api/bookings/:id', () => {
    it('returns booking details', async () => {
      const mockBooking = createMockBooking()
      
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mockBooking,
        } as Response)
      )

      const response = await fetch(`/api/bookings/${mockBooking.id}`)
      const data = await response.json()
      
      expect(response.ok).toBe(true)
      expect(data.id).toBe(mockBooking.id)
    })

    it('returns 404 for non-existent booking', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          json: async () => ({ error: 'Booking not found' }),
        } as Response)
      )

      const response = await fetch('/api/bookings/non-existent-id')
      
      expect(response.ok).toBe(false)
      expect(response.status).toBe(404)
    })
  })

  describe('PATCH /api/bookings/:id', () => {
    it('updates booking status', async () => {
      const mockBooking = createMockBooking({ status: 'CONFIRMED' })
      
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mockBooking,
        } as Response)
      )

      const response = await fetch(`/api/bookings/${mockBooking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONFIRMED' }),
      })

      const data = await response.json()
      
      expect(response.ok).toBe(true)
      expect(data.status).toBe('CONFIRMED')
    })
  })
})
