# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payments for OkabaliTravel.

## Prerequisites

- A Stripe account (sign up at https://stripe.com)
- Node.js and npm installed
- The project running locally

## Step 1: Get Your Stripe API Keys

1. Log in to your Stripe Dashboard: https://dashboard.stripe.com
2. Click on **Developers** in the left sidebar
3. Click on **API keys**
4. You'll see two types of keys:
   - **Publishable key** (starts with `pk_test_` for test mode)
   - **Secret key** (starts with `sk_test_` for test mode) - Click "Reveal test key"

## Step 2: Configure Environment Variables

1. Open your `.env` file in the project root
2. Replace the placeholder values with your actual Stripe keys:

```env
# Stripe Payment Integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_actual_key_here"
STRIPE_SECRET_KEY="sk_test_your_actual_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
```

**Important:**
- Never commit your actual API keys to version control
- Use test keys (`pk_test_` and `sk_test_`) during development
- Use live keys (`pk_live_` and `sk_live_`) only in production

## Step 3: Set Up Stripe Webhooks (Development)

### Using Stripe CLI (Recommended for Local Development)

1. Install the Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows (using Scoop)
   scoop install stripe

   # Linux
   # Download from https://github.com/stripe/stripe-cli/releases
   ```

2. Log in to your Stripe account:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. The CLI will display your webhook signing secret (starts with `whsec_`). Copy this and update your `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_abc123..."
   ```

5. Keep the Stripe CLI running in a separate terminal while developing

### Manual Webhook Setup (For Deployed Apps)

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click **Add endpoint**
3. Enter your endpoint URL:
   ```
   https://yourdomain.com/api/stripe/webhook
   ```
4. Select events to listen for:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** and add it to your production `.env`

## Step 4: Test the Payment Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Start the Stripe webhook listener (in another terminal):
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

3. Create a test booking:
   - Navigate to http://localhost:3000
   - Browse tours and create a booking
   - You'll be redirected to your booking detail page

4. Click the "Pay Now" button
   - You'll be redirected to Stripe Checkout
   - Use test card: `4242 4242 4242 4242`
   - Use any future expiry date (e.g., 12/34)
   - Use any 3-digit CVC (e.g., 123)
   - Use any ZIP code

5. Complete the payment
   - You'll be redirected to the success page
   - The webhook will automatically update your booking status to CONFIRMED
   - Check the Stripe CLI terminal to see the webhook events

## Step 5: Verify Payment Updates

1. Check your booking in the app:
   - Go to My Bookings
   - Your booking should show "CONFIRMED" status
   - Payment status should be "PAID"

2. Check the Stripe Dashboard:
   - Go to Payments
   - You should see your test payment

3. Check the admin panel:
   - Log in as admin (admin@okabalitravel.com / admin123)
   - Go to Bookings
   - Verify the booking shows correct status

## Stripe Test Cards

Use these test cards in development:

| Card Number          | Description                    |
|---------------------|--------------------------------|
| 4242 4242 4242 4242 | Successful payment             |
| 4000 0000 0000 0002 | Declined (generic decline)     |
| 4000 0000 0000 9995 | Declined (insufficient funds)  |
| 4000 0025 0000 3155 | Requires authentication (3DS)  |

## Production Deployment

Before going live:

1. **Switch to Live Mode** in Stripe Dashboard
2. **Update environment variables** with live keys:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
   STRIPE_SECRET_KEY="sk_live_..."
   STRIPE_WEBHOOK_SECRET="whsec_..." # From production webhook
   ```

3. **Set up production webhook**:
   - Add your production domain in Stripe Dashboard
   - Update the webhook endpoint URL

4. **Enable payment methods** you want to support
5. **Review Stripe settings**:
   - Business details
   - Branding
   - Email receipts
   - Refund policies

## Webhook Events Handled

The application listens for these Stripe events:

- **checkout.session.completed**: Payment successful, booking confirmed
- **checkout.session.expired**: Checkout session expired without payment
- **payment_intent.succeeded**: Payment processed successfully
- **payment_intent.payment_failed**: Payment attempt failed

## Troubleshooting

### Webhook Not Working

1. Check if Stripe CLI is running
2. Verify `STRIPE_WEBHOOK_SECRET` in `.env`
3. Check webhook logs in Stripe Dashboard
4. Ensure your app is running on the correct port

### Payment Not Updating Booking

1. Check the Stripe CLI terminal for webhook events
2. Verify the booking ID is in the checkout session metadata
3. Check your server logs for errors
4. Ensure database is accessible

### Checkout Session Creation Fails

1. Verify `STRIPE_SECRET_KEY` is correct
2. Check that the booking exists and belongs to the user
3. Ensure booking amount is greater than minimum charge amount
4. Check server logs for detailed error messages

## Security Best Practices

1. ✅ Never expose secret keys in client-side code
2. ✅ Always verify webhook signatures
3. ✅ Use HTTPS in production
4. ✅ Validate all payment amounts on the server
5. ✅ Store only necessary payment data
6. ✅ Implement proper error handling
7. ✅ Log all payment transactions
8. ✅ Set up proper rate limiting
9. ✅ Monitor for suspicious activity

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Best Practices](https://stripe.com/docs/security/guide)

## Support

For Stripe-specific issues:
- Stripe Support: https://support.stripe.com
- Stripe Status: https://status.stripe.com

For application issues:
- Check the console logs
- Review the webhook event logs
- Contact the development team
