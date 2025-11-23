# OkabaliTravel - Modern Travel Experience Platform

A beautiful, performant, and maintainable travel website built with modern web technologies, featuring smooth animations and professional UI/UX.

## Project Overview

OkabaliTravel is designed to provide users with an exceptional travel booking experience through:
- Beautiful, visual-first design with smooth animations
- Fast, responsive interface optimized for all devices
- Easy-to-maintain codebase with clean architecture
- Seamless booking flow with secure payments
- Interactive destination exploration

## Technology Stack

### Frontend
- **Framework:** Next.js 14+ with App Router
- **Styling:** TailwindCSS + Shadcn/ui components
- **Animations:** Framer Motion, Auto-Animate, Lottie React
- **Language:** TypeScript
- **State Management:** Zustand (global), TanStack Query (server state)
- **Forms:** React Hook Form + Zod validation

### Backend
- **Database:** PostgreSQL with Prisma ORM
- **API:** tRPC for type-safe APIs
- **Caching:** Redis
- **Authentication:** NextAuth.js

### Infrastructure
- **Image Optimization:** Cloudinary
- **CDN:** Cloudflare
- **Deployment:** Vercel (recommended) or custom hosting
- **Monitoring:** Sentry, Vercel Analytics

### Code Quality
- **Testing:** Jest, React Testing Library, Playwright
- **Linting:** ESLint + Prettier
- **Git Hooks:** Husky + Commitlint
- **CI/CD:** GitHub Actions

## Key Features

### Must-Have (MVP)
- ✅ Advanced search with filters (price, dates, amenities, location)
- ✅ Mobile-responsive design (mobile-first approach)
- ✅ Interactive map integration
- ✅ Image gallery with lazy loading
- ✅ Booking system integration
- ✅ User reviews & ratings
- ✅ Secure payment gateway

### Should-Have
- 🔄 User accounts & profiles
- 🔄 Wishlist/Favorites
- 🔄 Multi-language support
- 🔄 Email notifications
- 🔄 Social media integration

### Could-Have (Future Enhancements)
- 💡 AI-powered recommendations
- 💡 Virtual tours (360° views)
- 💡 Travel blog/content hub
- 💡 Loyalty program
- 💡 Live chat support

## Architecture

The project follows **Clean Architecture** principles with a modular monolith approach:

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Shadcn/ui base components
│   │   ├── features/           # Feature-specific components
│   │   └── layouts/            # Layout components
│   ├── lib/                    # Utility functions & configurations
│   ├── server/                 # Backend logic
│   │   ├── api/                # tRPC routers
│   │   ├── db/                 # Database client & schema
│   │   └── services/           # Business logic
│   ├── hooks/                  # Custom React hooks
│   ├── stores/                 # Zustand stores
│   ├── types/                  # TypeScript type definitions
│   └── styles/                 # Global styles
├── public/                     # Static assets
├── prisma/                     # Database schema & migrations
└── tests/                      # Test files
```

## Development Phases

### Phase 1: Foundation & Design System (Weeks 1-4) - IN PROGRESS
- Set up Next.js project with TypeScript
- Implement TailwindCSS and Shadcn/ui
- Create design system and component library
- Establish clean architecture patterns

### Phase 2: Core Features (Weeks 5-8)
- Implement search functionality with filters
- Build destination listing and detail pages
- Integrate interactive maps
- Create image galleries with optimization

### Phase 3: Booking System & User Features (Weeks 9-12)
- Implement user authentication
- Build booking flow and payment integration
- Add review and rating system
- Create user dashboard and profiles

### Phase 4: Performance & Polish (Weeks 13-14)
- Add smooth animations and transitions
- Optimize performance (Lighthouse 95+ score)
- Implement PWA features
- Final security audit and deployment

## Performance Goals

- **Lighthouse Score:** 95+ across all metrics
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Mobile Usability:** 100% mobile-friendly
- **Test Coverage:** 80%+
- **Security:** 0 critical vulnerabilities

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database
- Redis (for caching)
- Cloudinary account (for images)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/okabalitravel"

# Redis
REDIS_URL="redis://localhost:6379"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Payment Gateway (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Email Service
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT="587"
EMAIL_FROM="noreply@okabalitravel.com"
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests with Playwright
npm run format       # Format code with Prettier
```

## Project Structure Explained

### `/src/app`
Next.js App Router pages and API routes. Each folder represents a route.

### `/src/components`
- **ui/**: Base UI components from Shadcn/ui (buttons, inputs, cards, etc.)
- **features/**: Domain-specific components (SearchBar, BookingForm, DestinationCard)
- **layouts/**: Page layouts and navigation components

### `/src/server`
Backend logic separated from frontend:
- **api/**: tRPC routers and procedures
- **db/**: Prisma client and database utilities
- **services/**: Business logic and external integrations

### `/src/lib`
Shared utilities, helpers, and configuration files.

## Contributing

We follow a clean, maintainable coding approach:

1. **Code Style:** ESLint + Prettier enforced via git hooks
2. **Commit Messages:** Follow Conventional Commits specification
3. **Branch Naming:** `feature/`, `bugfix/`, `hotfix/` prefixes
4. **Pull Requests:** Require code review and passing CI checks
5. **Testing:** Write tests for new features and bug fixes

## Design System

The project uses a consistent design system built on:
- **Colors:** Defined in TailwindCSS config
- **Typography:** System font stack optimized for performance
- **Spacing:** TailwindCSS spacing scale
- **Components:** Shadcn/ui components with custom styling
- **Animations:** Framer Motion with consistent easing curves

## Security

- Authentication via NextAuth.js with secure session management
- Payment processing through Stripe (PCI compliant)
- Input validation with Zod schemas
- SQL injection prevention via Prisma ORM
- XSS protection with React's built-in escaping
- CSRF protection enabled by default in Next.js
- Regular dependency updates and security audits

## Performance Optimization

- Next.js Image component for automatic optimization
- Lazy loading for images and components
- CDN distribution via Cloudflare
- Redis caching for API responses
- Database query optimization with Prisma
- Bundle size monitoring and code splitting
- Progressive Web App (PWA) capabilities

## License

[MIT License](LICENSE) - feel free to use this project for your own purposes.

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Contact: support@okabalitravel.com
- Documentation: [docs.okabalitravel.com](https://docs.okabalitravel.com)

## Acknowledgments

Built with inspiration from leading travel platforms and modern web best practices.

---

**Current Status:** Phase 1 - Foundation & Design System (In Progress)

**Last Updated:** 2025-11-21
