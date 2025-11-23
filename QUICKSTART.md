# OkabaliTravel - Quick Start Guide

## Get Started in 3 Minutes! ⚡

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Database
```bash
# Push schema to database
npx prisma db push

# Seed with demo data
npm run db:seed
```

### Step 3: Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## Demo Account

**Email:** demo@okabalitravel.com
**Password:** demo123

---

## Quick Test Flow

### 1. Browse as Guest
- Visit homepage
- Click on featured destinations
- View tour details
- Check out the reviews

### 2. Sign Up
- Click "Sign Up" in header
- Create account (or use demo account)
- Get redirected to dashboard

### 3. Book a Tour
- Browse tours
- Click "Book Now"
- Fill booking form
- Submit and view booking

### 4. Add to Wishlist
- Click heart icon on any card
- View saved items in `/wishlist`

### 5. Write a Review
- Go to any tour page
- Scroll to reviews section
- Submit your review

---

## Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter

# Database
npm run db:push      # Push schema changes
npm run db:seed      # Seed with demo data
npx prisma studio    # Open database GUI
```

---

## Project Structure

```
okabalitravel/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/            # API routes
│   │   ├── auth/           # Auth pages
│   │   ├── bookings/       # Booking pages
│   │   ├── dashboard/      # User dashboard
│   │   ├── destinations/   # Destinations
│   │   ├── tours/          # Tour pages
│   │   └── wishlist/       # Wishlist page
│   ├── components/         # React components
│   │   ├── features/       # Feature components
│   │   ├── layouts/        # Layout components
│   │   ├── providers/      # Context providers
│   │   └── ui/             # UI components
│   ├── lib/                # Utilities
│   ├── server/             # Server code
│   └── types/              # TypeScript types
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed script
└── public/                 # Static files
```

---

## Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Shadcn/ui
- Framer Motion

**Backend:**
- Next.js API Routes
- Prisma ORM
- SQLite (dev) / PostgreSQL (prod)
- NextAuth.js v5

**Authentication:**
- JWT Sessions
- Bcrypt hashing
- Protected routes

---

## Features

✅ User Authentication (Sign Up, Sign In, Sign Out)
✅ User Dashboard with stats
✅ Tour Booking System
✅ Booking Management
✅ Wishlist Functionality
✅ Review System (Submit & Display)
✅ Responsive Design
✅ Protected Routes
✅ Real-time updates

---

## Key Pages

- **/** - Homepage with featured destinations
- **/destinations** - Browse all destinations
- **/destinations/[slug]** - Destination details
- **/tours/[slug]** - Tour details with booking
- **/auth/signin** - Sign in page
- **/auth/signup** - Registration page
- **/dashboard** - User dashboard
- **/bookings** - My bookings
- **/bookings/[id]** - Booking details
- **/wishlist** - Saved items

---

## Environment Variables

Create `.env` file (already exists):

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
AUTH_SECRET="your-secret-key"
```

**Note:** Secrets are already set for development. Change for production!

---

## Troubleshooting

### Database Issues
```bash
# Reset database
rm prisma/dev.db
npx prisma db push
npm run db:seed
```

### Port Already in Use
```bash
# Change port in package.json or:
PORT=3001 npm run dev
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

---

## What's Next?

Check out these guides:
- **TESTING-GUIDE.md** - Comprehensive testing scenarios
- **PHASE3-COMPLETE.md** - Full feature documentation
- **DEVELOPMENT.md** - Coding standards

---

## Need Help?

- Check the documentation files
- Review the code comments
- Test with demo account first
- Check Prisma Studio for database (`npx prisma studio`)

---

**Happy Coding! 🚀**
