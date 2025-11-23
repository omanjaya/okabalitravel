/**
 * E2E tests for booking flow using Playwright
 */
import { test, expect } from '@playwright/test'

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('/')
  })

  test('should complete booking flow successfully', async ({ page }) => {
    // 1. Browse destinations
    await page.click('text=Destinations')
    await expect(page).toHaveURL(/\/destinations/)

    // 2. Select a destination
    await page.click('.destination-card:first-child')
    await expect(page.locator('h1')).toBeVisible()

    // 3. View tour details
    await page.click('text=View Details')
    await expect(page.locator('text=Book Now')).toBeVisible()

    // 4. Click book now
    await page.click('text=Book Now')
    await expect(page.locator('text=Booking Details')).toBeVisible()

    // 5. Fill booking form
    await page.fill('input[name="numberOfTravelers"]', '2')
    await page.fill('input[name="firstName"]', 'John')
    await page.fill('input[name="lastName"]', 'Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+1234567890')

    // 6. Submit booking
    await page.click('button[type="submit"]')
    
    // 7. Verify success
    await expect(page.locator('text=Booking Confirmed')).toBeVisible({
      timeout: 10000,
    })
  })

  test('should show validation errors for incomplete form', async ({ page }) => {
    // Navigate to a tour page
    await page.goto('/tours/amazing-bali-adventure')
    
    // Click book now
    await page.click('text=Book Now')
    
    // Submit without filling form
    await page.click('button[type="submit"]')
    
    // Check for validation errors
    await expect(page.locator('text=required')).toBeVisible()
  })

  test('should navigate to payment after booking', async ({ page }) => {
    // Create a mock booking
    await page.goto('/bookings/test-booking-id')
    
    // Click pay now
    await page.click('text=Pay Now')
    
    // Should redirect to Stripe (or show payment modal)
    // In test mode, this might show a test payment interface
    await page.waitForURL(/stripe|checkout/, { timeout: 5000 }).catch(() => {
      // In some cases, payment might open in modal instead
      expect(page.locator('[data-testid="payment-modal"]')).toBeVisible()
    })
  })
})

test.describe('Tour Search and Filter', () => {
  test('should filter tours by destination', async ({ page }) => {
    await page.goto('/tours')
    
    // Click filter
    await page.click('text=Filter')
    
    // Select destination
    await page.selectOption('select[name="destination"]', 'Ubud')
    
    // Apply filter
    await page.click('text=Apply Filters')
    
    // Verify results
    await expect(page.locator('.tour-card')).toHaveCount(1, { timeout: 5000 })
  })

  test('should search tours by keyword', async ({ page }) => {
    await page.goto('/tours')
    
    // Type in search
    await page.fill('input[placeholder*="Search"]', 'Ubud')
    
    // Wait for results
    await page.waitForTimeout(1000)
    
    // Verify results contain keyword
    const results = await page.locator('.tour-card').allTextContents()
    expect(results.some(text => text.toLowerCase().includes('ubud'))).toBe(true)
  })
})
