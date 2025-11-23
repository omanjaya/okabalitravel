# Development Guide

## Project Structure

```
okabalitravel/
├── src/
│   ├── app/                      # Next.js App Router (pages and API routes)
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Homepage
│   │   └── globals.css          # Global styles
│   ├── components/               # React components
│   │   ├── ui/                  # Base UI components (Shadcn/ui)
│   │   ├── features/            # Feature-specific components
│   │   └── layouts/             # Layout components (Header, Footer, etc.)
│   ├── lib/                      # Utility functions and configurations
│   │   ├── design-tokens.ts    # Design system tokens
│   │   ├── animations.ts       # Framer Motion configurations
│   │   ├── constants.ts        # App-wide constants
│   │   ├── helpers.ts          # Utility helper functions
│   │   └── utils.ts            # Shadcn/ui utilities
│   ├── server/                   # Backend logic
│   │   ├── api/                # tRPC routers (future)
│   │   ├── db/                 # Database client and utilities
│   │   └── services/           # Business logic
│   ├── hooks/                    # Custom React hooks
│   ├── stores/                   # Zustand state stores
│   └── types/                    # TypeScript type definitions
├── public/                       # Static assets
├── prisma/                       # Database schema and migrations
├── tests/                        # Test files
├── .env.example                 # Environment variables template
└── README.md                    # Project documentation
```

## Tech Stack

### Core
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/ui** - Component library

### State & Data
- **Zustand** - Global state management
- **TanStack Query** - Server state management
- **Prisma** - Database ORM (PostgreSQL)
- **tRPC** - Type-safe APIs

### UI & Animations
- **Framer Motion** - Complex animations
- **Auto-Animate** - Simple transitions
- **Lottie React** - JSON animations
- **Lucide React** - Icon library

### Code Quality
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

## Design System

### Colors
The design system uses a travel-themed color palette:
- **Primary (Sky Blue)**: `#0EA5E9` - Represents travel/sky
- **Secondary (Amber)**: `#F59E0B` - Represents sun/warmth
- **Accent (Emerald)**: `#10B981` - Represents nature/destinations

See `src/lib/design-tokens.ts` for complete color system.

### Typography
- **Font Family**: Geist Sans (default), Geist Mono (code)
- **Scale**: 12px to 60px
- **Weights**: Normal (400), Medium (500), Semibold (600), Bold (700)

### Spacing
Follows 8px grid system:
- xs: 8px, sm: 12px, md: 16px, lg: 24px, xl: 32px, etc.

### Animations
Pre-configured animation variants in `src/lib/animations.ts`:
- Fade, Slide, Scale animations
- Page transitions
- Card hover effects
- Modal/Dialog animations
- Loading states

## Development Workflow

### Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code with Prettier
npm run format:check     # Check formatting
npm run type-check       # Run TypeScript type checking

# Testing (to be added)
npm run test             # Run unit tests
npm run test:e2e         # Run E2E tests
```

## Coding Standards

### File Naming
- **Components**: PascalCase (e.g., `DestinationCard.tsx`)
- **Utilities**: camelCase (e.g., `helpers.ts`)
- **Types**: camelCase with descriptive names (e.g., `destination.types.ts`)

### Component Structure
```tsx
// 1. Imports
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/helpers";

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
  description?: string;
}

// 3. Component
export function Component({ title, description }: ComponentProps) {
  // 3a. Hooks
  const [state, setState] = useState(false);

  // 3b. Event handlers
  const handleClick = () => {
    setState(!state);
  };

  // 3c. Render
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("p-4", state && "bg-primary")}
    >
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <Button onClick={handleClick}>Click me</Button>
    </motion.div>
  );
}
```

### Import Order
1. React and Next.js imports
2. Third-party libraries
3. UI components
4. Local components
5. Utilities and helpers
6. Types
7. Styles

### TypeScript Best Practices
- Use interfaces for object shapes
- Use enums for fixed sets of values
- Avoid `any` - use `unknown` if type is truly unknown
- Export types from `src/types/index.ts`
- Use type inference when possible

### CSS/Styling
- Use Tailwind utility classes
- Use `cn()` helper for conditional classes
- Create custom components in Shadcn/ui style
- Avoid inline styles unless dynamic
- Use design tokens from `design-tokens.ts`

### Git Workflow
1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and commit: `git commit -m "feat: add feature"`
3. Push to remote: `git push origin feature/feature-name`
4. Create pull request
5. After review, merge to main

### Commit Messages
Follow Conventional Commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## Animation Guidelines

### When to Use Animations
- Page transitions
- Modal/dialog appearances
- Card hover effects
- Loading states
- Interactive feedback

### Performance Tips
- Use `transform` and `opacity` for animations (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Implement `AnimatePresence` for exit animations
- Keep animations under 500ms for better UX

## State Management

### Local State (useState)
For component-specific state that doesn't need sharing.

### Global State (Zustand)
For app-wide state like user session, theme, cart, etc.

### Server State (TanStack Query)
For data fetching, caching, and synchronization with backend.

## API Routes Structure (Future)

```typescript
// src/server/api/routers/destinations.ts
export const destinationsRouter = router({
  getAll: publicProcedure.query(async () => {
    // Implementation
  }),
  getById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      // Implementation
    }),
});
```

## Database Schema (Future)

Using Prisma ORM with PostgreSQL:
```prisma
// prisma/schema.prisma
model Destination {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  tours       Tour[]
}
```

## Testing Strategy (Future)

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Testing API routes and components together
- **E2E Tests**: Playwright for critical user flows
- **Visual Tests**: Chromatic for component snapshots

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically on push to main

### Custom Hosting
1. Build: `npm run build`
2. Start: `npm run start`
3. Configure reverse proxy (nginx)
4. Set up SSL certificates

## Troubleshooting

### Common Issues

**Build errors:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Type errors:**
```bash
npm run type-check
```

**ESLint errors:**
```bash
npm run lint:fix
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com)
- [Framer Motion Documentation](https://www.framer.com/motion)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
