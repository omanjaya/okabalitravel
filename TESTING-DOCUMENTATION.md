# 🧪 Testing Documentation - OkabaliTravel

Comprehensive testing guide for the OkabaliTravel project, covering unit tests, integration tests, and end-to-end tests.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Testing Stack](#testing-stack)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Running Tests](#running-tests)
6. [Writing Tests](#writing-tests)
7. [Testing Utilities](#testing-utilities)
8. [Best Practices](#best-practices)
9. [Coverage Guidelines](#coverage-guidelines)
10. [CI/CD Integration](#cicd-integration)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This project uses a comprehensive testing strategy with three layers:

- **Unit Tests** - Test individual functions and components in isolation
- **Integration Tests** - Test API endpoints and data flows
- **E2E Tests** - Test complete user flows from browser perspective

### Testing Philosophy

- Write tests that give confidence, not just coverage
- Test behavior, not implementation details
- Keep tests simple and maintainable
- Mock external dependencies appropriately

---

## 🛠️ Testing Stack

### Core Libraries

```json
{
  "jest": "^30.2.0",                          // Test runner
  "@testing-library/react": "^16.3.0",        // React component testing
  "@testing-library/jest-dom": "^6.9.1",      // DOM matchers
  "@testing-library/user-event": "^14.6.1",   // User interaction simulation
  "@playwright/test": "^1.56.1",              // E2E testing
  "jest-mock-extended": "^4.0.0",             // Advanced mocking
  "jest-environment-jsdom": "^30.2.0"         // Browser-like environment
}
```

### What Each Tool Does

- **Jest** - Fast test runner with built-in coverage and mocking
- **React Testing Library** - Tests React components as users interact with them
- **Playwright** - Cross-browser E2E testing with real browser automation
- **jest-mock-extended** - Type-safe mocking for TypeScript

---

## 🚀 Getting Started

### Installation

All dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Configuration Files

- **`jest.config.js`** - Jest configuration
- **`jest.setup.js`** - Global test setup (mocks, matchers)
- **`playwright.config.ts`** - Playwright E2E configuration

### Verify Installation

```bash
# Run unit tests
npm test

# Run E2E tests (requires dev server)
npm run test:e2e
```

---

## 📁 Project Structure

```
okabalitravel/
├── src/
│   ├── components/        # Components with co-located tests
│   │   └── __tests__/     # Component unit tests
│   ├── lib/               # Utilities with co-located tests
│   │   └── __tests__/     # Utility unit tests
│   └── app/api/           # API routes (tested via integration)
├── tests/
│   ├── unit/              # Standalone unit tests
│   │   ├── components/    # Component tests
│   │   └── lib/           # Utility function tests
│   ├── integration/       # API and data flow tests
│   │   └── api/           # API endpoint tests
│   ├── e2e/               # End-to-end tests
│   │   └── *.spec.ts      # Playwright test specs
│   └── utils/             # Testing utilities
│       ├── test-helpers.tsx    # React testing utilities
│       └── prisma-mock.ts      # Database mocking
├── jest.config.js         # Jest configuration
├── jest.setup.js          # Global test setup
└── playwright.config.ts   # Playwright configuration
```

---

## 🏃 Running Tests

### All Test Commands

```bash
# Run all unit & integration tests
npm test

# Watch mode (re-run on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run E2E with UI mode (interactive)
npm run test:e2e:ui

# Run E2E in headed mode (see browser)
npm run test:e2e:headed

# Run ALL tests (unit + integration + E2E)
npm run test:all
```

### Watch Specific Files

```bash
# Watch specific test file
npm test -- PaymentButton.test.tsx

# Watch tests matching pattern
npm test -- --testNamePattern="booking"
```

### Coverage Reports

```bash
npm run test:coverage
```

Opens HTML report at: `coverage/lcov-report/index.html`

**Coverage Targets:**
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

---

## ✍️ Writing Tests

### Unit Test Example (Component)

```tsx
/**
 * tests/unit/components/PaymentButton.test.tsx
 */
import { renderWithProviders, screen, userEvent } from '@/tests/utils/test-helpers'
import { PaymentButton } from '@/components/features/PaymentButton'

describe('PaymentButton', () => {
  it('renders payment button', () => {
    renderWithProviders(<PaymentButton bookingId="123" />)
    expect(screen.getByText(/pay now/i)).toBeInTheDocument()
  })

  it('handles click event', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PaymentButton bookingId="123" />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(button).toBeDisabled()
  })
})
```

### Unit Test Example (Utility Function)

```typescript
/**
 * tests/unit/lib/helpers.test.ts
 */
import { formatPrice, calculateDiscountPrice } from '@/lib/helpers'

describe('Helper Functions', () => {
  describe('formatPrice', () => {
    it('formats USD correctly', () => {
      expect(formatPrice(1000, 'USD')).toBe('$1,000.00')
    })

    it('handles zero value', () => {
      expect(formatPrice(0, 'USD')).toBe('$0.00')
    })
  })

  describe('calculateDiscountPrice', () => {
    it('calculates 20% discount correctly', () => {
      expect(calculateDiscountPrice(1000, 20)).toBe(800)
    })

    it('handles null discount', () => {
      expect(calculateDiscountPrice(1000, null)).toBe(1000)
    })
  })
})
```

### Integration Test Example (API)

```typescript
/**
 * tests/integration/api/bookings.test.ts
 */
import { createMockBooking } from '@/tests/utils/test-helpers'

describe('Booking API', () => {
  describe('POST /api/bookings', () => {
    it('creates a new booking', async () => {
      const bookingData = {
        tourId: 'tour-123',
        startDate: '2025-12-01',
        numberOfTravelers: 2,
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      })

      expect(response.ok).toBe(true)
      const data = await response.json()
      expect(data.booking).toBeDefined()
    })

    it('rejects invalid data', async () => {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({ invalid: 'data' }),
      })

      expect(response.ok).toBe(false)
      expect(response.status).toBe(400)
    })
  })
})
```

### E2E Test Example (Playwright)

```typescript
/**
 * tests/e2e/booking-flow.spec.ts
 */
import { test, expect } from '@playwright/test'

test.describe('Booking Flow', () => {
  test('completes booking successfully', async ({ page }) => {
    // Navigate to home
    await page.goto('/')
    
    // Browse destinations
    await page.click('text=Destinations')
    await expect(page).toHaveURL(/\/destinations/)
    
    // Select destination
    await page.click('.destination-card:first-child')
    
    // Book tour
    await page.click('text=Book Now')
    
    // Fill form
    await page.fill('input[name="firstName"]', 'John')
    await page.fill('input[name="email"]', 'john@test.com')
    
    // Submit
    await page.click('button[type="submit"]')
    
    // Verify success
    await expect(page.locator('text=Booking Confirmed')).toBeVisible()
  })
})
```

---

## 🛠️ Testing Utilities

### Custom Render Function

Located at: `tests/utils/test-helpers.tsx`

```tsx
import { renderWithProviders, screen } from '@/tests/utils/test-helpers'

// Automatically wraps components with:
// - SessionProvider
// - NextIntlClientProvider
// - Other necessary providers

renderWithProviders(<MyComponent />)
```

### Mock Data Factories

```tsx
import {
  createMockBooking,
  createMockTour,
  createMockDestination,
  createMockReview,
} from '@/tests/utils/test-helpers'

const booking = createMockBooking({ numberOfTravelers: 4 })
const tour = createMockTour({ price: 999 })
```

### Mock Sessions

```tsx
import { mockUserSession, mockAdminSession } from '@/tests/utils/test-helpers'

// Test with authenticated user
renderWithProviders(<Component />, { session: mockUserSession })

// Test with admin user
renderWithProviders(<AdminPanel />, { session: mockAdminSession })
```

### Prisma Mocking

Located at: `tests/utils/prisma-mock.ts`

```typescript
import { prismaMock, mockPrismaResponse } from '@/tests/utils/prisma-mock'

// Mock database response
mockPrismaResponse.user.findUnique({
  id: '123',
  email: 'test@example.com',
  name: 'Test User',
})

// Verify database was called
expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
  where: { id: '123' },
})
```

---

## 📚 Best Practices

### 1. Test Naming Convention

```typescript
// ❌ Bad
it('works', () => { ... })

// ✅ Good
it('displays error message when email is invalid', () => { ... })
it('redirects to dashboard after successful login', () => { ... })
```

### 2. Arrange-Act-Assert Pattern

```typescript
it('calculates total price correctly', () => {
  // Arrange - Set up test data
  const price = 1000
  const discount = 20
  
  // Act - Execute the function
  const result = calculateDiscountPrice(price, discount)
  
  // Assert - Check the result
  expect(result).toBe(800)
})
```

### 3. Test User Interactions, Not Implementation

```typescript
// ❌ Bad - Testing implementation
expect(component.state.isOpen).toBe(true)

// ✅ Good - Testing user-visible behavior
expect(screen.getByRole('dialog')).toBeVisible()
```

### 4. Use Descriptive Matchers

```typescript
// ❌ Less clear
expect(result === true).toBe(true)

// ✅ More clear
expect(result).toBe(true)

// ✅ Even better
expect(element).toBeInTheDocument()
expect(element).toBeVisible()
expect(element).toHaveTextContent('Expected text')
```

### 5. Avoid Test Interdependence

```typescript
// ❌ Bad - Tests depend on each other
describe('User flow', () => {
  let userId
  
  it('creates user', () => {
    userId = createUser()  // Other tests depend on this
  })
  
  it('updates user', () => {
    updateUser(userId)  // Breaks if first test fails
  })
})

// ✅ Good - Each test is independent
describe('User flow', () => {
  it('creates user', () => {
    const userId = createUser()
    expect(userId).toBeDefined()
  })
  
  it('updates user', () => {
    const userId = createUser()  // Create fresh user
    updateUser(userId)
  })
})
```

### 6. Mock External Dependencies

```typescript
// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({
    redirectToCheckout: jest.fn(),
  })),
}))

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => ({ success: true }),
  } as Response)
)
```

### 7. Clean Up After Tests

```typescript
afterEach(() => {
  jest.clearAllMocks()
  jest.resetAllMocks()
})

afterAll(() => {
  // Close database connections
  // Clear test data
})
```

---

## 📊 Coverage Guidelines

### What to Test

#### ✅ High Priority (Must Test)

1. **Critical Business Logic**
   - Payment processing
   - Booking creation/cancellation
   - Price calculations
   - User authentication

2. **User-Facing Features**
   - Form submissions
   - Navigation flows
   - Error messages
   - Loading states

3. **Data Transformations**
   - Format functions (price, date)
   - Validation logic
   - Data parsing

#### ⚠️ Medium Priority

1. **UI Components**
   - Interactive elements (buttons, forms)
   - Conditional rendering
   - User feedback (toasts, alerts)

2. **API Endpoints**
   - Request validation
   - Response formatting
   - Error handling

#### 💤 Low Priority (Optional)

1. **Static Components**
   - Pure presentational components
   - Simple layouts

2. **Third-party Integrations**
   - Already tested by library
   - Mock instead of testing

### Coverage Metrics

```bash
npm run test:coverage
```

**Target Coverage:**
- **Statements:** 80%+ 
- **Branches:** 75%+
- **Functions:** 80%+
- **Lines:** 80%+

**View Report:**
Open `coverage/lcov-report/index.html` in browser

---

## 🔄 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
      
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### Pre-commit Hook

Create `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run tests before commit
npm run test:unit
npm run lint
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Tests Timeout

**Problem:** Tests hang or timeout

**Solution:**
```typescript
// Increase timeout for specific test
it('slow operation', async () => {
  // ...
}, 10000) // 10 seconds

// Or globally in jest.config.js
testTimeout: 10000
```

#### 2. Module Not Found

**Problem:** `Cannot find module '@/...'`

**Solution:**
Check `tsconfig.json` paths match `jest.config.js` moduleNameMapper:

```javascript
// jest.config.js
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

#### 3. React Testing Library Errors

**Problem:** "Unable to find element"

**Solution:**
```typescript
// ❌ Bad - Query fails immediately
const element = screen.getByText('Loading...')

// ✅ Good - Wait for element
const element = await screen.findByText('Loading...')

// ✅ Better - Check if present
expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
```

#### 4. Playwright Connection Errors

**Problem:** "Error: browserType.launch: Executable doesn't exist"

**Solution:**
```bash
# Install Playwright browsers
npx playwright install

# Or with system dependencies
npx playwright install --with-deps
```

#### 5. Next.js Mocking Issues

**Problem:** "Cannot find module 'next/navigation'"

**Solution:**
Already handled in `jest.setup.js`:
```javascript
jest.mock('next/navigation', () => ({
  useRouter() { return { push: jest.fn() } },
  usePathname() { return '/' },
}))
```

---

## 📖 Additional Resources

### Documentation

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Testing Libraries Cheat Sheets

**Jest Matchers:**
```typescript
expect(value).toBe(expected)
expect(value).toEqual(expected)
expect(value).toBeTruthy()
expect(value).toBeDefined()
expect(array).toContain(item)
expect(string).toMatch(/pattern/)
```

**React Testing Library Queries:**
```typescript
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Email')
screen.getByPlaceholderText('Enter email')
screen.getByText(/welcome/i)
screen.getByTestId('custom-element')
```

**Playwright Actions:**
```typescript
await page.goto(url)
await page.click(selector)
await page.fill(selector, value)
await page.selectOption(selector, value)
await page.waitForSelector(selector)
await expect(page).toHaveURL(url)
```

---

## 🎯 Quick Start Checklist

- [ ] Install dependencies: `npm install`
- [ ] Verify Jest works: `npm test`
- [ ] Verify Playwright works: `npm run test:e2e`
- [ ] Write first unit test
- [ ] Write first integration test
- [ ] Write first E2E test
- [ ] Generate coverage report: `npm run test:coverage`
- [ ] Set up pre-commit hook
- [ ] Configure CI/CD pipeline
- [ ] Add tests to development workflow

---

## 📞 Support

For testing questions or issues:

1. Check this documentation
2. Review example tests in `tests/` directory
3. Check official library documentation
4. Ask the development team

---

**Last Updated:** 2025-11-21  
**Version:** 1.0.0  
**Maintainer:** OkabaliTravel Dev Team

---

## 🎉 You're Ready to Test!

Start writing tests with:

```bash
npm run test:watch
```

Happy Testing! 🚀
