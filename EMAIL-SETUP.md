# Email Notification System Setup Guide

This guide will help you set up email notifications for OkabaliTravel using Resend.

## Overview

The application sends automated emails for:
- ✉️ **Welcome Email** - When users sign up
- 📧 **Booking Confirmation** - When bookings are created
- 💳 **Payment Confirmation** - When payments are successful
- 🔔 **Admin Notifications** - When new bookings are created
- 📋 **Status Updates** - When booking status changes (optional)

## Prerequisites

- A Resend account (free tier available)
- Node.js and npm installed
- The project running locally

---

## Step 1: Create a Resend Account

1. Go to https://resend.com
2. Sign up for a free account
3. Verify your email address
4. Complete the onboarding process

**Free Tier includes:**
- 100 emails per day
- 3,000 emails per month
- Perfect for development and testing

---

## Step 2: Get Your API Key

1. Log in to your Resend dashboard
2. Go to **API Keys** in the left sidebar
3. Click **Create API Key**
4. Give it a name (e.g., "OkabaliTravel Dev")
5. Select permissions (Full Access recommended for development)
6. Click **Create**
7. **Copy the API key** - you won't be able to see it again!

---

## Step 3: Configure Environment Variables

1. Open your `.env` file in the project root
2. Add your Resend API key:

```env
# Email Configuration
RESEND_API_KEY="re_your_actual_api_key_here"
EMAIL_FROM="OkabaliTravel <noreply@okabalitravel.com>"
```

**Important Notes:**
- Replace `re_your_actual_api_key_here` with your actual API key
- The `EMAIL_FROM` address must be verified in Resend
- For testing, you can use Resend's test domain

---

## Step 4: Verify Your Domain (Production)

### For Development/Testing:
Resend provides a test domain `onboarding@resend.dev` that works immediately.

### For Production:

1. Go to **Domains** in your Resend dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `okabalitravel.com`)
4. Add the DNS records to your domain provider:
   - TXT record for domain verification
   - MX records for email delivery
   - DKIM records for authentication
5. Wait for DNS propagation (can take up to 48 hours)
6. Click **Verify Domain**

**Recommended DNS Records:**
```
Type: TXT
Name: @
Value: [Provided by Resend]

Type: MX
Name: @
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10

Type: TXT
Name: resend._domainkey
Value: [Provided by Resend]
```

---

## Step 5: Test Email Sending

### Option 1: Test via Signup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000/auth/signup

3. Create a new account with your real email address

4. Check your inbox for the welcome email

### Option 2: Test via API

Create a test script `test-email.ts`:

```typescript
import { sendWelcomeEmail } from "./src/lib/email-service";

async function test() {
  const result = await sendWelcomeEmail(
    "your-email@example.com",
    "Test User"
  );
  console.log("Result:", result);
}

test();
```

Run it:
```bash
npx tsx test-email.ts
```

---

## Email Templates Included

### 1. Welcome Email
**Trigger:** New user registration
**To:** New user
**Template:** `src/emails/Welcome.tsx`

**Content:**
- Welcome message
- Platform features overview
- Dashboard link
- Support information

### 2. Booking Confirmation Email
**Trigger:** New booking created
**To:** Customer
**Template:** `src/emails/BookingConfirmation.tsx`

**Content:**
- Booking details (ID, tour, dates, travelers)
- Total price
- What's next steps
- View booking link

### 3. Payment Confirmation Email
**Trigger:** Payment completed (Stripe webhook)
**To:** Customer
**Template:** `src/emails/PaymentConfirmation.tsx`

**Content:**
- Payment receipt
- Transaction details
- Booking reference
- Download receipt link

### 4. Admin Notification
**Trigger:** New booking created
**To:** Admin email
**Content:**
- New booking alert
- Customer details
- Booking summary
- Quick action links

### 5. Status Update Email
**Trigger:** Booking status change (via admin)
**To:** Customer
**Content:**
- Status change notification
- Updated booking info
- Next steps

---

## Email Flow Diagram

```
User Signs Up
    ↓
Welcome Email → User Inbox

User Creates Booking
    ↓
Booking Confirmation → User Inbox
    ↓
Admin Notification → Admin Inbox

User Pays (Stripe)
    ↓
Payment Confirmation → User Inbox

Admin Changes Status
    ↓
Status Update → User Inbox
```

---

## Customizing Email Templates

All email templates use React Email components for easy customization.

### Edit a Template

1. Open the template file (e.g., `src/emails/Welcome.tsx`)
2. Modify the content, styling, or structure
3. Templates use inline styles for maximum email client compatibility
4. Preview changes using React Email CLI (optional)

### Preview Templates (Optional)

Install React Email CLI:
```bash
npm install -g react-email
```

Start preview server:
```bash
react-email dev
```

Visit http://localhost:3000 to preview all templates.

---

## Email Configuration

### Changing Sender Email

Update `.env`:
```env
EMAIL_FROM="Your Company <contact@yourdomain.com>"
```

### Changing Admin Email

Update `src/lib/email-service.ts`:
```typescript
const adminEmail = "your-admin@yourdomain.com";
```

### Adding CC or BCC

In `src/lib/email.ts`, modify the `sendEmail` function:
```typescript
const data = await resend.emails.send({
  from: EMAIL_CONFIG.from,
  to,
  cc: ["cc@example.com"],  // Add this
  bcc: ["bcc@example.com"], // Add this
  subject,
  react,
  replyTo: EMAIL_CONFIG.replyTo,
});
```

---

## Troubleshooting

### Emails Not Sending

**Check 1: API Key**
- Verify `RESEND_API_KEY` in `.env`
- Ensure no spaces or quotes issues
- Check key hasn't been revoked

**Check 2: Sender Email**
- Must be from verified domain
- Use test domain `onboarding@resend.dev` for testing
- Check domain verification status

**Check 3: Console Logs**
```bash
# Look for these messages:
✅ "Welcome email sent to user@example.com"
✅ "Booking confirmation email sent to user@example.com"
❌ "Failed to send email: [error]"
```

**Check 4: Resend Dashboard**
- Go to Resend Dashboard → Emails
- Check delivery status
- Review bounce/complaint logs

### Emails Going to Spam

**Solutions:**
1. ✅ Verify your domain properly
2. ✅ Set up SPF, DKIM, and DMARC records
3. ✅ Use a real "from" email address
4. ✅ Avoid spam trigger words
5. ✅ Include unsubscribe link (for marketing emails)
6. ✅ Warm up your domain gradually

### Email Content Not Displaying

**Check:**
- Use inline styles (not CSS classes)
- Test in multiple email clients
- Avoid complex CSS features
- Use tables for layout (email clients prefer them)
- Test with React Email preview

---

## Rate Limits

### Free Tier Limits:
- 100 emails/day
- 3,000 emails/month
- Rate limited to prevent abuse

### Pro Tier ($20/month):
- 50,000 emails/month
- Higher sending rate
- Priority support
- Custom domains

### Handling Rate Limits:

Implement queuing system (optional):
```typescript
// src/lib/email-queue.ts
import { Queue } from "bull";

export const emailQueue = new Queue("emails");

emailQueue.process(async (job) => {
  const { to, subject, react } = job.data;
  return await sendEmail({ to, subject, react });
});

// Usage:
emailQueue.add({ to, subject, react });
```

---

## Security Best Practices

1. ✅ **Never commit API keys** - Use .env files
2. ✅ **Use environment variables** - Different keys for dev/prod
3. ✅ **Validate email addresses** - Prevent abuse
4. ✅ **Rate limit signup** - Prevent spam accounts
5. ✅ **Log email attempts** - Monitor for issues
6. ✅ **Handle failures gracefully** - Don't fail operations if email fails
7. ✅ **Sanitize user input** - Prevent injection attacks

---

## Production Checklist

Before going live:

- [ ] Domain verified in Resend
- [ ] DNS records properly configured
- [ ] SPF, DKIM, DMARC set up
- [ ] Production API key configured
- [ ] `EMAIL_FROM` uses your domain
- [ ] Admin email updated
- [ ] Email templates customized with branding
- [ ] Test all email triggers
- [ ] Monitor delivery rates
- [ ] Set up alerts for failures

---

## Monitoring & Analytics

### Resend Dashboard

Monitor:
- Delivery rate
- Open rate
- Click rate
- Bounce rate
- Complaint rate

### Application Logs

Check server logs for:
```
✅ Email sent successfully: { to, subject, id }
❌ Failed to send email: { error }
```

### Set Up Alerts

Create webhook in Resend to receive notifications for:
- Email delivered
- Email bounced
- Complaint received
- Email opened (requires tracking pixel)

---

## Alternative Email Providers

If Resend doesn't meet your needs, the code is structured to easily swap providers:

### SendGrid

```typescript
// src/lib/email.ts
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmail({ to, subject, html }) {
  return await sgMail.send({
    to,
    from: EMAIL_CONFIG.from,
    subject,
    html,
  });
}
```

### AWS SES

```typescript
// src/lib/email.ts
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: "us-east-1" });

export async function sendEmail({ to, subject, html }) {
  const command = new SendEmailCommand({
    Source: EMAIL_CONFIG.from,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Html: { Data: html } },
    },
  });

  return await ses.send(command);
}
```

---

## Support & Resources

- **Resend Documentation:** https://resend.com/docs
- **React Email Documentation:** https://react.email
- **Resend Status Page:** https://status.resend.com
- **Support Email:** support@resend.com

For application-specific issues:
- Check server console logs
- Review `src/lib/email-service.ts`
- Test email templates individually
- Contact development team

---

## FAQ

**Q: Can I test without setting up Resend?**
A: Yes! The app will log email attempts to console if `RESEND_API_KEY` is not set. Emails won't be sent, but the app won't crash.

**Q: How do I change email styling?**
A: Edit the template files in `src/emails/`. Use inline styles for best compatibility.

**Q: Can I use a different email service?**
A: Yes! Update `src/lib/email.ts` with your provider's SDK.

**Q: Why are emails slow to send?**
A: Email sending is synchronous. Consider implementing a queue for better performance.

**Q: Can I disable emails temporarily?**
A: Remove or comment out `RESEND_API_KEY` in `.env`. The app will log instead of sending.

**Q: How do I add attachments?**
A: Update the `sendEmail` function to include `attachments` parameter as per Resend docs.

---

**Last Updated:** 2025-11-21
**Version:** 1.0.0
