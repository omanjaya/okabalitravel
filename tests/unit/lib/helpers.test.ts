/**
 * Unit tests for helper functions
 */
import {
  formatCurrency,
  formatDate,
  calculateDiscountPercentage,
  slugify,
  truncate,
  getInitials,
  capitalize,
} from '@/lib/helpers'

describe('Helper Functions', () => {
  describe('formatCurrency', () => {
    it('formats USD currency correctly', () => {
      const result = formatCurrency(1000, 'USD')
      expect(result).toContain('1,000')
    })

    it('formats IDR currency correctly', () => {
      const result = formatCurrency(15000000, 'IDR')
      expect(result).toBeTruthy()
    })

    it('handles zero value', () => {
      const result = formatCurrency(0, 'USD')
      expect(result).toBeTruthy()
    })

    it('handles decimal values', () => {
      const result = formatCurrency(99.99, 'USD')
      expect(result).toContain('99')
    })
  })

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2025-12-25')
      const formatted = formatDate(date)
      expect(formatted).toContain('Dec')
      expect(formatted).toContain('25')
      expect(formatted).toContain('2025')
    })

    it('handles Date objects', () => {
      const date = new Date('2025-01-01')
      expect(formatDate(date)).toBeTruthy()
    })

    it('handles string dates', () => {
      const formatted = formatDate('2025-06-15')
      expect(formatted).toBeTruthy()
      expect(formatted).toContain('Jun')
    })
  })

  describe('calculateDiscountPercentage', () => {
    it('calculates discount correctly', () => {
      expect(calculateDiscountPercentage(1000, 800)).toBe(20)
    })

    it('handles no discount', () => {
      expect(calculateDiscountPercentage(1000, 1000)).toBe(0)
    })

    it('handles 50% discount', () => {
      expect(calculateDiscountPercentage(1000, 500)).toBe(50)
    })
  })

  describe('slugify', () => {
    it('converts text to slug', () => {
      expect(slugify('Amazing Bali Tour')).toBe('amazing-bali-tour')
    })

    it('handles special characters', () => {
      expect(slugify('Ubud: Temple & Rice Fields!')).toBe('ubud-temple-rice-fields')
    })

    it('handles multiple spaces', () => {
      expect(slugify('Too   Many   Spaces')).toBe('too-many-spaces')
    })
  })

  describe('truncate', () => {
    it('truncates long text', () => {
      const text = 'This is a very long text that needs to be truncated'
      expect(truncate(text, 20)).toBe('This is a very long...')
    })

    it('does not truncate short text', () => {
      const text = 'Short text'
      expect(truncate(text, 20)).toBe('Short text')
    })
  })

  describe('getInitials', () => {
    it('gets initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD')
    })

    it('handles single name', () => {
      expect(getInitials('John')).toBe('J')
    })

    it('handles multiple names', () => {
      expect(getInitials('John Michael Doe')).toBe('JM')
    })
  })

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
    })

    it('handles already capitalized', () => {
      expect(capitalize('Hello')).toBe('Hello')
    })

    it('handles all caps', () => {
      expect(capitalize('HELLO')).toBe('Hello')
    })
  })
})
