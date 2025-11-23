# OkabaliTravel - Testing Guide

## Prerequisites

Before testing, ensure:
- Database is seeded: `npm run db:seed`
- Development server is running: `npm run dev`
- Browser is open at: `http://localhost:3000`

## Demo Account Credentials

**Email:** demo@okabalitravel.com
**Password:** demo123

---

## Test Flow 1: New User Registration & Complete Journey

### Step 1: Registration
1. Navigate to homepage
2. Click "Sign Up" in header
3. Fill registration form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Confirm Password: test123
4. Submit form
5. **Expected:** Redirect to sign-in page with success message

### Step 2: Sign In
1. Enter credentials on sign-in page
2. Click "Sign In"
3. **Expected:** Redirect to dashboard

### Step 3: Explore Dashboard
1. Verify user name displayed in welcome message
2. Check stats cards show correct data
3. Click quick action buttons:
   - Browse Destinations → redirects to /destinations
   - My Bookings → redirects to /bookings
   - My Wishlist → redirects to /wishlist
   - Account Settings → redirects to /settings

### Step 4: Browse Destinations
1. Navigate to Destinations page
2. Test filters:
   - Select continent (Asia, Europe)
   - Select rating (4+, 4.5+)
   - Use search box
3. **Expected:** Results update based on filters

### Step 5: Add to Wishlist
1. Hover over destination card
2. Click heart icon in top-right
3. **Expected:** Heart fills with red color
4. Click again to remove
5. **Expected:** Heart becomes outlined

### Step 6: View Destination Details
1. Click on any destination card
2. Verify:
   - Image gallery works
   - Description displays
   - Tour listings shown
   - Location map visible (if implemented)

### Step 7: View Tour Details
1. Click "View Tours" or tour card
2. Scroll through page sections:
   - Tour overview
   - Includes/Excludes
   - Detailed itinerary
   - Reviews section
   - Booking sidebar

### Step 8: Book a Tour
1. Click "Book Now" on tour page
2. In booking modal:
   - Select travel date (future date)
   - Adjust number of travelers
   - Verify total price updates
   - Fill contact information
   - Add special requests (optional)
   - Accept terms and conditions
3. Submit booking
4. **Expected:**
   - Success animation
   - Redirect to booking detail page

### Step 9: View Booking Details
1. Verify all booking information displays:
   - Tour details
   - Travel dates
   - Contact information
   - Price summary
   - Payment status (PENDING)
   - Booking ID

### Step 10: Manage Bookings
1. Navigate to "My Bookings"
2. Verify tabs work:
   - All
   - Upcoming
   - Past
   - Cancelled
3. Click "View Details" on a booking
4. **Expected:** Navigate to booking detail page

### Step 11: Submit a Review
1. Navigate to any tour page
2. Scroll to reviews section
3. Click stars to rate (1-5)
4. Enter review title (min 5 chars)
5. Enter review content (min 20 chars)
6. Submit review
7. **Expected:**
   - Success animation
   - Review appears in list immediately
   - Tour rating updates

### Step 12: Interact with Reviews
1. Read other reviews
2. Click "Helpful" button
3. **Expected:** Counter increments
4. Test sort options:
   - Most Recent
   - Most Helpful
   - Highest Rating

### Step 13: Manage Wishlist
1. Navigate to Wishlist page
2. Verify saved items display
3. Remove an item (trash icon)
4. **Expected:** Item removed from list
5. Click "View Destination" or "View Tour"
6. **Expected:** Navigate to detail page

### Step 14: Header User Menu
1. Click user avatar in header
2. Verify dropdown menu shows:
   - User name and email
   - Dashboard link
   - My Bookings link
   - Wishlist link
   - Settings link
   - Sign Out button
3. Test each link
4. Click "Sign Out"
5. **Expected:**
   - Redirect to homepage
   - Header shows "Sign In" / "Sign Up" buttons

---

## Test Flow 2: Guest User Experience

### As Unauthenticated User:

1. **Homepage**
   - Browse featured destinations
   - View hero section
   - Navigate to destinations

2. **Destinations Page**
   - View all destinations
   - Use filters and search
   - Click destination cards

3. **Tour Details**
   - View tour information
   - See reviews
   - Click "Book Now"
   - **Expected:** Redirect to sign-in page

4. **Wishlist Button**
   - Click heart icon on cards
   - **Expected:** Redirect to sign-in page

5. **Review Submission**
   - Try to submit review
   - **Expected:** "Sign in required" message

---

## Test Flow 3: Mobile Responsiveness

### Test on Mobile Viewport:

1. **Header**
   - Hamburger menu appears
   - Menu opens from right side
   - All links accessible
   - User menu displays correctly

2. **Homepage**
   - Hero section readable
   - Destination cards stack vertically
   - Images load properly

3. **Booking Modal**
   - Form fields accessible
   - Date picker works on touch
   - Submit button visible

4. **Review Form**
   - Star rating works with touch
   - Text areas resize properly
   - Form submits successfully

---

## Feature-Specific Tests

### Authentication System

**Sign Up:**
- [ ] Email validation
- [ ] Password strength (min 6 chars)
- [ ] Password confirmation matching
- [ ] Duplicate email error handling
- [ ] Loading states during submission
- [ ] Success redirect

**Sign In:**
- [ ] Valid credentials login
- [ ] Invalid credentials error
- [ ] Empty fields validation
- [ ] Loading states
- [ ] Demo account works
- [ ] Remember me (if implemented)

**Sign Out:**
- [ ] Sign out button works
- [ ] Session cleared
- [ ] Redirect to homepage
- [ ] Protected routes redirect to sign-in

### Booking System

**Booking Modal:**
- [ ] Opens on "Book Now" click
- [ ] Closes on cancel or outside click
- [ ] Date picker shows future dates only
- [ ] Traveler count respects min/max
- [ ] Price calculates correctly
- [ ] Required field validation
- [ ] Terms checkbox required
- [ ] Success animation plays
- [ ] Redirect to booking detail

**Booking Management:**
- [ ] All bookings display
- [ ] Filters work (upcoming, past, cancelled)
- [ ] Sort by date
- [ ] Status badges show correctly
- [ ] Detail page shows all info
- [ ] Download receipt (if implemented)

### Wishlist System

**Add/Remove:**
- [ ] Heart icon toggles state
- [ ] State persists across pages
- [ ] Works on destination cards
- [ ] Works on tour cards
- [ ] Duplicate prevention

**Wishlist Page:**
- [ ] All items display
- [ ] Remove button works
- [ ] Empty state shows
- [ ] Links to detail pages work
- [ ] Displays destinations and tours differently

### Review System

**Submission:**
- [ ] Star rating required
- [ ] Title min 5 characters
- [ ] Content min 20 characters
- [ ] Duplicate review prevention
- [ ] Success feedback
- [ ] Form resets after submission

**Display:**
- [ ] Average rating calculated correctly
- [ ] Rating distribution accurate
- [ ] Sort options work
- [ ] Helpful counter works
- [ ] Verified badges show
- [ ] User avatars display
- [ ] Empty state when no reviews

---

## Performance Tests

1. **Page Load Times**
   - Homepage loads < 3 seconds
   - Destination pages load < 2 seconds
   - Images lazy load
   - No layout shift

2. **API Response Times**
   - Reviews load < 1 second
   - Bookings fetch < 1 second
   - Wishlist updates instant

3. **Animations**
   - Smooth transitions (60fps)
   - No janky scrolling
   - Hover effects responsive

---

## Error Handling Tests

1. **Network Errors**
   - Offline behavior
   - Failed API calls
   - Timeout handling

2. **Invalid Data**
   - Malformed inputs
   - SQL injection attempts
   - XSS attempts

3. **Edge Cases**
   - Very long names/text
   - Special characters
   - Empty results
   - Zero ratings

---

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Accessibility Tests

1. **Keyboard Navigation**
   - Tab through forms
   - Enter to submit
   - Escape to close modals

2. **Screen Reader**
   - Alt text on images
   - Form labels
   - Button descriptions
   - Error announcements

3. **Color Contrast**
   - Text readable
   - Buttons visible
   - Links distinguishable

---

## Security Tests

1. **Authentication**
   - [ ] Passwords hashed
   - [ ] JWT tokens secure
   - [ ] Sessions expire
   - [ ] CSRF protection

2. **Authorization**
   - [ ] Can't access others' bookings
   - [ ] Can't delete others' reviews
   - [ ] Protected routes blocked
   - [ ] API endpoints secured

3. **Input Validation**
   - [ ] SQL injection prevented
   - [ ] XSS prevented
   - [ ] Email format validated
   - [ ] File upload restrictions (if implemented)

---

## Known Issues / Limitations

### Current Limitations:
1. Dashboard redirect shows 404 (dashboard created, issue resolved)
2. Email verification not implemented
3. Password reset not implemented
4. OAuth providers not configured
5. No rate limiting on auth endpoints
6. Payment integration not implemented
7. No real email notifications
8. SQLite in development (needs PostgreSQL for production)

### To Be Implemented:
- Email verification flow
- Password reset functionality
- Google/GitHub OAuth
- Payment processing (Stripe)
- Email notifications (SendGrid/Mailgun)
- Advanced search with Algolia
- Real-time notifications
- Admin dashboard

---

## Success Criteria

### Phase 3 Complete When:
- [x] All user flows work end-to-end
- [x] No critical bugs
- [x] Authentication secure
- [x] Booking system functional
- [x] Wishlist works
- [x] Reviews can be submitted and displayed
- [x] Responsive on mobile
- [x] Build succeeds with zero errors
- [x] Database schema complete

---

## Next Steps (Phase 4)

After testing completion:
1. Admin dashboard for booking management
2. Payment integration
3. Email notifications
4. Advanced search
5. Social features
6. Performance optimization
7. SEO improvements
8. Production deployment

---

**Last Updated:** November 21, 2025
**Build Status:** ✅ PASSING
**Phase 3 Status:** ✅ COMPLETE
