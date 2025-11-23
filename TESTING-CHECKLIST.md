# OkabaliTravel Testing Checklist

**Server Status:** Running at http://localhost:3000 ✅

---

## Pre-Test Setup

### 1. Check Environment Variables
- [ ] `.env` file exists
- [ ] Database is seeded
- [ ] Admin user created (admin@okabalitravel.com / admin123)

### 2. Verify Database
```bash
# Check if data exists
npx prisma studio
```

---

## Phase 1: Basic User Flow Testing

### Test 1: Homepage & Navigation ✅
**URL:** http://localhost:3000

**Check:**
- [ ] Homepage loads without errors
- [ ] Hero section displays
- [ ] Featured destinations show
- [ ] Featured tours display
- [ ] Navigation menu works
- [ ] Footer displays

**Expected:** Clean homepage with tours and destinations

---

### Test 2: User Registration 📝
**URL:** http://localhost:3000/auth/signup

**Steps:**
1. [ ] Navigate to sign up page
2. [ ] Fill in:
   - Name: `Test User`
   - Email: `YOUR_REAL_EMAIL@example.com` (use your real email!)
   - Password: `test123`
3. [ ] Click "Sign Up"
4. [ ] Check for success message
5. [ ] **Check your email inbox** for welcome email

**Expected Results:**
- ✅ Account created successfully
- ✅ Redirected to dashboard or tours page
- ✅ Welcome email received within 1 minute
- ✅ Email has proper formatting and links

**Screenshot Welcome Email If Possible!**

---

### Test 3: User Login 🔐
**URL:** http://localhost:3000/auth/signin

**Steps:**
1. [ ] Sign out if logged in
2. [ ] Go to sign in page
3. [ ] Enter:
   - Email: (your test user email)
   - Password: `test123`
4. [ ] Click "Sign In"

**Expected:**
- ✅ Successfully logged in
- ✅ Redirected to dashboard or previous page
- ✅ User menu shows in header

---

### Test 4: Browse Tours 🗺️
**URL:** http://localhost:3000/tours

**Check:**
- [ ] Tours page loads
- [ ] Tour cards display with images
- [ ] Prices and ratings show
- [ ] Filter options work
- [ ] Search functionality works
- [ ] Click on a tour card

**Expected:** List of available tours with working filters

---

### Test 5: View Tour Details 👁️
**Click on:** "Ultimate Bali Adventure" tour

**Check:**
- [ ] Tour detail page loads
- [ ] Image gallery works
- [ ] Tour description displays
- [ ] Itinerary shows
- [ ] Reviews section visible
- [ ] Price and booking button present

**Expected:** Complete tour information page

---

### Test 6: Create a Booking 📅
**On Tour Detail Page:**

**Steps:**
1. [ ] Click "Book Now" button
2. [ ] Booking modal opens
3. [ ] Fill in booking form:
   - Travel Date: (select a future date)
   - Number of Travelers: 2
   - Full Name: `Test User`
   - Email: (your email)
   - Phone: `+1234567890`
   - Special Requests: `Test booking`
4. [ ] Accept terms
5. [ ] Click "Confirm Booking"

**Expected Results:**
- ✅ Booking created successfully
- ✅ Success animation plays
- ✅ Redirected to booking detail page
- ✅ **Check email** for booking confirmation
- ✅ **Admin email** should receive notification (admin@okabalitravel.com)

**Booking ID:** _________________ (note this down!)

---

### Test 7: View Booking Details 📋
**URL:** http://localhost:3000/bookings/[YOUR_BOOKING_ID]

**Check:**
- [ ] Booking detail page loads
- [ ] Tour information displays
- [ ] Travel dates show
- [ ] Contact information visible
- [ ] Price summary correct
- [ ] Payment status shows "PENDING"
- [ ] **Payment button is visible**

**Expected:** Complete booking information with pay button

---

### Test 8: Stripe Payment Flow 💳
**On Booking Detail Page:**

**Steps:**
1. [ ] Click "Pay USD $..." button
2. [ ] Redirected to Stripe Checkout
3. [ ] Fill in Stripe test card:
   - Card Number: `4242 4242 4242 4242`
   - Expiry: `12/34` (any future date)
   - CVC: `123`
   - ZIP: `12345`
4. [ ] Click "Pay"
5. [ ] Wait for redirect

**Expected Results:**
- ✅ Redirected to success page
- ✅ Success animation displays
- ✅ "Payment Successful" message
- ✅ **Check email** for payment receipt
- ✅ Back on booking page, status shows "CONFIRMED" and "PAID"

**Important:** For webhooks to work, you need Stripe CLI running!

---

### Test 9: My Bookings Page 📚
**URL:** http://localhost:3000/bookings

**Check:**
- [ ] All bookings list displays
- [ ] Booking cards show correct info
- [ ] Tabs work (All, Upcoming, Past, Cancelled)
- [ ] Status badges show correct colors
- [ ] Click on booking opens detail page

**Expected:** List of your bookings with filters

---

### Test 10: Wishlist 💝
**Steps:**
1. [ ] Go to any tour page
2. [ ] Click heart icon to add to wishlist
3. [ ] Go to http://localhost:3000/wishlist
4. [ ] Verify tour is in wishlist
5. [ ] Click "Remove" to test deletion

**Expected:**
- ✅ Items can be added
- ✅ Wishlist page shows saved items
- ✅ Items can be removed

---

### Test 11: Reviews ⭐
**On a Tour Page:**

**Steps:**
1. [ ] Scroll to reviews section
2. [ ] Click "Write a Review" (only if you have a booking)
3. [ ] Fill in:
   - Rating: 5 stars
   - Title: `Amazing Experience!`
   - Review: `This was an incredible tour...`
4. [ ] Submit review

**Expected:**
- ✅ Review submitted
- ✅ Shows in reviews list
- ✅ Tour rating updates

---

## Phase 2: Admin Panel Testing

### Test 12: Admin Login 👨‍💼
**URL:** http://localhost:3000/admin

**Steps:**
1. [ ] Sign out of regular user account
2. [ ] Go to admin URL
3. [ ] Enter credentials:
   - Email: `admin@okabalitravel.com`
   - Password: `admin123`
4. [ ] Click "Sign In"

**Expected:**
- ✅ Logged in as admin
- ✅ Admin dashboard loads

---

### Test 13: Admin Dashboard 📊
**URL:** http://localhost:3000/admin

**Check:**
- [ ] Dashboard overview displays
- [ ] Stats cards show correct numbers:
  - Total revenue
  - Total bookings
  - Total users
  - Total reviews
- [ ] Quick stats widget works
- [ ] Recent bookings list displays
- [ ] Booking status distribution chart shows
- [ ] Platform health metrics display

**Expected:** Complete analytics overview

---

### Test 14: Booking Management 📅
**URL:** http://localhost:3000/admin/bookings

**Test Actions:**
1. [ ] Bookings table loads
2. [ ] Stats cards show counts
3. [ ] Search functionality:
   - [ ] Search by tour name
   - [ ] Search by user email
   - [ ] Search by booking ID
4. [ ] Filters work:
   - [ ] Filter by status (Pending, Confirmed, etc.)
   - [ ] Filter by payment status
5. [ ] Click "..." menu on a booking
6. [ ] Test actions:
   - [ ] View booking details
   - [ ] Update booking status to "Confirmed"
   - [ ] Update payment status to "Paid"
   - [ ] (Don't delete, just verify option exists)

**Expected:**
- ✅ All filters and search work
- ✅ Can update booking status
- ✅ Can update payment status
- ✅ UI updates in real-time

---

### Test 15: User Management 👥
**URL:** http://localhost:3000/admin/users

**Test Actions:**
1. [ ] Users table loads
2. [ ] Stats show correct counts
3. [ ] Search users by name/email
4. [ ] Filter by role (All, Admin, User)
5. [ ] Click "..." menu on a user
6. [ ] Test viewing user details
7. [ ] Test role change:
   - [ ] Make a user an admin
   - [ ] Demote back to user
8. [ ] (Don't delete users, just verify option exists)

**Expected:**
- ✅ User list with activity metrics
- ✅ Can search and filter
- ✅ Can change user roles
- ✅ Activity counts display correctly

---

### Test 16: Review Moderation ⭐
**URL:** http://localhost:3000/admin/reviews

**Test Actions:**
1. [ ] Reviews list loads
2. [ ] Stats cards display
3. [ ] Search reviews
4. [ ] Filter by rating (1-5 stars)
5. [ ] Filter by response status
6. [ ] Click "Respond" on a review
7. [ ] Write admin response: `Thank you for your feedback!`
8. [ ] Submit response
9. [ ] Verify response shows under review

**Expected:**
- ✅ All reviews visible
- ✅ Can respond to reviews
- ✅ Responses display correctly
- ✅ Can edit responses

---

## Phase 3: Email Testing

### Test 17: Check All Emails 📧

**Expected Emails Received:**
1. [ ] **Welcome Email**
   - Subject: "Welcome to OkabaliTravel - Start Your Adventure! 🌏"
   - From: noreply@okabalitravel.com
   - Contains: Welcome message, features, dashboard link

2. [ ] **Booking Confirmation**
   - Subject: "Booking Confirmed: [Tour Name] ✈️"
   - Contains: Booking details, dates, price, what's next

3. [ ] **Payment Confirmation**
   - Subject: "Payment Received - Receipt for [Tour Name] ✅"
   - Contains: Payment receipt, transaction ID, total paid

4. [ ] **Admin Notification** (check admin email)
   - Subject: "🔔 New Booking: [Tour Name]"
   - Contains: Customer details, booking info

**Check Email Quality:**
- [ ] All emails display properly
- [ ] Links work correctly
- [ ] Images load (if any)
- [ ] Formatting is clean
- [ ] No broken styles
- [ ] Mobile responsive

---

## Phase 4: Error Handling

### Test 18: Error Scenarios 🚨

**Test Invalid Inputs:**
1. [ ] Try signing up with existing email → Shows error
2. [ ] Try logging in with wrong password → Shows error
3. [ ] Try booking without selecting date → Shows error
4. [ ] Try reviewing without booking → Disabled or error

**Test Access Control:**
1. [ ] Try accessing /admin without login → Redirects to signin
2. [ ] Try accessing /admin as regular user → Redirects
3. [ ] Try accessing /dashboard without login → Redirects

**Expected:** Proper error messages and access control

---

## Phase 5: Performance & UI

### Test 19: Performance ⚡
- [ ] Pages load quickly (< 2 seconds)
- [ ] Images load progressively
- [ ] No console errors
- [ ] Smooth animations
- [ ] Forms respond instantly

### Test 20: Responsive Design 📱
**Test on Different Sizes:**
- [ ] Desktop (1920px) - Full layout
- [ ] Tablet (768px) - Adapted layout
- [ ] Mobile (375px) - Mobile layout
- [ ] Admin panel responsive

**Check:**
- [ ] Navigation adapts
- [ ] Tables scroll horizontally on mobile
- [ ] Cards stack properly
- [ ] Buttons accessible

---

## Test Results Summary

### ✅ Passed Tests: _____ / 20
### ❌ Failed Tests: _____
### ⚠️ Issues Found: _____

---

## Common Issues & Solutions

### Issue: Emails Not Sending
**Solution:**
- Check `RESEND_API_KEY` in `.env`
- Check console logs for email errors
- Verify email address format

### Issue: Stripe Payment Fails
**Solution:**
- Check if Stripe CLI webhook is running
- Use test card: 4242 4242 4242 4242
- Check console for Stripe errors

### Issue: Admin Can't Login
**Solution:**
```bash
npm run db:seed
# Or
npx tsx scripts/add-admin.ts
```

### Issue: Bookings Not Showing
**Solution:**
- Check if you're logged in
- Verify booking was created (check console logs)
- Check database with `npx prisma studio`

---

## Notes & Observations

**What worked well:**
-

**What needs improvement:**
-

**Bugs found:**
-

**Feature requests:**
-

---

## Next Steps After Testing

Based on test results:

1. **If all tests pass (✅):**
   - Move to production deployment
   - Or add more admin features

2. **If issues found (⚠️):**
   - Document issues
   - Prioritize fixes
   - Re-test after fixes

3. **Performance issues:**
   - Optimize images
   - Add caching
   - Optimize database queries

---

**Testing Date:** _______________
**Tester:** _______________
**Version:** Phase 4 Complete
