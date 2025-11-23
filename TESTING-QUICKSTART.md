# 🚀 Testing Quick Start Guide

Fast setup guide to get you testing immediately.

---

## ✅ Setup Complete!

All testing infrastructure is already configured and ready to use.

---

## 🏃 Run Tests Now

```bash
# Run all unit & integration tests
npm test

# Watch mode (auto re-run on changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

---

## 📁 What's Been Set Up

### 1. **Dependencies Installed** ✅
- Jest (test runner)
- React Testing Library (component testing)
- Playwright (E2E testing)
- jest-mock-extended (advanced mocking)

### 2. **Configuration Files** ✅
- `jest.config.js` - Jest configuration
- `jest.setup.js` - Global mocks and setup
- `playwright.config.ts` - E2E test configuration

### 3. **Test Utilities** ✅
- `tests/utils/test-helpers.tsx` - React testing utilities
- `tests/utils/prisma-mock.ts` - Database mocking

### 4. **Example Tests** ✅
- `tests/unit/components/PaymentButton.test.tsx` - Component test
- `tests/unit/lib/helpers.test.ts` - Utility test
- `tests/integration/api/bookings.test.ts` - API test
- `tests/e2e/booking-flow.spec.ts` - E2E test

### 5. **Documentation** ✅
- `TESTING-DOCUMENTATION.md` - Complete testing guide (this is the main documentation)

---

## 📝 Your First Test

Create a new test file:

```typescript
// tests/unit/lib/myfunction.test.ts
describe('MyFunction', () => {
  it('should work correctly', () => {
    expect(true).toBe(true)
  })
})
```

Run it:
```bash
npm test myfunction
```

---

## 🎯 Test Commands Cheat Sheet

```bash
# Unit Tests
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:coverage      # With coverage report

# E2E Tests
npm run test:e2e          # Headless mode
npm run test:e2e:ui       # Interactive UI mode
npm run test:e2e:headed   # See browser

# All Tests
npm run test:all          # Run everything
```

---

## 📊 Test Structure

```
tests/
├── unit/              # Fast, isolated tests
│   ├── components/    # React component tests
│   └── lib/           # Utility function tests
├── integration/       # API and data flow tests
│   └── api/           # API endpoint tests
├── e2e/               # Full user journey tests
│   └── *.spec.ts      # Playwright specs
└── utils/             # Testing utilities
    ├── test-helpers.tsx    # React testing helpers
    └── prisma-mock.ts      # Database mocking
```

---

## 💡 Quick Tips

### 1. Writing Component Tests

```tsx
import { renderWithProviders, screen } from '@/tests/utils/test-helpers'
import MyComponent from '@/components/MyComponent'

it('renders correctly', () => {
  renderWithProviders(<MyComponent />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

### 2. Writing Function Tests

```typescript
import { formatPrice } from '@/lib/helpers'

it('formats price correctly', () => {
  expect(formatPrice(1000, 'USD')).toBe('$1,000.00')
})
```

### 3. Writing E2E Tests

```typescript
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('/auth/signin')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
```

---

## 🎨 Using Test Utilities

### Mock Data
```typescript
import { createMockBooking, createMockTour } from '@/tests/utils/test-helpers'

const booking = createMockBooking({ price: 1500 })
const tour = createMockTour({ featured: true })
```

### Mock Sessions
```typescript
import { mockUserSession, mockAdminSession } from '@/tests/utils/test-helpers'

// Test as logged-in user
renderWithProviders(<MyComponent />, { session: mockUserSession })

// Test as admin
renderWithProviders(<AdminPanel />, { session: mockAdminSession })
```

---

## 📖 Full Documentation

For complete testing guide, see: **[TESTING-DOCUMENTATION.md](./TESTING-DOCUMENTATION.md)**

Includes:
- Detailed best practices
- Coverage guidelines
- CI/CD integration
- Troubleshooting
- Advanced patterns

---

## 🐛 Common Issues

### Tests not found?
```bash
npm test -- --listTests
```

### Module resolution errors?
Check `tsconfig.json` paths match `jest.config.js`

### Playwright not working?
```bash
npx playwright install --with-deps
```

---

## 📈 Coverage Goals

**Target:** 80% overall coverage

View coverage:
```bash
npm run test:coverage
# Open: coverage/lcov-report/index.html
```

---

## ✨ Next Steps

1. ✅ Run existing tests: `npm test`
2. ✅ Write your first test
3. ✅ Set up watch mode: `npm run test:watch`
4. ✅ Generate coverage: `npm run test:coverage`
5. ✅ Read full documentation: `TESTING-DOCUMENTATION.md`

---

## 🎉 You're Ready!

Start testing with:

```bash
npm run test:watch
```

Happy Testing! 🚀

---

**Questions?** Check [TESTING-DOCUMENTATION.md](./TESTING-DOCUMENTATION.md) for detailed guides.
